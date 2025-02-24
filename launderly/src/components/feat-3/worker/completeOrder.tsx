<<<<<<< HEAD
=======
import { useToken } from "@/hooks/useToken";
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CompleteOrderProps {
  orderId: number;
<<<<<<< HEAD
  workerId: number;
}

export default function CompleteOrder({ orderId, workerId }: CompleteOrderProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
    const token = localStorage.getItem("token")
  const finishOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/order/complete/${orderId}?workerId=${workerId}`, {
        method: "PATCH",
        headers: {  'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
=======
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function CompleteOrder({ orderId }: CompleteOrderProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useToken();

  const finishOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/order/complete/${orderId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

<<<<<<< HEAD
      return res.json(); // Pastikan ada return agar `toast.promise` bisa menangkap responsenya
=======
      return res.json();
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOrder = async () => {
    await toast.promise(finishOrder(), {
      loading: "Processing...",
      success: "Order Completed",
      error: "Error!",
    });

<<<<<<< HEAD
    router.push("/worker/requests");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 bg-white rounded-lg shadow-md w-[500px] h-[250px] z-50">
      <h1 className="text-blue-500 font-semibold text-lg">Complete Order and Back to Requests Page</h1>
      <button
        onClick={handleFinishOrder}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
=======
    router.push("/requests");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 bg-white rounded-lg shadow-md w-full max-w-lg px-6 py-8 lg:w-[500px] h-auto z-50">
      <h1 className="text-blue-500 font-semibold text-lg text-center">Complete Order and Back to Requests Page</h1>
      <button onClick={handleFinishOrder} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 w-full">
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
        {loading ? "Processing..." : "Finish Order"}
      </button>
    </div>
  );
}
