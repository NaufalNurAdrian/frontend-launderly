import { OrderItem } from "./orderItem.type";

export interface LaundryItem {
  id: number;
  itemName: string;
  isDelete: boolean;
  orderItem: OrderItem[];
}

export interface ItemApiResponse{
  getitem : LaundryItem[]
}