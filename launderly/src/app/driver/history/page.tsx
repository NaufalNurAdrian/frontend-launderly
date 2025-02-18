import MobileHistoryTable from "@/components/feat-3/driver/HistoryCard";
import HistoryTable from "@/components/feat-3/driver/driverHistory";
import Navbar from "@/components/feat-3/navbar";
import Sidebar from "@/components/feat-3/sidebar";

export default function History() {
  return (
    <div className="flex bg-white w-full min-h-screen ">
      <div>
        <span className="hidden lg:block">
          <Sidebar role="driver" />
        </span>
        <span className="max-md:block lg:hidden mb-14">
          <Navbar role="driver" />
        </span>
      </div>

      <div className="flex w-full flex-col items-center mt-10">
        <h1 className="m-4 text-3xl font-bold text-center text-blue-400 "> History </h1>

        <div className="lg:block hidden">
          <HistoryTable />
        </div>

        <div className="w-full lg:hidden block mx-2">
          <MobileHistoryTable />
        </div>
      </div>
    </div>
  );
}
