export interface ReviewResponse {
  content: string;
  rating: number;
  createdAt: Date;
  userId: number;
  tourId: number;
  user: {
    id: number;
    email: string;
  };
}
