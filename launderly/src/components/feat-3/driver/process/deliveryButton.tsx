import { useState } from "react";
import toast from "react-hot-toast";

interface DeliveryButtonProps {
  requestId: number;
  status: string;
  onSuccess: () => void;
}

export default function DeliveryButton({ requestId, onSuccess, status }: DeliveryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleDelivery = async () => {
    if (loading || isProcessing) return;
    setLoading(true);
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/api/request", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, type: "delivery" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update delivery status");
      }

      toast.success("Delivery proceed");
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to update delivery status: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const getButtonText = () => {
    switch (status) {
      case "WAITING_FOR_DRIVER":
        return "Process Delivery";
      case "ON_THE_WAY_TO_OUTLET":
        return "going to customer";
      case "ON_THE_WAY_TO_CUSTOMER":
        return "Finish Order";
      case "RECEIVED_BY_CUSTOMER":
        return "Finish Order";
      default:
        return "Process Delivery";
    }
  };
  const getButtonStyle = () => {
    switch (status) {
      case "WAITING_FOR_DRIVER":
        return "bg-blue-500 hover:bg-blue-600";
      case "ON_THE_WAY_TO_OUTLET":
        return "bg-green-500 hover:bg-green-600";
      case "ON_THE_WAY_TO_CUSTOMER":
        return "bg-green-500 hover:bg-green-600";
      case "RECEIVED_BY_CUSTOMER":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div>
      <button onClick={handleDelivery} disabled={loading || isProcessing} className={`px-4 py-2 w-full rounded-lg ${getButtonStyle()}${loading || isProcessing ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
        {loading ? "Processing..." : getButtonText()}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
