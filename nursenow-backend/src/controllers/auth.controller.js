"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.verifyOtp = exports.sendOtp = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// In-memory store for OTPs (For demo purposes. In production, use Redis)
const otpStore = new Map();
const JWT_SECRET = process.env.JWT_SECRET || 'nursenow_super_secret_key_2026';
const sendOtp = async (req, res) => {
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
        // ==========================================
        // 🚨 SMS PROVIDER INTEGRATION MOCK 🚨
        // Here is where we would call Twilio/MSG91
        // e.g., await twilioClient.messages.create({ body: `Your NurseNow OTP is ${otp}`, to: phone, from: 'NURSENOW' })
        // ==========================================
        console.log(`\n======================================`);
        console.log(`📱 [MOCK SMS] To: ${phone}`);
        console.log(`✉️ Message: Your NurseNow OTP is ${otp}`);
        console.log(`======================================\n`);
        res.json({ success: true, message: 'OTP sent successfully (Check console)' });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res) => {
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        res.json({
            success: true,
            isNewUser: false,
            token,
            user,
            message: 'Logged in successfully'
        });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.verifyOtp = verifyOtp;
const registerUser = async (req, res) => {
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
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({
            success: true,
            token,
            user: newUser,
            message: 'Account created successfully'
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Error creating account. Phone might already exist.' });
    }
};
exports.registerUser = registerUser;
//# sourceMappingURL=auth.controller.js.map