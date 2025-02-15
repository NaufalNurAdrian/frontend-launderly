export interface IOrderItemF1 {
  id: number;
  qty: number;
  orderId: number;
  laundryItemId: number;
  laundryItem: LaundryItem;
  order: Order;
}