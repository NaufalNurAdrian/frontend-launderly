"use client";
import OrderHistoryTable from "@/components/feat-3/worker/workerHistory";
import OrderMobileHistoryTable from "@/components/feat-3/worker/historyCard";
import Sidebar from "@/components/feat-3/sidebar";
import Navbar from "@/components/feat-3/navbar";
import { useRole } from "@/hooks/useRole";
import MobileHistoryTable from "@/components/feat-3/driver/HistoryCard";
import HistoryTable from "@/components/feat-3/driver/driverHistory";

export default function History() {
  const role = useRole();
  return (
    <div className="flex bg-white w-full min-h-screen">
      <div>
        <span className="hidden lg:block">
          <Sidebar/>
        </span>
        <span className="max-md:block lg:hidden">
          <Navbar/>
        </span>
      </div>

      <div className="flex flex-col items-center w-full mt-10">
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
  );
}
