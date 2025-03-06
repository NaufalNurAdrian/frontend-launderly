"use client";

import { useState } from "react";
import EmployeeTable from "@/components/dashboard/employee/employeetable";
import HeaderEmployee from "@/components/dashboard/employee/headeremployee";
import { withSuperAdmin } from "@/hoc/adminAuthorizaton";

function Employee() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <HeaderEmployee onSearch={handleSearch} />
        </div>
        
        <div>
          <EmployeeTable searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}

export default withSuperAdmin(Employee)