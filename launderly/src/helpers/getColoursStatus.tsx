import React from "react";

type OrderStatus =
  | "WAITING_FOR_PICKUP_DRIVER"
  | "ON_THE_WAY_TO_CUSTOMER"
  | "ON_THE_WAY_TO_OUTLET"
  | "ARRIVED_AT_OUTLET"
  | "READY_FOR_WASHING"
  | "BEING_WASHED"
  | "WASHING_COMPLETED"
  | "BEING_IRONED"
  | "IRONING_COMPLETED"
  | "BEING_PACKED"
  | "AWAITING_PAYMENT"
  | "READY_FOR_DELIVERY"
  | "WAITING_FOR_DELIVERY_DRIVER"
  | "BEING_DELIVERED_TO_CUSTOMER"
  | "RECEIVED_BY_CUSTOMER"
  | "COMPLETED";

const statusColors: { [key in OrderStatus]: string } = {
  WAITING_FOR_PICKUP_DRIVER: "text-yellow-500",
  ON_THE_WAY_TO_CUSTOMER: "text-yellow-500",
  ON_THE_WAY_TO_OUTLET: "text-yellow-500",
  ARRIVED_AT_OUTLET: "text-yellow-500",
  READY_FOR_WASHING: "text-cyan-500",
  BEING_WASHED: "text-blue-400",
  WASHING_COMPLETED: "text-blue-500",
  BEING_IRONED: "text-orange-500",
  IRONING_COMPLETED: "text-orange-400",
  BEING_PACKED: "text-orange-400",
  AWAITING_PAYMENT: "text-red-400",
  READY_FOR_DELIVERY: "text-green-500",
  WAITING_FOR_DELIVERY_DRIVER: "text-purple-500",
  BEING_DELIVERED_TO_CUSTOMER: "text-purple-500",
  RECEIVED_BY_CUSTOMER: "text-purple-500",
  COMPLETED: "text-green-500",
};

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  return (
    <span className={`px-2 py-1 font-bold ${statusColors[status] || "text-teal-500 text-"}`}>
      {status.replace(/_/g, " ")} {/* Mengubah underscore jadi spasi */}
    </span>
  );
};

export default OrderStatusBadge;
