import { IUser } from '../user';
import { IDeliveryOrderF1 } from './deliveryOder';
import { IOutletF1 } from './outlet';
import { IPickupOrderF1 } from './pickupOrder';

export interface IAddressF1 {
  id: number;
  addressLine: string;
  city: string;
  isPrimary: boolean;
  latitude?: string
  longitude?: string
  isDelete: boolean;
  outletId?: number
  userId?: number
  outlet?: IOutletF1
  user?: IUser
  pickupOrder: IPickupOrderF1[];
  deliveryOrder: IDeliveryOrderF1[];
}
