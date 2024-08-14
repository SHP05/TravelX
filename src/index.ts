import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
const PORT = process.env.PORT || 5000;
import bcrypt from 'bcryptjs';
import { prisma } from './db/index';
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

export const Register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(req.body);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    res.json({ message: 'User registered successfully!', data: user });
  } catch (err) {
    console.log(err);
    return res.json({ error: `Invalid user data ${err}` });
  }
};

app.post('/register', Register);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Travelex!!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
