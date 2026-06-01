import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const prisma = new PrismaClient();

// In-memory store for OTPs (For demo purposes. In production, use Redis)
const otpStore = new Map<string, string>();

const JWT_SECRET = process.env.JWT_SECRET || 'nursenow_super_secret_key_2026';

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.body;
    
    if (!identifier) {
      res.status(400).json({ success: false, message: 'Email or Mobile Number is required' });
      return;
    }

    const isEmail = identifier.includes('@');
    const normalizedId = isEmail ? identifier.toLowerCase().trim() : identifier.trim();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to store
    otpStore.set(normalizedId, otp);

    if (isEmail) {
      const SMTP_USER = process.env.SMTP_USER;
      const SMTP_PASS = process.env.SMTP_PASS;

      if (SMTP_USER && SMTP_PASS) {
        // REAL EMAIL INTEGRATION
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: SMTP_USER, pass: SMTP_PASS },
          });

          await transporter.sendMail({
            from: `"NurseNow" <${SMTP_USER}>`,
            to: normalizedId,
            subject: 'Your NurseNow Login OTP',
            text: `Your NurseNow verification code is ${otp}. Please do not share this with anyone.`,
            html: `<h3>Your NurseNow OTP is: <strong>${otp}</strong></h3><p>Please do not share this code with anyone.</p>`,
          });
          
          console.log(`\n======================================`);
          console.log(`✅ [REAL EMAIL] Sent via Nodemailer to: ${normalizedId}`);
          console.log(`======================================\n`);
        } catch (emailError: any) {
          console.error('Nodemailer Error:', emailError);
          res.status(500).json({ success: false, message: `Failed to send Email: ${emailError.message}` });
          return;
        }
      } else {
        // MOCK EMAIL
        console.log(`\n======================================`);
        console.log(`📧 [MOCK EMAIL] To: ${normalizedId}`);
        console.log(`✉️ Message: Your NurseNow OTP is ${otp}`);
        console.log(`======================================\n`);
        res.json({ success: true, message: 'Mock Email OTP sent (Check Render Logs)' });
        return;
      }
    } else {
      // It's a phone number
      const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
      const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
      const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

      if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
        // REAL SMS
        try {
          const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
          const formattedPhone = normalizedId.length === 10 ? `+91${normalizedId}` : normalizedId;

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
        // MOCK SMS
        console.log(`\n======================================`);
        console.log(`📱 [MOCK SMS] To: ${normalizedId}`);
        console.log(`✉️ Message: Your NurseNow OTP is ${otp}`);
        console.log(`======================================\n`);
        res.json({ success: true, message: 'Mock SMS OTP sent (Check Render Logs)' });
        return;
      }
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp, role } = req.body;

    if (!identifier || !otp) {
      res.status(400).json({ success: false, message: 'Identifier and OTP are required' });
      return;
    }

    const isEmail = identifier.includes('@');
    const normalizedId = isEmail ? identifier.toLowerCase().trim() : identifier.trim();
    const storedOtp = otpStore.get(normalizedId);

    if (storedOtp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }

    // Clear OTP
    otpStore.delete(normalizedId);

    // Find user by either email or phone
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: normalizedId } : { phone: normalizedId }
    });

    if (!user) {
      // User doesn't exist, tell frontend to register
      res.json({ 
        success: true, 
        isNewUser: true, 
        message: 'OTP verified. User not found, please register.' 
      });
      return;
    }

    // Direct Login!
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
    const { email, phone, name, age, gender, address, role } = req.body;

    if (!name || (!email && !phone)) {
      res.status(400).json({ success: false, message: 'Name and either Email or Phone are required' });
      return;
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : null;
    const normalizedPhone = phone ? phone.trim() : null;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          normalizedEmail ? { email: normalizedEmail } : {},
          normalizedPhone ? { phone: normalizedPhone } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      }
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'User already exists with this Email or Phone.' });
      return;
    }

    // Generate UHID
    const uhid = 'NN-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        phone: normalizedPhone,
        name,
        age: age ? parseInt(age) : null,
        gender,
        address,
        role: role === 'NURSE' ? 'NURSE' : 'PATIENT',
        uhid: role === 'PATIENT' ? uhid : null
      }
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: newUser,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Error creating account.' });
  }
};
