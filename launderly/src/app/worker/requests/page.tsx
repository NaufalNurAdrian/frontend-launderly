<<<<<<< HEAD

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
=======
import RequestList from "@/components/feat-3/worker/requestsLists";
import Navbar from "@/components/feat-3/worker/workerNavbar";
import Sidebar from "@/components/feat-3/worker/WorkerSidebar";

export default function Requests() {
  return (
    <div className="flex bg-white w-[98.8vw]">
     <div>
         <span className="hidden lg:block"> <Sidebar /></span> 
         <span className="max-md:block lg:hidden"><Navbar/></span>
     </div>

      <div className="w-screen flex flex-col justify-center items-center mt-10 min-h-screen lg:mx-0 mx-3">
        <h1 className="m-8 text-3xl text-blue-500 font-bold text-center">Requests Waiting you.. </h1>
        <div className="flex lg:flex-row flex-col justify-between gap-16">
          <div>
            <RequestList workerId={12} />
>>>>>>> 8171f226bddff7a9d8a0947144c2bb07a1ec3940
          </div>
        </div>
      </div>
    </div>
  );
}
