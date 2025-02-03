import RequestList from "@/components/feat-3/driver/requests/requestsLists";
import Sidebar from "@/components/feat-3/driver/sidebar";

export default function Requests() {
  return (
    <div className="flex bg-neutral-200 w-[98.9vw]">
      <Sidebar />

      <div className="w-screen flex flex-col justify-center items-center mt-10 min-h-screen lg:mx-0 mx-3">
        <h1 className="m-8 text-3xl text-blue-500 font-bold text-center">Requests Waiting you.. </h1>
        <div className="flex lg:flex-row flex-col justify-between gap-16">
          <div>
            <RequestList type="pickup" driverId={1} />
          </div>
          <div>
            <RequestList type="delivery" driverId={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
