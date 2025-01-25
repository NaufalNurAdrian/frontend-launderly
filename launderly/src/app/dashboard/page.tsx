import HomeDashboard from "@/components/dashboard/homedashboard";
import Image from "next/image";

function DashboardPage() {
  return (
    <div>
      <div className="flex justify-center items-center">
        <HomeDashboard/>
      </div>
    </div>
  );
}

export default DashboardPage;
