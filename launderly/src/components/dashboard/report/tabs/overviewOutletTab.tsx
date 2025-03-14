import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ReportSalesChart } from "../reportSalesChart";
import { ReportTimeframe } from "@/types/reportSales.type";
import { DateRange } from "@/types/report.types";
import { useReportData } from "@/hooks/useReportHooks";
import { currencyFormatter, numberFormatter } from "@/utils/formatters";

const OverviewOutletTab = ({
  outletId,
  filterOutlet,
  filterMonth,
  filterYear,
  timeframe = "daily",
  dateRange,
  onTimeframeChange
}: {
  outletId: string
  filterOutlet: string;
  filterMonth: string;
  filterYear: string;
  timeframe?: ReportTimeframe;
  dateRange?: DateRange;
  onTimeframeChange?: (value: string) => void;
}) => {
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const [calculatedDateRange, setCalculatedDateRange] = useState<DateRange | undefined>(undefined);

  // Calculate and set the date range whenever dependencies change
  useEffect(() => {
    const newDateRange = getDateRange();
    setCalculatedDateRange(newDateRange);
    console.log("Date range calculated:", newDateRange);
    console.log("Current timeframe:", timeframe);
    console.log("Current dateRange prop:", dateRange);
  }, [timeframe, dateRange, filterMonth, filterYear]);

  // Get date range from props or create from month/year
  const getDateRange = () => {
    if (timeframe === "custom" && dateRange) {
      // For custom timeframe, use provided date range
      return dateRange;
    } else if (timeframe === "custom" && filterMonth && filterYear) {
      // Create date range from month/year for custom timeframe
      const year = parseInt(filterYear);
      const month = parseInt(filterMonth) - 1; 
      
      const startDate = new Date(year, month, 1);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(year, month + 1, 0); 
      endDate.setHours(23, 59, 59, 999);
      
      return { from: startDate, to: endDate };
    }
    
    // For non-custom timeframes, let the hook handle the date range
    return undefined;
  };

  // Use the useReportData hook with the calculated date range
  const {
    data: reportData,
    loading,
    error
  } = useReportData(
    filterOutlet === "all" ? undefined : parseInt(filterOutlet),
    timeframe,
    "comprehensive",
    calculatedDateRange,
    !shouldFetchData
  );

  // Debug the actual API call parameters
  useEffect(() => {
    if (reportData) {
      console.log("Report data loaded with metadata:", reportData.metadata);
      console.log("Date range in metadata:", reportData.metadata.dateRange);
    }
  }, [reportData]);

  // Trigger refetch when relevant props change
  useEffect(() => {
    setShouldFetchData(true);
    console.log("Triggering data refetch with params:", {
      outletId,
      filterOutlet,
      timeframe,
      dateRange: calculatedDateRange
    });
  }, [outletId, filterOutlet, filterMonth, filterYear, timeframe, calculatedDateRange]);

  if (loading) {
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 rounded-lg p-8 text-center max-w-md border border-red-200">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-sm text-red-700">{error}</p>
          <div className="text-xs mt-4 text-gray-500">
            Debug info: timeframe={timeframe}, 
            dateRange={(dateRange ? `${dateRange.from.toISOString()} - ${dateRange.to.toISOString()}` : 'none')}
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-yellow-50 rounded-lg p-8 text-center max-w-md border border-yellow-200">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Report Data</h3>
          <p className="text-sm text-yellow-700">
            There is no data available for the selected period. Try adjusting your filters.
          </p>
          <div className="text-xs mt-4 text-gray-500">
            Current filters: timeframe={timeframe}, 
            dateRange={(calculatedDateRange ? `${calculatedDateRange.from.toISOString()} - ${calculatedDateRange.to.toISOString()}` : 'none')}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate average transaction value
  const avgTransactionValue = reportData.transactions.count.total > 0
    ? reportData.revenue.total / reportData.transactions.count.total
    : 0;

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];

  const getTimeframeLabel = () => {
    switch(timeframe) {
      case "daily": return "today";
      case "weekly": return "last 7 days";
      case "monthly": return "this month";
      case "yearly": return "this year";
      case "custom": return "selected period";
      default: return reportData.metadata.timeframe + " report";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {timeframe === "custom" && dateRange && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <strong>Date Range:</strong> {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-sm font-medium text-blue-600">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.revenue.total)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getTimeframeLabel()}
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-sm font-medium text-green-600">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {reportData.transactions.count.total}
            </div>
            <div className="flex flex-wrap text-xs text-gray-500 mt-1">
              <span className="text-green-500 mr-2">
                {Math.round((reportData.transactions.count.successful / Math.max(reportData.transactions.count.total, 1)) * 100)}% successful
              </span>
              <span className="text-yellow-500">
                {Math.round((reportData.transactions.count.pending / Math.max(reportData.transactions.count.total, 1)) * 100)}% pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-sm font-medium text-purple-600">
              Avg Transaction Value
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {formatCurrency(avgTransactionValue)}
            </div>
            <div className="flex flex-wrap text-xs text-gray-500 mt-1">
              <span className="text-purple-500">
                per transaction
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardTitle className="text-sm font-medium text-amber-600">
              Avg Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {reportData.orders.avgProcessingTimeHours.toFixed(1)} hours
            </div>
            <p className="text-xs text-gray-500 mt-1">
              From receipt to completion
            </p>
          </CardContent>
        </Card>
      </div>

      <ReportSalesChart
        filterOutlet={filterOutlet}
        filterMonth={filterMonth}
        filterYear={filterYear}
        timeframe={timeframe}
        dateRange={dateRange}
        onTimeframeChange={onTimeframeChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Laundry",
                      value: reportData.revenue.breakdown.laundry,
                    },
                    {
                      name: "Pickup",
                      value: reportData.revenue.breakdown.pickup,
                    },
                    {
                      name: "Delivery",
                      value: reportData.revenue.breakdown.delivery,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    {
                      name: "Laundry",
                      value: reportData.revenue.breakdown.laundry,
                    },
                    {
                      name: "Pickup",
                      value: reportData.revenue.breakdown.pickup,
                    },
                    {
                      name: "Delivery",
                      value: reportData.revenue.breakdown.delivery,
                    },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [currencyFormatter(value as number), 'Revenue']} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {reportData.transactions.paymentMethods && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  layout="horizontal"
                  data={reportData.transactions.paymentMethods.map(
                    (method) => ({
                      method: method.paymentMethode || "Unknown",
                      count: method._count,
                    })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis 
                    tickFormatter={(value) => numberFormatter(value)} 
                  />
                  <Tooltip 
                    formatter={(value) => [numberFormatter(value as number), 'Count']} 
                  />
                  <Bar dataKey="count" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {reportData.orders.popularItems && reportData.orders.popularItems.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Most Popular Items</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Item Name</th>
                    <th className="text-right py-2 px-4">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.orders.popularItems.slice(0, 5).map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-4 font-medium">{item.name}</td>
                      <td className="py-2 px-4 text-right">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Add debugging information for date range issues */}
      <details className="text-xs text-gray-500 p-2 border border-gray-200 rounded-lg">
        <summary className="cursor-pointer font-medium">Debug Information</summary>
        <div className="p-2 space-y-1">
          <div><strong>Timeframe:</strong> {timeframe}</div>
          <div><strong>Date Range Props:</strong> {dateRange ? `${dateRange.from.toISOString()} - ${dateRange.to.toISOString()}` : 'None'}</div>
          <div><strong>Calculated Date Range:</strong> {calculatedDateRange ? `${calculatedDateRange.from.toISOString()} - ${calculatedDateRange.to.toISOString()}` : 'None'}</div>
          <div><strong>Filter Month:</strong> {filterMonth}</div>
          <div><strong>Filter Year:</strong> {filterYear}</div>
          <div><strong>Filter Outlet:</strong> {filterOutlet}</div>
          <div><strong>Report Metadata:</strong> {reportData?.metadata ? JSON.stringify(reportData.metadata, null, 2) : 'None'}</div>
        </div>
      </details>
    </div>
  );
};

export default OverviewOutletTab;