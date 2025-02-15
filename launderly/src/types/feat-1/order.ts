
export enum OrderStatusF1 {
  WAITING_FOR_PICKUP_DRIVER = 'WAITING_FOR_PICKUP_DRIVER',
  ON_THE_WAY_TO_CUSTOMER = 'ON_THE_WAY_TO_CUSTOMER',
  ON_THE_WAY_TO_OUTLET = 'ON_THE_WAY_TO_OUTLET',
  ARRIVED_AT_OUTLET = 'ARRIVED_AT_OUTLET',
  READY_FOR_WASHING = 'READY_FOR_WASHING',
  BEING_WASHED = 'BEING_WASHED',
  WASHING_COMPLETED = 'WASHING_COMPLETED',
  BEING_IRONED = 'BEING_IRONED',
  IRONING_COMPLETED = 'IRONING_COMPLETED',
  BEING_PACKED = 'BEING_PACKED',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  WAITING_FOR_DELIVERY_DRIVER = 'WAITING_FOR_DELIVERY_DRIVER',
  BEING_DELIVERED_TO_CUSTOMER = 'BEING_DELIVERED_TO_CUSTOMER',
  RECEIVED_BY_CUSTOMER = 'RECEIVED_BY_CUSTOMER',
  COMPLETED = 'COMPLETED'
}

export interface IOrderF1 {
  id: number;
  orderNumber: string;
  orderStatus: OrderStatusF1;
  weight: number;
  laundryPrice: number;
  createdAt: Date;
  updatedAt: Date;
  pickupOrderId: number;
  isPaid: boolean;
  pickupOrder: PickupOrder;
  orderItem: OrderItem[];
  deliveryOrder: DeliveryOrder[];
  orderWorker: OrderWorker[];
  payment: Payment[];
}