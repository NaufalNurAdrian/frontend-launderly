"use client"

import { ReportSalesChart } from "@/components/dashboard/report/reportSalesChart";
import HomeDashboard from "../../components/dashboard/homedashboard";
import { useState } from "react";
import HeaderReportFilter from "@/components/dashboard/report/headerReportFilter";
import ReportEmployeePerformanceChart from "@/components/dashboard/report/reportPerformanceChart";

function DashboardPage() {
  const [filterOutlet, setFilterOutlet] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");


  return (
    <div>
      <div className="flex flex-col justify-center items-center w-full h-full">
        <HeaderReportFilter setFilterOutlet={setFilterOutlet} setFilterMonth={setFilterMonth} setFilterYear={setFilterYear}/>
        <HomeDashboard/>
        <ReportSalesChart filterOutlet={filterOutlet} filterMonth={filterMonth} filterYear={filterYear}/>
        <ReportEmployeePerformanceChart/>
      </div>
    </div>
  );
}

export default DashboardPage;
