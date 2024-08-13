import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Travelex!!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
