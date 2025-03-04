"use client";
import { getNextDeliveryStatus, getNextPickupStatus } from "@/helpers/status";
import RequestButton from "./processButton";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  type: "pickup" | "delivery";
  status: string;
  address: string;
  orderNumber: string;
  onSuccess: (requestId: number, newStatus: string) => void;
  updateRequestStatus: (requestId: number, newStatus: string) => void;
}

const Modal = ({ isOpen, onClose, requestId, type, status, address, orderNumber, onSuccess, updateRequestStatus }: IModal) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 max-sm:mr-8">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <span className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-500">Confirm Process Request</h2>
          <button onClick={onClose} className=" text-gray-600  rounded hover:text-red-600 transition-colors">
            <X />
          </button>
        </span>
        <div className="flex justify-center">
          <img src="/services1.gif" alt="Processing" className="w-24 h-24 object-contain" />
        </div>
        <h1>Are you sure want to {type == "pickup" ? "pick up" : "delivery"} this order ?</h1>
        <div className="my-3 border border-blue-400 rounded-xl p-4 space-y-2">
          <div className="flex">
            <h1 className="lg:w-32 font-semibold">Order Id</h1>
            <h1>: {requestId}</h1>
          </div>
          <div className="flex">
            <h1 className="lg:w-32 font-semibold">Order Number</h1>
            <h1>: {orderNumber}</h1>
          </div>
          <div className="flex">
            <h1 className="lg:w-32 font-semibold">Address</h1>
            <h1>: {address}</h1>
          </div>
        </div>
        <RequestButton
          requestId={requestId}
          type={type}
          onSuccess={() => {
            const newStatus = type === "pickup" ? getNextPickupStatus(status) : getNextDeliveryStatus(status);
            updateRequestStatus(requestId, newStatus);
            onSuccess(requestId, newStatus);
          }}
          status={status}
          updateRequestStatus={updateRequestStatus}
        />
      </div>
    </div>
  );
};

export default Modal;
