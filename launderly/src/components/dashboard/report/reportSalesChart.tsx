"use client";

import React, { useEffect, useState } from "react";
import { addDays, differenceInDays, format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SalesReportApiResponse,
  SalesReportResult,
  ReportTimeframe,
} from "@/types/reportSales.type";
import { getReportSales } from "@/services/reportService";
import { GiWashingMachine } from "react-icons/gi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Bar,
  Line,
} from "recharts";
import { DateRange } from "@/types/report.types";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export function ReportSalesChart({
  filterOutlet,
  filterMonth,
  filterYear,
  timeframe = "daily",
  dateRange,
  onTimeframeChange,
}: {
  filterOutlet: string;
  filterMonth: string;
  filterYear: string;
  timeframe?: ReportTimeframe;
  dateRange?: DateRange;
  onTimeframeChange?: (value: string) => void;
}) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [currentTimeframe, setCurrentTimeframe] = useState<
    "daily" | "monthly" | "yearly"
  >(
    timeframe === "weekly"
      ? "daily"
      : (timeframe as "daily" | "monthly" | "yearly")
  );

  const [debugInfo, setDebugInfo] = useState<any>(null);

  interface ChartDataItem {
    name: string;
    revenue: number;
    formattedRevenue: string;
  }
  
  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (!isMounted) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const startDate = dateRange?.from
          ? format(dateRange.from, "yyyy-MM-dd")
          : undefined;
        const endDate = dateRange?.to
          ? format(dateRange.to, "yyyy-MM-dd")
          : undefined;
  
        console.log("Fetching sales data with params:", {
          filterOutlet,
          filterMonth,
          filterYear,
          timeframe,
          startDate,
          endDate,
        });
  
        const data: SalesReportApiResponse = await getReportSales(
          filterOutlet,
          filterMonth,
          filterYear,
          timeframe,
          startDate,
          endDate
        );
  
        if (!isMounted) return;
  
        console.log("API Response data:", data?.result?.result);
  
        const report: SalesReportResult = data.result.result;
        setDebugInfo(report);
  
        if (report && report.totalIncome > 0) {
          setTotalIncome(report.totalIncome);
  
          // Prepare chart data based on timeframe
          let formattedData: ChartDataItem[] = [];
  
          if (timeframe === "daily" || timeframe === "weekly" || timeframe === "custom") {
            // For daily, weekly, and custom timeframes, create date labels for each day
            formattedData = report.dateLabels.map((date, index) => ({
              name: date,
              revenue: report.incomeDaily[index] || 0,
              formattedRevenue: formatCurrency(report.incomeDaily[index] || 0),
            }));
          } 
          else if (timeframe === "monthly") {
            // For monthly: use month names and monthly income
            const monthNames = [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            
            formattedData = monthNames.map((month, index) => ({
              name: month,
              revenue: report.incomeMonthly[index] || 0,
              formattedRevenue: formatCurrency(report.incomeMonthly[index] || 0),
            }));
          } 
          else if (timeframe === "yearly") {
            // For yearly: use years and yearly income
            formattedData = report.pastYears.map((year, index) => ({
              name: year.toString(),
              revenue: report.incomeYearly[index] || 0,
              formattedRevenue: formatCurrency(report.incomeYearly[index] || 0),
            }));
          }
  
          console.log("Formatted chart data:", formattedData);
          setChartData(formattedData.filter(item => item.name !== undefined));
        } else {
          setTotalIncome(0);
          setChartData([]);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error fetching sales report:", err);
          setError(err.message || "Failed to fetch sales report");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [
    currentTimeframe,
    filterOutlet,
    filterMonth,
    filterYear,
    timeframe,
    dateRange,
  ]);

  const handleTimeframeChange = (value: "daily" | "monthly" | "yearly") => {
    setCurrentTimeframe(value);
    if (onTimeframeChange) {
      const mappedValue =
        value === "daily"
          ? "daily"
          : value === "monthly"
          ? "monthly"
          : "yearly";

      onTimeframeChange(mappedValue);
    }
  };

  const getTimeframeDescription = () => {
    if (timeframe === "custom" && dateRange?.from && dateRange?.to) {
      const fromDate = format(dateRange.from, "MMM dd, yyyy");
      const toDate = format(dateRange.to, "MMM dd, yyyy");
      return `${fromDate} to ${toDate}`;
    }

    return timeframe === "daily"
      ? "last 30 days"
      : timeframe === "weekly"
      ? "last 7 days" 
      : timeframe === "monthly"
      ? "monthly (this year)"
      : "last 5 years";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      if (payload[0].payload.isDummy) return null;

      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-medium text-gray-800">{payload[0].payload.name}</p>
          <p className="text-blue-600 font-semibold">
            {payload[0].payload.formattedRevenue}
          </p>
        </div>
      );
    }
    return null;
  };

  const hasData = totalIncome > 0;

  return (
    <Card className="shadow-lg border border-blue-100 rounded-xl overflow-hidden bg-white max-w-7xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <GiWashingMachine size={24} className="text-blue-100" />
            <div>
              <CardTitle className="text-xl font-bold">Sales Report</CardTitle>
              <CardDescription className="text-blue-100 opacity-90">
                {timeframe === "custom"
                  ? "Custom period"
                  : timeframe === "daily"
                  ? "Last 30 days"
                  : timeframe === "weekly"
                  ? "Last 7 days"
                  : timeframe === "monthly"
                  ? "This year's monthly"
                  : "Last 5 years"}{" "}
                revenue overview
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Chart view:</span>
            <Select
              value={currentTimeframe}
              onValueChange={(val: "daily" | "monthly" | "yearly") =>
                handleTimeframeChange(val)
              }
            >
              <SelectTrigger className="w-32 bg-white/10 border-blue-300/30 text-white hover:bg-white/20 focus:ring-blue-300">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-blue-100">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                <GiWashingMachine className="w-10 h-10 text-blue-500" />
              </div>
              <div className="mt-4 text-blue-500 font-medium">
                Loading sales data...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-center">
              No data available for the selected filters
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {timeframe === "custom" && dateRange?.from && dateRange?.to
                ? `No transactions found between ${format(
                    dateRange.from,
                    "MMM dd, yyyy"
                  )} and ${format(dateRange.to, "MMM dd, yyyy")}`
                : "Try adjusting your filters to see more data"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                {filterOutlet === "all" ? "All Outlets" : "Selected Outlet"} •
                {filterMonth !== "" ? ` Month ${filterMonth}` : ""} •
                {filterYear !== "" ? ` Year ${filterYear}` : ""}
                {timeframe === "custom" && dateRange?.from && dateRange?.to
                  ? ` • ${format(dateRange.from, "MMM dd, yyyy")} to ${format(
                      dateRange.to,
                      "MMM dd, yyyy"
                    )}`
                  : ""}
              </div>
              <div className="font-bold text-xl text-blue-700">
                {formatCurrency(totalIncome)}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  {getTimeframeDescription()}
                </span>
              </div>
            </div>

            <div className="border border-blue-100 rounded-xl p-4 bg-blue-50/50 w-full">
  <div className="w-full h-[350px]" style={{minHeight: '350px'}}>
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 30, bottom: 60 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="name"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          interval={0}
          height={60}
          angle={-45}
          textAnchor="end"
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          tickFormatter={(value) => new Intl.NumberFormat('id').format(value)}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          tickCount={5}
          domain={[0, 'auto']}
          // Pastikan nilai negatif tidak muncul
          allowDataOverflow={true}
          allowDecimals={false}
        />
        <Tooltip 
          content={<CustomTooltip />}
          wrapperStyle={{ outline: 'none' }}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Legend 
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: 10 }}
        />
        {/* Gunakan Bar untuk menampilkan data dengan jelas */}
        <Bar
          dataKey="revenue"
          name="Revenue"
          fill="url(#colorRevenue)"
          barSize={25}
          radius={[4, 4, 0, 0]}
        />
        {/* Tambahkan Line (opsional) untuk tetap melihat tren */}
        <Line
          type="linear"
          dataKey="revenue"
          name="Trend"
          stroke="#3b82f6"
          strokeWidth={2}
          connectNulls={false}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}