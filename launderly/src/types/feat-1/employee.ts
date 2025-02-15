import { IDeliveryOrderF1 } from "./deliveryOder";
import { IOutletF1 } from "./outlet";
import { IPickupOrderF1 } from "./pickupOrder";
import { IUserF1 } from "./user";

export enum EmployeeStationF1 {
  WASHING = 'WASHING',
  IRONING = 'IRONING',
  PACKING = 'PACKING',
}

export enum EmployeeWorkShiftF1 {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
}

export interface IEmployeeF1 {
  id: number;
  workShift: EmployeeWorkShiftF1;
  isSuperAdmin: boolean;
  station: EmployeeStationF1;
  userId: number;
  outletId: number;
  outlet: IOutletF1;
  user: IUserF1;
  pickupOrder: IPickupOrderF1[];
  deliveryOrder: IDeliveryOrderF1[];
  orderWorker: OrderWorker[];
}
