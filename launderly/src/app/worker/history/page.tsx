
import MobileHistoryTable from "@/components/feat-3/driver/history/HistoryCard";
import MobileDriverHistoryCard from "@/components/feat-3/driver/history/HistoryCard";
import OrderHistoryTable from "@/components/feat-3/worker/history";
import OrderMobileHistoryTable from "@/components/feat-3/worker/historyCard";
import Navbar from "@/components/feat-3/worker/workerNavbar";
import Sidebar from "@/components/feat-3/worker/WorkerSidebar";

export default function History() {
  return (
    <div className="flex bg-white w-full min-h-screen">
      <div>
          <span className="hidden lg:block"> <Sidebar /></span> 
          <span className="max-md:block lg:hidden"><Navbar/></span>
      </div>

      <div className="flex flex-col items-center w-full mt-10">
        <h1 className="m-4 text-3xl font-bold text-center text-blue-400">History</h1>

        <div className="lg:block hidden">
          <OrderHistoryTable />
        </div>

        <div className="w-full lg:hidden block mx-5">
          < OrderMobileHistoryTable/>
        </div>
      </div>
    </div>
  );
}