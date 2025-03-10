"use client";

import CompleteOrder from "@/components/feat-3/worker/completeOrder";
import ProtectedPage from "@/hoc/protectedRoutes";
import { useParams } from "next/navigation";

export default function ProcessPage() {
  const params = useParams();
  const orderId = params.orderId;

  return (
    <ProtectedPage allowedRoles={["DRIVER", "WORKER"]}>
      <div className="relative w-full min-h-screen flex justify-center items-center bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70" style={{ backgroundImage: "url('/carousel1.jpeg')" }}></div>
        <div className="relative p-6 sm:p-10 md:p-12 lg:p-14 xl:p-16 bg-opacity-90 rounded-lg shadow-lg z-10 w-full max-w-4xl mx-4 flex justify-center items-center">
          <CompleteOrder orderId={Number(orderId)} />
        </div>
      </div>
    </ProtectedPage>
  );
}
