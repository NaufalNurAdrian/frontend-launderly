import Navbar from "@/components/feat-3/navbar";
import WorkerProfile from "@/components/feat-3/workerProfile";
import Sidebar from "@/components/feat-3/workerSidebar";
import ProtectedPage from "@/helpers/protectedRoutes";

export default function WorkerProfilePage() {
  return (
    <ProtectedPage allowedRoles={["DRIVER", "WORKER"]}>
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
    </ProtectedPage>
  );
}
