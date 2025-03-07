import { LaundryItem } from "./laundryItem.type";
import { Order } from "./order.type";

export interface OrderItem {
  id: number;
  qty: number;
  orderId: number;
  laundryItemId: number;
  laundryItem: LaundryItem;
  order: Order;
}
