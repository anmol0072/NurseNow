import { Router } from 'express';
import { createBooking, getPatientBookings, getAvailableBookings, acceptBooking, completeBooking } from '../controllers/bookings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createBooking);
router.get('/patient', authMiddleware, getPatientBookings);

// Nurse Routes
router.get('/available', authMiddleware, getAvailableBookings);
router.post('/:id/accept', authMiddleware, acceptBooking);
router.post('/:id/complete', authMiddleware, completeBooking);

export default router;
