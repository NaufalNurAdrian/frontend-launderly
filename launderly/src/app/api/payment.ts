import { CreatePaymentBody, Payment, UpdatePaymentBody } from "@/types/payment";
import axios from "axios";
import { toast } from "react-hot-toast";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

function getToken(): string {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("No token found. Please log in again.");
    throw new Error("No token found.");
  }
  return token;
}

// 🟢 1. Get Payment by User ID
export async function getPaymentById(userId: number): Promise<Payment[]> {
  try {
    const token = getToken();
    const response = await axios.get<{ success: boolean; payments: Payment[] }>(
      `${base_url}/payment/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.payments;
  } catch (error) {
    toast.error("Failed to get payments. Please try again.");
    console.error("Error getting payment:", error);
    throw error;
  }
}

// 🟢 2. Create Payment (New Payment)
export async function createPayment(orderId: number): Promise<string | null> {
  try {
    const token = getToken();
    const response = await axios.post(
      `${base_url}/payment`,
      { orderId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data && response.data.snapToken) {
      toast.success("Payment created successfully!");
      return response.data.snapToken;
    } else {
      toast.error("Failed to retrieve snapToken.");
      console.error("Response:", response.data);
      return null;
    }
  } catch (error) {
    toast.error("Failed to create payment. Please try again.");
    console.error("Error creating payment:", error);
    return null;
  }
}

