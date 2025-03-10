"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateRange, ReportTimeframe } from "@/types/report.types";
import { useReportData, useOutletComparison } from "@/hooks/useReportHooks";
import ReportFilters from "@/components/dashboard/report/reportFilters";
import OverviewTab from "@/components/dashboard/report/tabs/overviewTab";
import TransactionsTab from "@/components/dashboard/report/tabs/transactionTab";
import OrdersTab from "@/components/dashboard/report/tabs/ordersTab";
import CustomersTab from "@/components/dashboard/report/tabs/customerTab";
import ComparisonTab from "@/components/dashboard/report/tabs/comparisonTab";
import EmployeePerformanceTab from "@/components/dashboard/report/tabs/employeePerformanceTab";
import { useRole } from "@/hooks/useRole";
import OverviewOutletTab from "@/components/dashboard/report/tabs/overviewOutletTab";
import { ChevronDown } from "lucide-react";
import { OutletApiResponse } from "@/types/outlet.type";
import { fetchAllOutlet } from "@/services/outletService";

const ReportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState<ReportTimeframe>("monthly");
  const [outletId, setOutletId] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 + "");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear() + "");
  const [tabsOverflow, setTabsOverflow] = useState(false);
  const [outletsResponse, setOutletsResponse] = useState<OutletApiResponse>();
  const [outletsLoading, setOutletsLoading] = useState<boolean>(true);
  const [outletsError, setOutletsError] = useState<string | null>(null);
  // Flag untuk menandai sedang dalam proses pemilihan custom date range
  const [isSelectingDateRange, setIsSelectingDateRange] = useState<boolean>(false);
  
  // Use ref instead of state to avoid re-renders
  const refreshCountRef = useRef<number>(0);
  const shouldRefetchRef = useRef<boolean>(false);
  
  const role = useRole();
  const isSuperAdmin = role === "SUPER_ADMIN";
  
  // Function to mark that we need to refetch data
  const triggerRefetch = useCallback(() => {
    refreshCountRef.current += 1;
    shouldRefetchRef.current = true;
  }, []);
  
  useEffect(() => {
    const checkOverflow = () => {
      const smallScreen = window.innerWidth < 768;
      const manyTabs = isSuperAdmin && smallScreen;
      setTabsOverflow(manyTabs);
    };
    
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [isSuperAdmin]);
  
  useEffect(() => {
    const fetchOutlet = async () => {
      try {
        setOutletsLoading(true);
        const response: OutletApiResponse = await fetchAllOutlet();
        setOutletsResponse(response);
      } catch (error) {
        console.error("Error fetching outlets:", error);
        setOutletsError("Failed to fetch outlets");
      } finally {
        setOutletsLoading(false);
      }
    };

    if (isSuperAdmin) {
      fetchOutlet();
    } else {
      setOutletsLoading(false);
    }
  }, [isSuperAdmin]);
  
  useEffect(() => {
    if (!isSuperAdmin && 
        activeTab !== "overview" && 
        activeTab !== "employees") {
      setActiveTab("overview");
    }
  }, [role, activeTab, isSuperAdmin]);

  const {
    data: reportData,
    loading: reportLoading,
    error: reportError,
    refetch: refetchReportData
  } = useReportData(
    outletId, 
    timeframe, 
    "comprehensive", 
    dateRange,
    !isSuperAdmin || isSelectingDateRange // Skip fetch jika sedang memilih date range
  );

  const { 
    data: comparisonData, 
    loading: comparisonLoading,
    refetch: refetchComparisonData
  } = useOutletComparison(
    timeframe,
    !isSuperAdmin || isSelectingDateRange // Skip fetch jika sedang memilih date range
  );
  
  // Single effect to handle refetching data when necessary
  useEffect(() => {
    if (shouldRefetchRef.current && !isSelectingDateRange) {
      //console.log(`Refetching data (trigger count: ${refreshCountRef.current})`);
      refetchReportData();
      refetchComparisonData();
      shouldRefetchRef.current = false;
    }
  }, [refetchReportData, refetchComparisonData, isSelectingDateRange]);

  const handleTimeframeChange = (value: string) => {
    const newTimeframe = value as ReportTimeframe;
    
    // Jika berganti ke custom, tandai bahwa kita sedang memilih date range
    if (newTimeframe === "custom") {
      setIsSelectingDateRange(true);
      // Jangan hapus date range yang sudah ada jika ada
      if (!dateRange) {
        //console.log("Switched to custom timeframe, waiting for date range selection");
      } else {
        //console.log("Switched to custom timeframe with existing date range");
        // Jika sudah ada date range, kita bisa langsung fetch data
        setIsSelectingDateRange(false);
        triggerRefetch();
      }
    } else {
      // Bukan custom timeframe, langsung fetch data
      setIsSelectingDateRange(false);
      
      // If switching away from custom, clear date range
      if (timeframe === "custom") {
        setDateRange(undefined);
      }
    }
    
    // Update timeframe
    setTimeframe(newTimeframe);
    
    // Mark for refetch if not custom or if custom but date range already exists
    if (newTimeframe !== "custom" || (newTimeframe === "custom" && dateRange)) {
      triggerRefetch();
    }
    
    //console.log(`Timeframe changed to ${newTimeframe}`);
  };

  const handleOutletChange = (value: string) => {
    setOutletId(value === "all" ? undefined : parseInt(value));
    // Mark for refetch
    triggerRefetch();
  };

  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined) => {
    //console.log("Date range changed:", range);
    
    if (range) {
      // Ensure both from and to dates are present
      if (range.from && range.to) {
        // Set the date range with proper time components
        const fromDate = new Date(range.from);
        fromDate.setHours(0, 0, 0, 0);
        
        const toDate = new Date(range.to);
        toDate.setHours(23, 59, 59, 999);
        
        const formattedRange = {
          from: fromDate,
          to: toDate
        };
        
        // Update selected month/year based on from date for UI consistency
        setSelectedMonth((fromDate.getMonth() + 1).toString());
        setSelectedYear(fromDate.getFullYear().toString());
        
        // Set the date range
        setDateRange(formattedRange);
        
        // Tandai bahwa kita sudah selesai memilih date range
        setIsSelectingDateRange(false);
        
        // Always set timeframe to custom when a date range is selected
        if (timeframe !== "custom") {
          setTimeframe("custom");
        }
        
        // console.log("Date range set:", {
        //   from: fromDate.toISOString(),
        //   to: toDate.toISOString(),
        //   timeframe: "custom"
        // });
        
        // Mark for refetch
        triggerRefetch();
      }
    } else {
      // Clear date range
      setDateRange(undefined);
      
      // Mark for refetch if not custom timeframe
      if (timeframe !== "custom") {
        triggerRefetch();
      } else {
        // Jika custom timeframe tapi date range dihapus, tandai sedang memilih
        setIsSelectingDateRange(true);
      }
    }
  };

  const isLoading = !isSuperAdmin 
    ? outletsLoading 
    : ((reportLoading && !reportData) || outletsLoading);

  if (isLoading) {
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

  if (outletsError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 p-4 mx-auto max-w-md">
        <div className="bg-red-50 shadow-md rounded-lg p-6 w-full">
          <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Outlets</h3>
          <p className="text-gray-700 mb-4">We couldn't load the outlets data. Please try again later.</p>
          <div className="text-xs text-red-600 mt-2 p-2 bg-red-100 rounded">
            {outletsError}
          </div>
        </div>
      </div>
    );
  }

  if (isSuperAdmin && reportError && !isSelectingDateRange) {
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

  // Jika timeframe adalah custom dan kita sedang menunggu input date range, tampilkan pesan
  if (timeframe === "custom" && isSelectingDateRange) {
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
          role={role || undefined}
        />
        
        <div className="flex items-center justify-center h-64 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center p-6 max-w-md">
            <svg className="w-12 h-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Please Select a Date Range</h3>
            <p className="text-blue-700">
              You've selected the Custom Range option. Please choose a start and end date from the date picker above to view the report data.
            </p>
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
        role={role || undefined}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        {tabsOverflow ? (
          <div className="mb-4">
            <div className="relative">
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="overview">Overview</option>
                {isSuperAdmin && (
                  <>
                    <option value="transactions">Transactions</option>
                    <option value="orders">Orders</option>
                    <option value="customers">Customers</option>
                    <option value="comparison">Outlet Comparison</option>
                  </>
                )}
                <option value="employees">Employee Performance</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <TabsList className="w-full flex flex-wrap p-1 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="flex-grow py-2 px-3 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
              >
                Overview
              </TabsTrigger>
              
              {isSuperAdmin && (
                <>
                  <TabsTrigger 
                    value="transactions" 
                    className="flex-grow py-2 px-3 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
                  >
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="flex-grow py-2 px-3 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
                  >
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="customers" 
                    className="flex-grow py-2 px-3 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
                  >
                    Customers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="comparison" 
                    className="flex-grow py-2 px-3 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
                  >
                    Comparison
                  </TabsTrigger>
                </>
              )}
              
              <TabsTrigger 
                value="employees" 
                className="flex-grow py-2 px-3 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
              >
                Employees
              </TabsTrigger>
            </TabsList>
          </div>
        )}

        <div className="p-1">
          <TabsContent value="overview" className="mt-0">
            {isSuperAdmin ? (
              <OverviewTab 
                reportData={reportData} 
                outletId={outletId?.toString() || "all"} 
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                timeframe={timeframe}
              />
            ) : (
              <OverviewOutletTab 
                outletId={outletId?.toString() || "all"} 
                filterMonth={selectedMonth}
                filterYear={selectedYear}
                filterOutlet={outletId?.toString() || "all"}
                timeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
              />
            )}
          </TabsContent>

          {isSuperAdmin && (
            <>
              <TabsContent value="transactions" className="mt-0">
                <TransactionsTab reportData={reportData} />
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <OrdersTab reportData={reportData} />
              </TabsContent>

              <TabsContent value="customers" className="mt-0">
                <CustomersTab reportData={reportData} />
              </TabsContent>

              <TabsContent value="comparison" className="mt-0">
                <ComparisonTab 
                  comparisonData={comparisonData} 
                  comparisonLoading={comparisonLoading} 
                />
              </TabsContent>
            </>
          )}

          <TabsContent value="employees" className="mt-0">
            <EmployeePerformanceTab
              outletId={outletId}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ReportDashboard;