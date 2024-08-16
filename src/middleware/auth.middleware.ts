import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../helpers/helper';
import { CustomRequest, RoleName } from '../types/user.types';

interface JwtPayload {
  id: number;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    id?: number | JwtPayload;
    user?:
      | {
          id: number;
          role: RoleName;
        }
      | undefined;
  }
}
export const authorize: any = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN')
    return next(new ErrorHandler('Admin access required', 403));
  else {
    next();
  }
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authorization;
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return next(new ErrorHandler('Unauthorized', 401));
  }
};
