import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CompleteOrderProps {
  orderId: number;
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
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return res.json(); // Pastikan ada return agar `toast.promise` bisa menangkap responsenya
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
        {loading ? "Processing..." : "Finish Order"}
      </button>
    </div>
  );
}
