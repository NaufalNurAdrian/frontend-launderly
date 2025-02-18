import RequestList from "@/components/feat-3/driver/requestsLists";
import Navbar from "@/components/feat-3/navbar";
import Sidebar from "@/components/feat-3/sidebar";

export default function Requests() {
  return (
    <div className="flex bg-neutral-200 w-full">
      <div>
        <span className="hidden lg:block">
          <Sidebar role="driver" />
        </span>
        <span className="max-md:block lg:hidden">
          <Navbar role="driver" />
        </span>
      </div>

      <div className="w-full flex flex-col justify-center items-center mt-10 min-h-screen lg:mx-0 mx-3">
        <h1 className="m-8 text-3xl text-blue-500 font-bold text-center">Requests Waiting you.. </h1>
        <div className="flex lg:flex-row flex-col justify-between gap-16">
          <RequestList type="pickup" />
          <RequestList type="delivery" />
        </div>
      </div>
    </div>
  );
}
