export interface Reporter {
  id: number;
  name: string;
  city: string;
  available: boolean;
  ratePerMinute: number;
  createdAt: Date;
  updatedAt: Date;
}
