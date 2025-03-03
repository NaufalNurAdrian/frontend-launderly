import { Address } from "./address.type";
import { Employee } from "./employee.type";
import { Order } from "./order.type";
import { User } from "./user.type";

export enum DeliveryStatus {
  NOT_READY_TO_DELIVER = 'NOT_READY_TO_DELIVER',
  WAITING_FOR_DRIVER = 'WAITING_FOR_DRIVER',
  ON_THE_WAY_TO_OUTLET = 'ON_THE_WAY_TO_OUTLET',
  ON_THE_WAY_TO_CUSTOMER = 'ON_THE_WAY_TO_CUSTOMER',
  RECEIVED_BY_CUSTOMER = 'RECEIVED_BY_CUSTOMER'
}
  
  
export interface DeliveryOrder {
  id: number;
  deliveryNumber: string;
  deliveryStatus: DeliveryStatus;
  distance: number;
  deliveryPrice: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  driverId: number
  orderId: number;
  addressId: number;
  user: User;
  driver: Employee;
  order: Order;
  address: Address;
}