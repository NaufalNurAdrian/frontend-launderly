import { Address } from './address.type';
import { DeliveryOrder } from './deliveryOrder.type';
import { Employee } from './employee.type';
import { UserNotification } from './notification.type';
import { PickupOrder } from './pickupOrder.type';

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  isVerify: boolean;
  role: Role;
  profilePic: string; 
  token: string;
  tokenExpiresIn: Date; 
  createdAt: Date;
  isDelete: boolean;
  employee: Employee; 
  address: Address[];
  pickupOrder: PickupOrder[];
  deliveryOrder: DeliveryOrder[];
  userNotification: UserNotification[];
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OUTLET_ADMIN = 'OUTLET_ADMIN',
  WORKER = 'WORKER',
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER',
}

export interface IFormUser {
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
