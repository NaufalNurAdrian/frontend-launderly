import OrderProcessingPage from "@/components/feat-3/worker/processPage";
import ProtectedPage from "@/helpers/protectedRoutes";

export default function Process() {
  return (
    <ProtectedPage allowedRoles={["DRIVER", "WORKER"]}>
      <div className="bg-blue-300 w-full min-h-screen flex justify-center items-center">
        <OrderProcessingPage />
      </div>
    </ProtectedPage>
  );
}
