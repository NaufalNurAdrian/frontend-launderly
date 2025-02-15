import { IAddressF1 } from "./address";
import { IDeliveryOrderF1 } from "./deliveryOder";
import { IEmployeeF1 } from "./employee";
import { IUserNotificationF1 } from "./notification";
import { IPickupOrderF1 } from "./pickupOrder";

export interface IUserF1 {
  id: number;
  fullName: string;
  email: string;
  password: string;
  isVerify: boolean;
  role: RoleF1;
  profilePic: string; 
  token: string;
  tokenExpiresIn: Date; 
  createdAt: Date;
  isDelete: boolean;
  employee: IEmployeeF1; 
  address: IAddressF1[];
  pickupOrder: IPickupOrderF1[];
  deliveryOrder: IDeliveryOrderF1[];
  userNotification: IUserNotificationF1[];
}

export enum RoleF1 {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OUTLET_ADMIN = 'OUTLET_ADMIN',
  WORKER = 'WORKER',
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER',
}

export interface IFormUserF1 {
  fullName?: string;
  email?: string;
  password?: string;
  profilePic?: File[];
  newPassword?: string | null;
  addressLine?: string;
  city?: string;
  isPrimary: boolean;
  latitude?: string;
  longitude?: string;
}