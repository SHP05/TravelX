import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import tourRoutes from './routes/tours.routes';
import bookingRoutes from './routes/booking.routes';
import reviewRoutes from './routes/reviews.routes';
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/tour', tourRoutes);
app.use('/booking', bookingRoutes);
app.use('/review', reviewRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Travelex!!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
