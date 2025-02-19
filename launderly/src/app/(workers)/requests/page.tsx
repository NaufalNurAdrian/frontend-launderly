"use client"
import DriverRequestLists from "@/components/feat-3/driver/requestsLists";
import Navbar from "@/components/feat-3/navbar";
import Sidebar from "@/components/feat-3/sidebar";
import WorkerRequestLists from "@/components/feat-3/worker/requestsLists";
import { useRole } from "@/hooks/useRole";

export default function RequestsPage() {
    const role = useRole()
  return (
    <div className="flex bg-neutral-200 w-full min-h-screen">
      <div>
        <span className="hidden lg:block">
          <Sidebar/>
        </span>
        <span className="max-md:block lg:hidden">
          <Navbar />
        </span>
      </div>

      <div className="w-full flex flex-col items-center lg:mt-0 mt-20 lg:mx-0 mx-4">
        <h1 className="mt-8 mb-4 text-3xl text-blue-500 font-bold text-center">
          Requests Waiting for You...
        </h1>

        {role === "DRIVER" ? (
          <div className="flex lg:flex-row flex-col justify-between gap-16">
            <DriverRequestLists type="pickup" />
            <DriverRequestLists type="delivery" />
          </div>
        ) : (
          <WorkerRequestLists/>
        )}
      </div>
    </div>
  );
}