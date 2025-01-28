
import Sidebar from "@/components/feat-3/sidebar";
import RequestList from "@/components/feat-3/worker/requestList";
import { Toaster } from "react-hot-toast";

export default function Requests() {
  return (
    <div className="flex bg-white w-screen">
      <Sidebar />

      <div className="w-full flex flex-col justify-center mt-10 min-h-screen">
        <h1 className="m-8 text-3xl text-blue-500 font-bold text-center">Requests Waiting you.. </h1>
        <div className="flex justify-center gap-10">
          <div>
            <RequestList
              type="Pick Up"
              // fetchUrl=""
            />
          </div>

          <div>
            <RequestList
              type="Delivery"
              // fetchUrl=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
