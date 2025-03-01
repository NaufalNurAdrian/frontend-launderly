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
          </div>
        </div>
      </div>
    </div>
  );
}
