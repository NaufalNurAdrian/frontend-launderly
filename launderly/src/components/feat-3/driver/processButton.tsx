"use client";
import { useToken } from "@/hooks/useToken";
import { useState } from "react";
import toast from "react-hot-toast";

interface RequestButtonProps {
  requestId: number;
  status: string;
  onSuccess: () => void;
  type: "delivery" | "pickup"; 
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE
export default function RequestButton({ requestId, status, onSuccess, type }: RequestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useToken();

  const handleRequest = async () => {
    if (loading || isProcessing) return;
    setLoading(true);
    setIsProcessing(true);

    try {
      const response = await fetch(`${BASE_URL}/request`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, type }), 
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${type} status`);
      }

      toast.success(`${type === "delivery" ? "Delivery" : "Pickup"} proceed`);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update ${type} status: ${error.message}`);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (type === "delivery") {
      switch (status) {
        case "WAITING_FOR_DRIVER":
          return "Process Delivery";
        case "ON_THE_WAY_TO_OUTLET":
          return "Going to Customer";
        case "ON_THE_WAY_TO_CUSTOMER":
          return "Finish Order";
        case "RECEIVED_BY_CUSTOMER":
          return "Finish Order";
        default:
          return "Process Delivery";
      }
    } else {
      switch (status) {
        case "WAITING_FOR_DRIVER":
          return "Process Pickup";
        case "ON_THE_WAY_TO_CUSTOMER":
          return "Back to Outlet";
        case "ON_THE_WAY_TO_OUTLET":
          return "Finish Order";
        case "RECEIVED_BY_OUTLET":
          return "";
        default:
          return "Process Pickup";
      }
    }
  };

  const getButtonStyle = () => {
    if (type === "delivery") {
      switch (status) {
        case "WAITING_FOR_DRIVER":
          return "bg-blue-500 hover:bg-blue-600";
        case "ON_THE_WAY_TO_OUTLET":
        case "ON_THE_WAY_TO_CUSTOMER":
        case "RECEIVED_BY_CUSTOMER":
          return "bg-green-500 hover:bg-green-600";
        default:
          return "bg-gray-500 hover:bg-gray-600";
      }
    } else {
      switch (status) {
        case "WAITING_FOR_DRIVER":
          return "bg-blue-500 hover:bg-blue-600";
        case "ON_THE_WAY_TO_CUSTOMER":
        case "ON_THE_WAY_TO_OUTLET":
        case "RECEIVED_BY_OUTLET":
          return "bg-green-500 hover:bg-green-600";
        default:
          return "bg-gray-500 hover:bg-gray-600";
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleRequest}
        disabled={loading || isProcessing}
        className={`px-4 py-2 w-full rounded-lg ${
          loading || isProcessing ? "bg-blue-300 cursor-not-allowed" : getButtonStyle()
        } text-white`}
      >
        {loading ? "Processing..." : getButtonText()}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}