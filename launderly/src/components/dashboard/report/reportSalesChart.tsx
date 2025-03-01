"use client";

import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer
} from "recharts";

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
import { SalesReportApiResponse, SalesReportResult } from "@/types/reportSales.type";
import { getReportSales } from "@/services/reportService";

// Komponen Chart
export function ReportSalesChart({
  filterOutlet,
  filterMonth,
  filterYear
}: {
  filterOutlet: string;
  filterMonth: string;
  filterYear: string;
}) {
  // Pilihan range waktu: "daily", "monthly", atau "yearly"
  const [timeRange, setTimeRange] = useState<"daily" | "monthly" | "yearly">("daily");
  const [chartData, setChartData] = useState<{ label: string; income: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: SalesReportApiResponse = await getReportSales(filterOutlet, filterMonth, filterYear);
        console.log(data)
        const report: SalesReportResult = data.result.result;

        let formattedData: { label: string; income: number }[] = [];

        if (timeRange === "daily") {
          // Mapping data harian: label sebagai "Day X"
          formattedData = report.incomeDaily.map((income, index) => ({
            label: `Day ${index + 1}`,
            income,
          }));
        } else if (timeRange === "monthly") {
          // Mapping data bulanan: label sebagai "Month X"
          formattedData = report.incomeMonthly.map((income, index) => ({
            label: `Month ${index + 1}`,
            income,
          }));
        } else if (timeRange === "yearly") {
          // Mapping data tahunan: gunakan pastYears sebagai label
          formattedData = report.incomeYearly.map((income, index) => ({
            label: `${report.pastYears[index]}`,
            income,
          }));
        }

        setChartData(formattedData);
      } catch (err: any) {
        console.error("Error fetching sales report:", err);
        setError(err.message || "Failed to fetch sales report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, filterOutlet, filterMonth, filterYear]);

  return (
    <div className="w-full p-4">
      <Card className="m-4 p-4">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
          <div>
            <CardTitle className="text-xl font-semibold">Sales Report</CardTitle>
            <CardDescription className="text-gray-500">
              Total income report based on selected time range.
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(val) => setTimeRange(val as "daily" | "monthly" | "yearly")}>
            <SelectTrigger className="w-32 rounded-md">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-5">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-5">{error}</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                <Area type="monotone" dataKey="income" stroke="#4f46e5" fill="url(#incomeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
