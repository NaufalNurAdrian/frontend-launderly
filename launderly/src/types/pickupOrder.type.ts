import { Address } from "./address.type";
import { Employee } from "./employee.type";
import { Order } from "./order.type";
import { Outlet } from "./outlet.type";
import { User } from "./user.type";

export enum PickupStatus {
  WAITING_FOR_DRIVER = 'WAITING_FOR_DRIVER',
  ON_THE_WAY_TO_CUSTOMER = 'ON_THE_WAY_TO_CUSTOMER',
  ON_THE_WAY_TO_OUTLET = 'ON_THE_WAY_TO_OUTLET',
  RECEIVED_BY_OUTLET = 'RECEIVED_BY_OUTLET'
}

export interface PickupOrder {
  id: number;
  pickupNumber: string;
  pickupStatus: PickupStatus;
  distance: number;
  pickupPrice: number;
  createdAt: Date;
  updatedAt: Date;
  isOrderCreated: boolean;
  userId: number;
  outletId: number;
  driverId: number;
  addressId: number;
  user: User;
  outlet: Outlet;
  order: Order[];
  driver: Employee;
  address: Address;
}

