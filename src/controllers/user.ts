import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../helpers/helper';
import { log } from 'console';

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role } = req.body;
    const existUser = await prisma.user.findUnique({ where: { email: email } });
    console.log(req.body);

    if (existUser) {
      return next(new ErrorHandler('User Already exist!', 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
    console.log(user);

    res
      .status(201)
      .json({ message: 'User registered successfully!', data: user });
  } catch (err) {
    return res.status(409).json(`Registration Internal server error: ${err}`);
  }
};

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      }
    );

    res.cookie('authorization', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    res.status(200).json({ message: 'Logged in successfully!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};

export const Logout = async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie('authorization')
    .json({ msg: 'User Logged Out successfully !' });
};
