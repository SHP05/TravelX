import { Request, Response } from 'express';
import { prisma } from '../db/index';
import { TourCustomResponse } from '../types/tour.types';

export const getAllTours = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tours: TourCustomResponse[] = await prisma.tour.findMany({
      select: {
        title: true,
        description: true,
        agentId: true,
        priceAdult: true,
        priceChild: true,
        contactNo: true,
        from: true,
        to: true,
        nights: true,
        Inclusion: true,
        paymentPolicy: true,
        meals: true,
        accommodation: true,
        transnfer: true,
        admin: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json({
      status: 'Success',
      data: tours,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching tours.' });
  }
};

export const createTour = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tour: TourCustomResponse = await prisma.tour.create({
      data: {
        ...req.body,
        agentId: req.body.agentId,
      },
      select: {
        title: true,
        description: true,
        agentId: true,
        priceAdult: true,
        priceChild: true,
        contactNo: true,
        from: true,
        to: true,
        nights: true,
        Inclusion: true,
        paymentPolicy: true,
        meals: true,
        accommodation: true,
        transnfer: true,
        admin: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'Success',
      data: tour,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while creating the tour.' });
  }
};
