import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db';
import { BookingCustomResponse } from '../types/booking.types';
// import catchAsync from "../utils/catchAsync";

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { tourId, userId, contactNo } = req.body;

    // Check if the tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Create the booking
    const booking: BookingCustomResponse = await prisma.booking.create({
      data: {
        userId,
        tourId,
        contactNo,
      },
      select: {
        id: true,
        userId: true,
        tourId: true,
        contactNo: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        booking,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { tour: true },
    });

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

//Delete bookings by user
export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = parseInt(req.params.id);
    // const userId = parseInt(req.params.userId);
    const userId = req.user?.id;
    // Find the booking and check if it belongs to the user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found',
      });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this booking',
      });
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.status(204).json({
      status: 'success',
      message: 'Booking deleted successfully!!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

//Get All bookings of any tour by Tour Agent
export const getAllBookingsForTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tourId = parseInt(req.params.tourId);

    // Check if the tour exists and belongs to the current admin
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    if (tour.agentId !== req.user?.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view bookings for this tour',
      });
    }

    // Get all bookings for the tour
    const bookings = await prisma.booking.findMany({
      where: { tourId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      massage: 'Internal server error',
    });
  }
};
