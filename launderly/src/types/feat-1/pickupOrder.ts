
import { IUser } from "../user";

export enum PickupStatusF1 {
  WAITING_FOR_DRIVER = 'WAITING_FOR_DRIVER',
  ON_THE_WAY_TO_CUSTOMER = 'ON_THE_WAY_TO_CUSTOMER',
  ON_THE_WAY_TO_OUTLET = 'ON_THE_WAY_TO_OUTLET',
  RECEIVED_BY_OUTLET = 'RECEIVED_BY_OUTLET'
}

export interface IPickupOrderF1 {
  id: number;
  pickupNumber: string;
  pickupStatus: PickupStatusF1;
  distance: number;
  pickupPrice: number;
  createdAt: Date;
  updatedAt: Date;
  isOrderCreated: boolean;
  userId: number;
  outletId: number;
  driverId: number;
  addressId: number;
  user: IUser;
  outlet: Outlet;
  order: Order[];
  driver: Employee;
  address: Address;
}
