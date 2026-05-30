"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// Route to send OTP (Login/Register phase 1)
router.post('/send-otp', auth_controller_1.sendOtp);
// Route to verify OTP (Login phase 2)
router.post('/verify-otp', auth_controller_1.verifyOtp);
// Route to register user (Registration phase 2)
router.post('/register', auth_controller_1.registerUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map