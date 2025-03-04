import React from "react";
import { X } from "lucide-react";
import { IOrder } from "@/types/worker";
import ProcessOrderButton from "./processOrderButton";

interface ProcessOrderModalProps {
  order: IOrder;
  onClose: () => void;
  onConfirm: () => void;
}

const ProcessOrderModal: React.FC<ProcessOrderModalProps> = ({ order, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
        <span className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-00">Confirm Process Order</h2>
          <button onClick={onClose} className=" text-gray-600  rounded hover:text-red-600 transition-colors">
            <X />
          </button>
        </span>
        <div className="flex justify-center">
          <img src="/services1.gif" alt="Processing" className="w-24 h-24 object-contain" />
        </div>
        <p>Are you sure you want to process this order?</p>
        <div className="my-3 border border-blue-400 rounded-xl p-4 space-y-2">
          <div className="flex">
            <h1 className="lg:w-32 font-semibold">Order Id</h1>
            <h1>: {order.id}</h1>
          </div>
          <div className="flex">
            <h1 className="lg:w-32 font-semibold">Order Number</h1>
            <h1>: {order.orderNumber}</h1>
          </div>
          <div className="flex">
            <h1 className="lg:w-32 font-semibold">Weight</h1>
            <h1>: {order.weight}kg</h1>
          </div>
        </div>
        </div>
        <div className="flex justify-end space-x-2">
          <ProcessOrderButton orderId={order.id}/>
        </div>
      </div>
  );
};

export default ProcessOrderModal;
