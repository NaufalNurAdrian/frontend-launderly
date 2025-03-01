import { Order } from "./order.type";

export enum PaymentStatus {
    SUCCESSED = 'SUCCESSED',
    CANCELLED = 'CANCELLED',
    DENIED = 'DENIED',
    EXPIRED = 'EXPIRED',
    PENDING = 'PENDING'
  }

  export interface Payment {
    id: number;
    invoiceNumber: string;
    amount: number;
    paymentMethode?: string | null;
    paymentStatus: PaymentStatus;
    snapToken?: string | null;
    snapRedirectUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
    orderId: number;
    order: Order;
  }