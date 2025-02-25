import { CreatePaymentBody, Payment, UpdatePaymentBody } from "@/types/payment";
import axios from "axios";
import { toast } from "react-toastify";

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
      `${base_url}/api/payment/${userId}`,
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
export async function createPayment(data: CreatePaymentBody): Promise<{ status: string; message: string }> {
  try {
    const token = getToken();
    const response = await axios.post<{ status: string; message: string }>(
      `${base_url}/api/payment`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Payment created successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to create payment. Please try again.");
    console.error("Error creating payment:", error);
    throw error;
  }
}

// 🟢 3. Update Payment (Midtrans Callback)
export async function updatePayment(data: UpdatePaymentBody): Promise<{ message: string }> {
  try {
    const response = await axios.post<{ message: string }>(`${base_url}/api/payment/midtrans-callback`, data);
    return response.data;
  } catch (error) {
    toast.error("Failed to update payment. Please try again.");
    console.error("Error updating payment:", error);
    throw error;
  }
}
