import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';

const prisma = new PrismaClient();

// In-memory store for OTPs (For demo purposes. In production, use Redis)
const otpStore = new Map<string, string>();

const JWT_SECRET = process.env.JWT_SECRET || 'nursenow_super_secret_key_2026';

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length < 10) {
      res.status(400).json({ success: false, message: 'Invalid phone number' });
      return;
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to store (expires in 5 mins logically, but Map doesn't auto-expire without TTL logic)
    otpStore.set(phone, otp);

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
      // REAL SMS INTEGRATION
      try {
        const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        
        // Ensure phone has country code. Defaulting to +91 (India) if 10 digits
        const formattedPhone = phone.length === 10 ? `+91${phone}` : phone;

        await twilioClient.messages.create({
          body: `Your NurseNow verification code is ${otp}. Please do not share this with anyone.`,
          from: TWILIO_PHONE_NUMBER,
          to: formattedPhone
        });
        
        console.log(`\n======================================`);
        console.log(`✅ [REAL SMS] Sent via Twilio to: ${formattedPhone}`);
        console.log(`======================================\n`);
      } catch (smsError: any) {
        console.error('Twilio Error:', smsError);
        res.status(500).json({ success: false, message: `Failed to send SMS via Twilio: ${smsError.message}` });
        return;
      }
    } else {
      // FALLBACK TO MOCK SMS if keys are missing
      console.log(`\n======================================`);
      console.log(`📱 [MOCK SMS] To: ${phone}`);
      console.log(`✉️ Message: Your NurseNow OTP is ${otp}`);
      console.log(`⚠️ WARNING: Twilio keys missing in .env, real SMS was NOT sent!`);
      console.log(`======================================\n`);
      
      // For free development testing, we send the OTP back to the frontend to display as a mock notification
      res.json({ success: true, message: 'Mock OTP sent', mockOtp: otp });
      return;
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp, role } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ success: false, message: 'Phone and OTP are required' });
      return;
    }

    const storedOtp = otpStore.get(phone);

    if (storedOtp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }

    // OTP Verified successfully. Clear it.
    otpStore.delete(phone);

    // Check if user exists in the database
    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      // User doesn't exist, tell frontend to navigate to Registration screen
      res.json({ 
        success: true, 
        isNewUser: true, 
        message: 'OTP verified. User not found, please register.' 
      });
      return;
    }

    // User exists. Generate JWT token and return user records
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      isNewUser: false,
      token,
      user,
      message: 'Logged in successfully'
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, name, age, gender, address, role } = req.body;

    if (!phone || !name) {
      res.status(400).json({ success: false, message: 'Phone and name are required' });
      return;
    }

    // Generate a unique UHID (e.g. NN-1A2B3C)
    const uhid = 'NN-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Save record to database
    const newUser = await prisma.user.create({
      data: {
        phone,
        name,
        age: age ? parseInt(age) : null,
        gender,
        address,
        role: role === 'NURSE' ? 'NURSE' : 'PATIENT',
        uhid: role === 'PATIENT' ? uhid : null // Only patients get a UHID
      }
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: newUser,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Error creating account. Phone might already exist.' });
  }
};
