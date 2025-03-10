import OrderProcessingPage from "@/components/feat-3/worker/processPage";
import ProtectedPage from "@/hoc/protectedRoutes";

export default function Process() {
  return (
    <ProtectedPage allowedRoles={["DRIVER", "WORKER"]}>
      <div className="bg-[url('/LaundryPattern.jpeg')] bg-repeat w-full min-h-screen flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-300 opacity-40 z-10"></div>
        <div className="z-20">
          <OrderProcessingPage />
        </div>
      </div>
    </ProtectedPage>
  );
}
