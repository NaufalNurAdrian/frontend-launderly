import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ReportSalesChart } from "../reportSalesChart";
import { SalesReportApiResponse, ReportTimeframe } from "@/types/reportSales.type";
import { getReportSales } from "@/services/reportService";

const OverviewOutletTab = ({
  outletId,
  filterOutlet,
  filterMonth,
  filterYear,
  timeframe = "daily",
  onTimeframeChange
}: {
  outletId: string
  filterOutlet: string;
  filterMonth: string;
  filterYear: string;
  timeframe?: ReportTimeframe;
  onTimeframeChange?: (value: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<SalesReportApiResponse | undefined>();
  const reportData = report?.result?.result;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data: SalesReportApiResponse = await getReportSales(
          filterOutlet, 
          filterMonth, 
          filterYear,
          timeframe
        );
        setReport(data);
      } catch (err: any) {
        console.error("Error fetching sales report:", err);
        setError(err.message || "Failed to fetch sales report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe, filterOutlet, filterMonth, filterYear]);

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

  const dailyData = reportData.incomeDaily.map((amount, index) => {
    let dateLabel = `Day ${index + 1}`;
    
    if (reportData.dateLabels && index < reportData.dateLabels.length) {
      const date = new Date(reportData.dateLabels[index]);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      dateLabel = `${date.getDate()} ${monthNames[date.getMonth()]}`;
    }
    
    return {
      date: dateLabel,
      amount: amount,
    };
  });

  const paymentMethodsData = [
    { method: "Cash", count: Math.floor(reportData.totalTransaction * 0.4) },
    { method: "Transfer", count: Math.floor(reportData.totalTransaction * 0.35) },
    { method: "E-Wallet", count: Math.floor(reportData.totalTransaction * 0.25) },
  ];

  const revenueBreakdownData = [
    { name: "Laundry", value: Math.floor(reportData.totalIncome * 0.7) },
    { name: "Pickup", value: Math.floor(reportData.totalIncome * 0.15) },
    { name: "Delivery", value: Math.floor(reportData.totalIncome * 0.15) },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];

  const getTimeframeLabel = () => {
    switch(timeframe) {
      case "daily": return "today";
      case "weekly": return "last 7 days";
      case "monthly": return "this month";
      case "yearly": return "this year";
      default: return "selected period";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-sm font-medium text-blue-600">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.totalIncome)}
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
              {reportData.totalTransaction}
            </div>
            <div className="flex flex-wrap text-xs text-gray-500 mt-1">
              <span className="text-green-500 mr-2">
                {reportData.completed} completed
              </span>
              <span className="text-yellow-500 mr-2">
                {reportData.onProgress} on progress
              </span>
              <span className="text-blue-500">
                {reportData.receivedAtOutlet} received
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-sm font-medium text-purple-600">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {reportData.totalOrders}
            </div>
            <div className="flex flex-wrap text-xs text-gray-500 mt-1">
              <span className="text-purple-500">
                {reportData.totalTransaction > 0 
                  ? formatCurrency(reportData.totalIncome / reportData.totalTransaction) 
                  : formatCurrency(0)} avg. value
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardTitle className="text-sm font-medium text-amber-600">
              Total Weight
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {reportData.totalWeight.toFixed(1)} kg
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getTimeframeLabel()}
            </p>
          </CardContent>
        </Card>
      </div>

      <ReportSalesChart
        filterOutlet={outletId?.toString() || "all"}
        filterMonth={filterMonth}
        filterYear={filterYear}
        timeframe={timeframe}
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
                  data={revenueBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Revenue']} 
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                layout="horizontal"
                data={paymentMethodsData}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Transaction Timeline</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-4 space-x-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{reportData.receivedAtOutlet}</div>
              <div className="text-sm text-gray-500">Received</div>
            </div>
            <div className="flex-1 h-1 bg-gray-200 relative">
              <div 
                className="absolute h-1 bg-blue-500" 
                style={{ width: `${(reportData.receivedAtOutlet / Math.max(reportData.totalTransaction, 1)) * 100}%` }}
              ></div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-500">{reportData.onProgress}</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
            <div className="flex-1 h-1 bg-gray-200 relative">
              <div 
                className="absolute h-1 bg-yellow-500" 
                style={{ width: `${(reportData.onProgress / Math.max(reportData.totalTransaction, 1)) * 100}%` }}
              ></div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{reportData.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewOutletTab;