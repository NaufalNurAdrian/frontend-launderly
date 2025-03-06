import { OrderItem } from "./orderItem.type";

export interface LaundryItem {
  id: number;
  itemName: string;
  isDelete: boolean;
  qty: number,
  orderItem: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemApiResponse{
  message: string;
  getitem : LaundryItem[]
}