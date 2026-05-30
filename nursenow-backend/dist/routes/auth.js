"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
// Mock OTP storage (in production, use Redis)
const otpStore = new Map();
router.post('/send-otp', async (req, res) => {
    const { phone, role } = req.body;
    if (!phone)
        return res.status(400).json({ error: 'Phone number is required' });
    // Mock OTP generator
    const otp = '123456'; // In production: Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, otp);
    // Here you would call Fast2SMS or Twilio API
    console.log(`[MOCK] OTP for ${phone} is ${otp}`);
    res.json({ message: 'OTP sent successfully' });
});
router.post('/verify-otp', async (req, res) => {
    const { phone, otp, role } = req.body;
    if (!phone || !otp)
        return res.status(400).json({ error: 'Phone and OTP are required' });
    const storedOtp = otpStore.get(phone);
    if (storedOtp !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    otpStore.delete(phone); // Clear OTP
    try {
        // Find or create user
        let user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            let uhid = undefined;
            if (role === 'PATIENT') {
                uhid = 'UHID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            }
            user = await prisma.user.create({
                data: {
                    phone,
                    role: role || 'PATIENT',
                    uhid
                }
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map