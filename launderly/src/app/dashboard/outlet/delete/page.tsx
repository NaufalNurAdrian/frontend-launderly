"use client";

import { useState } from "react";

import { withSuperAdmin } from "@/hoc/adminAuthorizaton";
import { useRole } from "@/hooks/useRole";
import HeaderOutletDelete from "./headerOutletDelete";
import OutletTableDelete from "./outletTableDelete";


function Outlet() {
  const [searchQuery, setSearchQuery] = useState("");
  const role = useRole();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <HeaderOutletDelete onSearch={handleSearch} />
        </div>
        
        <div>
          <OutletTableDelete searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}

export default withSuperAdmin(Outlet)