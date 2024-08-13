// types.ts
import { Request } from 'express';
import { Role } from '@prisma/client';
export type RoleName = 'ADMIN' | 'USER';

export interface User {
  id: number;
  email: string;
  password: string;
  role: RoleName;
}

export interface CustomRequest extends Request {
  user?: User;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      role: RoleName;
    };
  }
}
