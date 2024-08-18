import express from 'express';
import {
  createReview,
  getTourReviews,
} from '../controllers/reviews.controllers';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create', authenticate, createReview);
router.get('/getreviews/:tourId', authenticate, getTourReviews);

export default router;
