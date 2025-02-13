"use client";
import { useState } from "react";
import toast from "react-hot-toast";

interface PickupButtonProps {
  requestId: number;
  status: string;
  onSuccess: () => void;
}

export default function PickupButton({ requestId, status, onSuccess }: PickupButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handlePickup = async () => {
    if (loading || isProcessing) return; 
    setLoading(true);
    setIsProcessing(true);

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token tidak ditemukan. Redirect ke halaman login...");
      window.location.href = "/login";
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/request", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, type: "pickup" }),
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
      setIsProcessing(false)
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "WAITING_FOR_DRIVER":
        return "Process Pickup";
      case "ON_THE_WAY_TO_CUSTOMER":
        return "Back to Outlet";
      case "ON_THE_WAY_TO_OUTLET":
        return "Finish order";
      case "RECEIVED_BY_OUTLET":
        return;
      default:
        return "Process Pickup";
    }
  };
  const getButtonStyle = () => {
    switch (status) {
      case "WAITING_FOR_DRIVER":
        return "bg-blue-500 hover:bg-blue-600";
      case "ON_THE_WAY_TO_CUSTOMER":
        return "bg-green-500 hover:bg-green-600";
      case "ON_THE_WAY_TO_OUTLET":
        return "bg-green-500 hover:bg-green-600";
      case "RECEIVED_BY_OUTLET":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  return (
    <div>
      <button onClick={handlePickup} disabled={loading || isProcessing} className={`px-4 py-2 w-full rounded-lg ${getButtonStyle()}${loading || isProcessing ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
        {loading ? "Processing..." : getButtonText()}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

