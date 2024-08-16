export interface TourCustomResponse {
  title: string;
  description: string;
  agentId: number;
  priceAdult: number;
  priceChild: number;
  contactNo: string;
  from: string;
  to: string;
  nights: number;
  Inclusion: string[];
  paymentPolicy: string[];
  meals: boolean;
  accommodation: boolean;
  transnfer: boolean;
  admin: {
    id: number;
    email: string;
  };
}
