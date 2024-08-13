import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ErrorHandler } from '../helpers/helper';
import { CustomRequest } from '../types/types';

const Prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '';

interface JwtPayload {
  id: number;
  role: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = {
      id: decoded.id,
      role: decoded.role as 'ADMIN' | 'USER',
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const isAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN')
    // return res.status(403).json({ message: 'Admin access required' });
    return new ErrorHandler('Admin access required', 403);
  next();
};
