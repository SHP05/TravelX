import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getAllTours, createTour } from '../controllers/tours';

const router = express.Router();

// Route to get all tours
router.get('/getalltours', authenticate, authorize, getAllTours);

// Route to create a new tour
router.post('/create', authenticate, authorize, createTour);

export default router;
