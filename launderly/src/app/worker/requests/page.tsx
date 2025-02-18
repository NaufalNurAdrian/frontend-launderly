import Navbar from "@/components/feat-3/navbar";
import Sidebar from "@/components/feat-3/sidebar";
import RequestList from "@/components/feat-3/worker/requestsLists";

export default function Requests() {
  return (
    <div className="flex bg-neutral-200 w-full min-h-screen">
      <div>
        <span className="hidden lg:block">
          <Sidebar role="worker" />
        </span>
        <span className="max-md:block lg:hidden">
          <Navbar role="worker" />
        </span>
      </div>

      <div className="w-full flex flex-col items-center lg:mt-0 mt-20 lg:mx-0 mx-4">
        <h1 className="mt-8 mb-4 text-3xl text-blue-500 font-bold text-center">Requests Waiting for You...</h1>
        <RequestList />
      </div>
    </div>
  );
}
