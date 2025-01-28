
import RequestList from "@/components/feat-3/worker/requestList";
import Sidebar from "@/components/feat-3/worker/sidebar";
import { Toaster } from "react-hot-toast";

export default function Requests() {
  return (
    <div className="flex bg-white w-screen">
      <Sidebar />

      <div className="w-screen flex flex-col justify-center mt-10 min-h-screen">
        <h1 className="m-4 text-2xl font-bold text-center">Requests </h1>
        <div className="flex justify-center gap-10">
          <div>
            <RequestList
              type="washing"
              // fetchUrl=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
