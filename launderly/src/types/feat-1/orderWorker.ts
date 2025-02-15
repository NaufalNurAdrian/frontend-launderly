import { EmployeeStationF1, IEmployeeF1 } from "./employee";
import { IOrderF1 } from "./order";

export interface IOrderWorkerF1 {
  id: number;
  orderId: number;
  workerId: number;
  station?: EmployeeStationF1 | null;
  isComplete: boolean;
  bypassRequest: boolean;
  bypassAccepted: boolean;
  bypassRejected: boolean;
  bypassNote: string;
  order: IOrderF1;
  worker: IEmployeeF1;
}