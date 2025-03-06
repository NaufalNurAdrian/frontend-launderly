import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ReportSalesChart } from "../reportSalesChart";
import { currencyFormatter, numberFormatter } from "@/utils/formatters";
import { OverviewTabProps } from "@/types/report.types";

const OverviewTab: React.FC<OverviewTabProps> = ({
  reportData,
  outletId,
  selectedMonth,
  selectedYear,
}) => {
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

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];

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
              {formatCurrency(reportData.revenue.total)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {reportData.metadata.timeframe} report
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
                {reportData.transactions.count.successful} successful
              </span>
              <span className="text-yellow-500 mr-2">
                {reportData.transactions.count.pending} pending
              </span>
              <span className="text-red-500">
                {reportData.transactions.count.failed} failed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-sm font-medium text-purple-600">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {reportData.customers.active}
            </div>
            <div className="flex flex-wrap text-xs text-gray-500 mt-1">
              <span className="text-blue-500 mr-2">
                {reportData.customers.new} new
              </span>
              <span className="text-purple-500">
                {reportData.customers.returning} returning
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
        filterOutlet={outletId?.toString() || "all"}
        filterMonth={selectedMonth}
        filterYear={selectedYear}
      />

      {reportData.revenue.daily && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.revenue.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => currencyFormatter(value)} 
                  width={100}
                />
                <Tooltip 
                  formatter={(value) => [currencyFormatter(value as number), 'Revenue']} 
                />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.orders.popularItems.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;