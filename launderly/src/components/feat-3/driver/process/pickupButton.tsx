"use client";
import { useState } from "react";
import toast from "react-hot-toast";

interface PickupButtonProps {
  driverId: number;
  requestId: number;
  status: string; 
  onSuccess: () => void;
}

export default function PickupButton({ driverId, requestId, status, onSuccess }: PickupButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePickup = async () => {
      if (loading || isProcessing) return; 
      setLoading(true);
      setIsProcessing(true); 
      
    try {
      const response = await fetch("http://localhost:8000/api/request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId, requestId, type: "pickup" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pickup status");
      }

      toast.success("Pickup proceed");
      onSuccess(); 
    } catch (error: any) {
      toast.error("Failed to update pickup status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "WAITING_FOR_DRIVER":
        return "Process Pickup";
      case "ON_THE_WAY_TO_CUSTOMER":
        return "On the Way to Customer";
      case "ON_THE_WAY_TO_OUTLET":
        return "On the Way to Outlet";
      case "RECEIVED_BY_OUTLET":
        return "Finish Order";
      default:
        return "Process Pickup";
    }
  };

  return (
    <button
      onClick={handlePickup}
      disabled={loading || isProcessing} 
      className={`px-4 py-2 w-full rounded-lg ${
        loading || isProcessing ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
      } text-white`}
    >
      {loading ? "Processing..." : getButtonText()}
    </button>
  );
}