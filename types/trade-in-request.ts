export type TradeInRequest = {
  id: string;
  userId: string;
  userEmail: string;
  category: string;
  brand: string;
  model: string;
  storage: string;
  condition: string;
  accessories: string;
  notes: string;
  expectedPrice?: number;
  status: "submitted";
  createdAt: string;
};
