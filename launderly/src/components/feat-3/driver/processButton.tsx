"use client";
import { processDriverOrder } from "@/api/driver";
import { getNextDeliveryStatus, getNextPickupStatus } from "@/helpers/status";
import { useToken } from "@/hooks/useToken";
import { useState } from "react";
import toast from "react-hot-toast";

interface RequestButtonProps {
  requestId: number;
  status: string;
  onSuccess: () => void;
  type: "delivery" | "pickup";
  updateRequestStatus: (requestId: number, newStatus: string) => void;
}

export default function RequestButton({ status, onSuccess, type, requestId, updateRequestStatus }: RequestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useToken();

  const handleRequest = async () => {
    if (loading || isProcessing) return;
    setLoading(true);
    setIsProcessing(true);
    if (!token) return;
    try {
      const response = await processDriverOrder(token, requestId, type);
      toast.success(`${type === "delivery" ? "Delivery" : "Pickup"} proceed`);
      const newStatus = type === "pickup" ? getNextPickupStatus(status) : getNextDeliveryStatus(status);
      updateRequestStatus(requestId, newStatus); 
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
          return "Finished";
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
          return "Finished";
        default:
          return "Process Pickup";
      }
    }
  };

  const getButtonStyle = () => {
    if (type === "delivery") {
      switch (status) {
        case "WAITING_FOR_DRIVER":
          return "bg-gradient-to-r from-blue-300 to-green-400 ";
        case "ON_THE_WAY_TO_OUTLET":
        case "ON_THE_WAY_TO_CUSTOMER":
        case "RECEIVED_BY_CUSTOMER":
          return "bg-gradient-to-r from-blue-300 to-green-400 ";
        default:
          return "bg-gray-500 hover:bg-gray-600";
      }
    } else {
      switch (status) {
        case "WAITING_FOR_DRIVER":
          return "bg-gradient-to-r from-blue-300 to-green-400 ";
        case "ON_THE_WAY_TO_CUSTOMER":
        case "ON_THE_WAY_TO_OUTLET":
        case "RECEIVED_BY_OUTLET":
          return "bg-gradient-to-l from-blue-300 to-green-400 ";
        default:
          return "bg-gray-500 hover:bg-gray-600";
      }
    }
  };

  return (
    <div>
      <button onClick={handleRequest} disabled={loading || isProcessing} className={`px-4 py-2 w-full rounded-lg ${loading || isProcessing ? "bg-gradient-to-r from-blue-300 to-green-400 animate-gradient cursor-not-allowed" : getButtonStyle()} text-white`}>
        {loading ? "Processing..." : getButtonText()}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
