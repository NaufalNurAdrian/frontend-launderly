import { useState } from "react";
import RequestButton from "./processButton";
import { MapPin, X } from "lucide-react";
import { calculateTimeDifference } from "@/helpers/timeCounter";
import { IRequest } from "@/types/driver";

interface IModalProps {
  requestId: number;
  status: string;
  type: "pickup" | "delivery";
  onSuccess: () => void;
  onClose: () => void;
  orderData: IRequest;
}

const RequestModal = ({ requestId, status, onSuccess, onClose, orderData, type }: IModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 w-full min-h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 z-50">
        <span className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Process Request</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-600 rounded hover:text-red-600 disabled:bg-gray-300"
          >
            <X />
          </button>
        </span>
        <div className="mb-4">
          <p className="text-blue-500 font-bold text-md sm:text-lg">{orderData.user.fullName || "Unknown User"}</p>
          {type === "delivery" ? (
            <p className="text-blue-600 text-md">{orderData.deliveryNumber}</p>
          ) : (
            <p className="text-blue-600 text-md">{orderData.pickupNumber}</p>
          )}
          <p className="text-xs sm:text-sm text-gray-500">Requested {calculateTimeDifference(orderData.createdAt)}</p>
          <div className="flex items-center">
            <MapPin size={20} className="text-blue-500" />
            {orderData.address.addressLine || "Unknown Address"}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1 mx-4">
            {Math.round(orderData.distance * 10) / 10} km from outlet
          </p>
        </div>

        <RequestButton requestId={requestId} status={status} onSuccess={handleSuccess} type={type} />
      </div>
    </div>
  );
};

export default RequestModal;