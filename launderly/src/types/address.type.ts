import { DeliveryOrder } from './deliveryOrder.type';
import { Outlet } from './outlet.type';
import { PickupOrder } from './pickupOrder.type';
import { User } from './user.type';

export interface Address {
  id: number;
  addressLine: string;
  city: string;
  isPrimary: boolean;
  latitude?: string
  longitude?: string
  isDelete: boolean;
  outletId?: number
  userId?: number
  outlet?: Outlet
  user?: User
  pickupOrder: PickupOrder[];
  deliveryOrder: DeliveryOrder[];
}

