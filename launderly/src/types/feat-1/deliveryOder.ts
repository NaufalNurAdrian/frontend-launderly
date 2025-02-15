import { IAddressF1 } from "./address";
import { IEmployeeF1 } from "./employee";
import { IOrderF1 } from "./order";
import { IUserF1 } from "./user";

export enum DeliveryStatusF1 {
  NOT_READY_TO_DELIVER = "NOT_READY_TO_DELIVER",
  WAITING_FOR_DRIVER = "WAITING_FOR_DRIVER",
  ON_THE_WAY_TO_OUTLET = "ON_THE_WAY_TO_OUTLET",
  ON_THE_WAY_TO_CUSTOMER = "ON_THE_WAY_TO_CUSTOMER",
  RECEIVED_BY_CUSTOMER = "RECEIVED_BY_CUSTOMER",
}

export interface IDeliveryOrderF1 {
  id: number;
  deliveryNumber: string;
  deliveryStatus: DeliveryStatusF1;
  distance: number;
  deliveryPrice: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  driverId: number;
  orderId: number;
  addressId: number;
  user: IUserF1;
  driver: IEmployeeF1;
  order: IOrderF1;
  address: IAddressF1;
}
