import Navbar from "@/components/feat-3/navbar";
import WorkerProfile from "@/components/feat-3/workerProfile";
import Sidebar from "@/components/feat-3/workerSidebar";

export default function WorkerProfilePage() {
  return (
    <div className="flex min-h-screen">
      <div>
        <span className="hidden lg:block">
          <Sidebar />
        </span>
        <span className="max-md:block lg:hidden">
          <Navbar />
        </span>
      </div>
      <WorkerProfile />
    </div>
  );
}
