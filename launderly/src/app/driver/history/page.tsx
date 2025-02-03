
import HistoryTable from "@/components/feat-3/driver/history/table";
import Sidebar from "@/components/feat-3/driver/sidebar";
import { formatTime } from "@/helpers/timeFormatter";

export default function History() {
  return (
    <div className="flex justify-between bg-white w-[100svw] min-h-screen ">
      <Sidebar />
      <div className="flex w-screen flex-col items-center mt-10">
        <h1 className="m-4 text-3xl font-bold text-center text-blue-400 "> History </h1>
        <div>
          <HistoryTable />
        </div>
      </div>
    </div>
  );
}
