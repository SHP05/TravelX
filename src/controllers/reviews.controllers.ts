import { Request, Response } from 'express';
import { prisma } from '../db/index';
import { ReviewResponse } from '../types/reviews.types';

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { tourId, content, rating } = req.body;
    const userId = req.user?.id;
    console.log('Test: ', req.body);

    // Check if the tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Create the review
    const review: ReviewResponse = await prisma.review.create({
      data: {
        userId,
        tourId,
        content,
        rating,
        ...req.body,
      },
      select: {
        userId: true,
        tourId: true,
        content: true,
        rating: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

// Get all reviews for a tour
export const getTourReviews = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { tourId: Number(tourId) },
      include: { user: true }, // Include related user information
    });

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};
