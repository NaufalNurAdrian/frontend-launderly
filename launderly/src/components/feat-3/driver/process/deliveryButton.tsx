import { useState } from "react";
import toast from "react-hot-toast";

interface DeliveryButtonProps {
    driverId: number;
    requestId: number;
    status: string;
    onSuccess: () => void;
  }
  
  export default function DeliveryButton({ driverId, requestId, onSuccess, status }: DeliveryButtonProps) {
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false)

    const handleDelivery = async () => {
        if (loading || isProcessing) return; 
        setLoading(true);
        setIsProcessing(true); 

      try {
        const response = await fetch("http://localhost:8000/api/request", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driverId, requestId, type: "delivery" }),
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
            return "On the Way to Outlet";
          case "ON_THE_WAY_TO_CUSTOMER":
            return "On the Way to CUSTOMER";
          case "RECEIVED_BY_CUSTOMER":
            return "Finish Order";
          default:
            return "Process Delivery";
        }
      };
    
      return (
        <button
          onClick={handleDelivery}
          disabled={loading || isProcessing} 
          className={`px-4 py-2 w-full rounded-lg ${
            loading || isProcessing ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {loading ? "Processing..." : getButtonText()}
        </button>
      );
    }