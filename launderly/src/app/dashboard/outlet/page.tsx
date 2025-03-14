"use client";

import { useState } from "react";
import { withSuperAdmin } from "@/hoc/adminAuthorizaton";
import { useRole } from "@/hooks/useRole";
import dynamic from "next/dynamic";

const HeaderOutlet = dynamic(() => import("@/components/dashboard/outlet/headeroutlet"), { ssr: false });
const OutletTable = dynamic(() => import("@/components/dashboard/outlet/outlettable"), { ssr: false });

function Outlet() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this state
  const role = useRole();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const refreshOutlets = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <HeaderOutlet onSearch={handleSearch} onRefresh={refreshOutlets} />
        </div>
        
        <div>
          <OutletTable searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}

export default withSuperAdmin(Outlet);