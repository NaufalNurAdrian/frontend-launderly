// 🟢 Define TypeScript Interfaces
export interface Payment {
    id: number;
    invoiceNumber: string;
    paymentStatus: "PENDING" | "SUCCESSED" | "CANCELLED" | "DENIED" | "EXPIRED";
    paymentMethode: string;
    createdAt: string;
  }
  
  export interface CreatePaymentBody {
    orderId: number;
    amount: number;
  }
  
  export interface UpdatePaymentBody {
    order_id: string;
    transaction_status: string;
    fraud_status: string;
    payment_type: string;
    currency: string;
    status_code: number;
    signature_key: string;
  }