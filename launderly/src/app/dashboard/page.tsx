"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateRange, ReportTimeframe } from "@/types/report.types";
import { useReportData, useOutletComparison } from "@/hooks/useReportHooks";
import { useQuery } from "@tanstack/react-query";
import { fetchAllOutlet } from "@/services/outletService";
import ReportFilters from "@/components/dashboard/report/reportFilters";
import OverviewTab from "@/components/dashboard/report/tabs/overviewTab";
import TransactionsTab from "@/components/dashboard/report/tabs/transactionTab";
import OrdersTab from "@/components/dashboard/report/tabs/ordersTab";
import CustomersTab from "@/components/dashboard/report/tabs/customerTab";
import ComparisonTab from "@/components/dashboard/report/tabs/comparisonTab";
import EmployeePerformanceTab from "@/components/dashboard/report/tabs/employeePerformanceTab";


const ReportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState<ReportTimeframe>("monthly");
  const [outletId, setOutletId] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 + "");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear() + "");
  
  const { data: outletsResponse, isLoading: outletsLoading } = useQuery({
    queryKey: ["outlets"],
    queryFn: fetchAllOutlet,
  });

  const {
    data: reportData,
    loading: reportLoading,
    error: reportError,
  } = useReportData(outletId, timeframe, "comprehensive", dateRange);

  const { data: comparisonData, loading: comparisonLoading } =
    useOutletComparison(timeframe);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as ReportTimeframe);
    if (value !== "custom") {
      setDateRange(undefined);
    }
  };

  const handleOutletChange = (value: string) => {
    setOutletId(value === "all" ? undefined : parseInt(value));
  };

  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined) => {
    if (range) {
      setDateRange(range);
      setTimeframe("custom");
      
      if (range.from) {
        const fromDate = new Date(range.from);
        setSelectedMonth((fromDate.getMonth() + 1).toString());
        setSelectedYear(fromDate.getFullYear().toString());
      }
    } else {
      setDateRange(undefined);
    }
  };

  if ((reportLoading && !reportData) || outletsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-400 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
          <div className="mt-2 text-gray-500">Loading report data...</div>
        </div>
      </div>
    );
  }

  if (reportError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 p-4 mx-auto max-w-md">
        <div className="bg-red-50 shadow-md rounded-lg p-6 w-full">
          <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h3>
          <p className="text-gray-700 mb-4">We couldn't load the report data. Please try again later.</p>
          <div className="text-xs text-red-600 mt-2 p-2 bg-red-100 rounded">
            {reportError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Outlet Transaction Analysis
      </h1>

      <ReportFilters
        timeframe={timeframe}
        outletId={outletId}
        dateRange={dateRange}
        outletsResponse={outletsResponse}
        onTimeframeChange={handleTimeframeChange}
        onOutletChange={handleOutletChange}
        onDateRangeChange={handleDateRangeChange}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="overflow-x-auto">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview" className="flex-1 min-w-[100px]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex-1 min-w-[100px]">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 min-w-[100px]">
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex-1 min-w-[100px]">
              Customers
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex-1 min-w-[100px]">
              Outlet Comparison
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex-1 min-w-[100px]">
              Employee Performance
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <OverviewTab 
            reportData={reportData} 
            outletId={outletId?.toString() || "all"} 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab reportData={reportData} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab reportData={reportData} />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersTab reportData={reportData} />
        </TabsContent>

        <TabsContent value="comparison">
          <ComparisonTab 
            comparisonData={comparisonData} 
            comparisonLoading={comparisonLoading} 
          />
        </TabsContent>

        <TabsContent value="employees">
          <EmployeePerformanceTab
            outletId={outletId}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDashboard;