"use client";
import OrderHistoryTable from "@/components/feat-3/worker/workerHistory";
import OrderMobileHistoryTable from "@/components/feat-3/worker/workerHistoryCard";
import Navbar from "@/components/feat-3/navbar";
import { useRole } from "@/hooks/useRole";
import MobileHistoryTable from "@/components/feat-3/driver/driverHistoryCard";
import HistoryTable from "@/components/feat-3/driver/driverHistory";
import WorkerSidebar from "@/components/feat-3/workerSidebar";
import ProtectedPage from "@/hoc/protectedRoutes";

export default function History() {
  const role = useRole();
  return (
    <ProtectedPage allowedRoles={["DRIVER", "WORKER"]}>
      <div className="flex bg-[url('/LaundryPattern.jpeg')] bg-repeat w-full min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-300 opacity-40 z-0"></div>
        <div className="z-30">
          <span className="hidden lg:block">
            <WorkerSidebar />
          </span>
          <span className="max-md:block lg:hidden">
            <Navbar />
          </span>
        </div>

        <div className="flex flex-col items-center w-full mt-10 z-20">
          <h1 className="m-4 text-3xl font-bold text-center text-blue-500">History</h1>
          {role == "WORKER" ? (
            <>
              <div className="lg:block hidden">
                <OrderHistoryTable />
              </div>

              <div className="w-full lg:hidden block mx-2">
                <OrderMobileHistoryTable />
              </div>
            </>
          ) : (
            <>
              <div className="lg:block hidden">
                <HistoryTable />
              </div>

              <div className="w-full lg:hidden block mx-2">
                <MobileHistoryTable />
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
