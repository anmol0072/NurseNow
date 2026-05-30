import { Router } from 'express';
import { sendOtp, verifyOtp, registerUser } from '../controllers/auth.controller';

const router = Router();

// Route to send OTP (Login/Register phase 1)
router.post('/send-otp', sendOtp);

// Route to verify OTP (Login phase 2)
router.post('/verify-otp', verifyOtp);

// Route to register user (Registration phase 2)
router.post('/register', registerUser);

export default router;
