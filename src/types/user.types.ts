import { Request } from 'express';
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
