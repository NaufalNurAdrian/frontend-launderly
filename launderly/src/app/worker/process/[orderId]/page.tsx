"use client";

import CompleteOrder from "@/components/feat-3/worker/completeOrder";
import { useParams } from "next/navigation";

export default function ProcessPage() {
  const params = useParams();
  const orderId = params.orderId;

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: "url('/carousel1.jpeg')" }}>
      </div>

      <div className="relative bg-opacity-90 p-10 rounded-lg shadow-lg z-10">
        <CompleteOrder orderId={Number(orderId)} workerId={12} />
      </div>
    </div>
  );
}
