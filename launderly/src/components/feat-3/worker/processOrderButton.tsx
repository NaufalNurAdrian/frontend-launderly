"use client";
import { useToken } from "@/hooks/useToken";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProcessOrderButtonProps {
  orderId: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export default function ProcessOrderButton({ orderId }: ProcessOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const token = useToken();

  const handleProcessOrder = async () => {
    setIsLoading(true);
    setError(null);
    if (!token) {
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/order/create/${orderId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) {
        toast.error("Failed to process");
      }
      router.push(`/requests/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleProcessOrder} disabled={isLoading} className="px-4 py-2 w-full rounded-lg bg-gradient-to-r from-blue-300 to-green-400 text-white mt-2 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
        {isLoading ? "Processing.." : "Process Order"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
