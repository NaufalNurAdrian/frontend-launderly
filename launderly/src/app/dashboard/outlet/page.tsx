"use client";

import { useState } from "react";
import HeaderOutlet from "@/components/dashboard/outlet/headeroutlet";
import OutletTable from "@/components/dashboard/outlet/outlettable";

export default function Outlet() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <HeaderOutlet onSearch={handleSearch} />
        </div>
        
        <div>
          <OutletTable searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}