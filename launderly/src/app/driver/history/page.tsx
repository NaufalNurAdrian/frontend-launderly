import MobileHistoryTable from "@/components/feat-3/driver/history/HistoryCard";
import HistoryTable from "@/components/feat-3/driver/history/table";
import Navbar from "@/components/feat-3/driver/navbar";
import Sidebar from "@/components/feat-3/driver/sidebar";
import { formatTime } from "@/helpers/timeFormatter";

export default function History() {
  return (
    <div className="flex justify-between bg-white w-[100svw] min-h-screen ">
      <div>
        <span className="hidden lg:block">
          {" "}
          <Sidebar />
        </span>
        <span className="block lg:hidden">
          <Navbar />
        </span>
      </div>

      <div className="flex w-screen flex-col items-center mt-10">
        <h1 className="m-4 text-3xl font-bold text-center text-blue-400 "> History </h1>

        <div className="lg:block hidden">
          <HistoryTable />
        </div>

        <div className="w-full lg:hidden block mx-5">
          <MobileHistoryTable />
        </div>
      </div>
    </div>
  );
}
