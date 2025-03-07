import { Employee, EmployeeStation } from "./employee.type";
import { Order } from "./order.type";

export interface OrderWorker {
  id: number;
  orderId: number;
  workerId: number;
  station?: EmployeeStation | null;
  isComplete: boolean;
  bypassRequest: boolean;
  bypassAccepted: boolean;
  bypassRejected: boolean;
  bypassNote: string;
  order: Order;
  worker: Employee;
}