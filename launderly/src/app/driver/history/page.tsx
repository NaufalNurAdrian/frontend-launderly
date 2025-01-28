import HistoryTable from "@/components/feat-3/history/table";
import Sidebar from "@/components/feat-3/sidebar";
import { formatTime } from "@/helpers/timeFormatter";

export default function History() {
  return (
    <div className="flex justify-between bg-white w-[100svw] min-h-screen ">
      <Sidebar />

      <div className="flex flex-col justify-center items-center mt-10">
        <h1 className="m-4 text-2xl font-bold text-center"> History </h1>
        <div>
            <HistoryTable 
            orderId={0}
            orderType="pick up"
            time={formatTime(new Date())}
            date={new Date().toISOString()}
            />
        </div>
      </div>
    </div>
  );
}
