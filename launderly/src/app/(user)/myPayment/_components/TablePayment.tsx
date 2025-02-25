"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

// 🟢 Mock API Calls (Gantilah dengan API asli)
const getPaymentById = async (userId: number): Promise<Payment[]> => {
  return [
    {
      id: 1,
      invoiceNumber: "INV-123",
      paymentStatus: "PENDING",
      paymentMethode: "Credit Card",
      createdAt: "2024-02-25T12:00:00Z",
    },
  ];
};

const createPayment = async (data: CreatePaymentBody) => {
  console.log("Creating payment with:", data);
  return { success: true };
};

const updatePayment = async (data: UpdatePaymentBody) => {
  console.log("Updating payment with:", data);
  return { success: true };
};

// 🟢 Main Component
const TablePayment = ({ user }: { user: { id: number } }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Payments
  const fetchUserPayments = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getPaymentById(user.id);
      setPayments(response); 
    } catch (err) {
      setError("Failed to fetch payments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPayments();
  }, []);

  // Create Payment
  const handleCreatePayment = async () => {
    try {
      await createPayment({ orderId: 123, amount: 50000 }); 
      toast.success("Payment created successfully!");
      fetchUserPayments();
    } catch (err) {
      toast.error("Failed to create payment.");
    }
  };


  return (
    <div>
      <h2 className="text-xl font-bold">Payment Table</h2>

      {loading && <p>Loading payments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <button onClick={handleCreatePayment} className="px-4 py-2 bg-blue-500 text-white">
        Create Payment
      </button>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Invoice</th>
            <th>Status</th>
            <th>Method</th>
            <th>Created At</th>

          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-t">
              <td>{payment.id}</td>
              <td>{payment.invoiceNumber}</td>
              <td>{payment.paymentStatus}</td>
              <td>{payment.paymentMethode}</td>
              <td>{new Date(payment.createdAt).toLocaleString()}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePayment;
