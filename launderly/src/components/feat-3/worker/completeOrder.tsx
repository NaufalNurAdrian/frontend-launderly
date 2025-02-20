import { useToken } from "@/hooks/useToken";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CompleteOrderProps {
  orderId: number;
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
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return res.json();
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

    router.push("/requests");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 bg-white rounded-lg shadow-md w-full max-w-lg px-6 py-8 lg:w-[500px] h-auto z-50">
      <h1 className="text-blue-500 font-semibold text-lg text-center">Complete Order and Back to Requests Page</h1>
      <button onClick={handleFinishOrder} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 w-full">
        {loading ? "Processing..." : "Finish Order"}
      </button>
    </div>
  );
}
