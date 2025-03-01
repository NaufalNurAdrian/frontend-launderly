import { DeliveryOrder } from "./deliveryOrder.type";
import { OrderWorker } from "./orderWorker.type";
import { Outlet } from "./outlet.type";
import { PickupOrder } from "./pickupOrder.type";
import { User } from "./user.type";

export enum EmployeeStation {
  WASHING = 'WASHING',
  IRONING = 'IRONING',
  PACKING = 'PACKING',
}

export enum EmployeeWorkShift {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
}

export interface Employee {
  id: number;
  workShift: EmployeeWorkShift;
  station: EmployeeStation;
  userId: number;
  outletId: number;
  outlet: Outlet;
  user: User;
  pickupOrder: PickupOrder[];
  deliveryOrder: DeliveryOrder[];
  orderWorker: OrderWorker[];
}

export interface AddEmployeeInput {
  fullName: string;
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "OUTLET_ADMIN" | "WORKER" | "DRIVER";
  station?: "WASHING" | "IRONING" | "PACKING"; // Opsional, hanya untuk WORKER
  workShift?: "DAY" | "NIGHT"; // Opsional, hanya untuk WORKER & OUTLET_ADMIN
  outletId: number; // Wajib untuk OUTLET_ADMIN, WORKER, dan DRIVER
}


export interface EmployeeApiResponse {
  message: string;
  employees: Employee[];
  totalPages: number;
  currentPage: number;
}