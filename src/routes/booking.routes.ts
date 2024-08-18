import express from 'express';
import {
  createBooking,
  getUserBookings,
  deleteBooking,
  getAllBookingsForTour,
} from '../controllers/booking.controllers';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// User routes
router.post('/create', authenticate, createBooking);
router.get('/getuserbooking', authenticate, getUserBookings);
router.delete('/delete/:id', authenticate, authorize, deleteBooking);
// // Admin (Tour Agent) routes
router.get(
  '/getbookedtour/:tourId',
  authenticate,
  authorize,
  getAllBookingsForTour
);

export default router;
