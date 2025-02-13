"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProcessOrderButtonProps {
  orderId: number;
  workerId: number;
}

export default function ProcessOrderButton({ orderId, workerId }: ProcessOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const token = localStorage.getItem("token");
  const handleProcessOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/order/create/${orderId}?workerId=${workerId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Gagal memproses pesanan");
      }

      const data = await response.json();
      console.log("Pesanan berhasil diproses:", data);

      router.push(`/worker/requests/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleProcessOrder} disabled={isLoading} className="px-4 py-2 w-full rounded-lg bg-blue-500 hover:bg-blue-400 text-white mt-2 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
        {isLoading ? "Processing" : "Process Order"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
