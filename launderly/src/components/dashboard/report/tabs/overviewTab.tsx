import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, PieChart } from "recharts";
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

interface OverviewTabProps {
  reportData: any;
  outletId: string;
  selectedMonth: string;
  selectedYear: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  reportData,
  outletId,
  selectedMonth,
  selectedYear,
}) => {
  if (!reportData) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
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
              {formatCurrency(reportData.revenue?.total || 0)}
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
              {reportData.transactions?.count.total || 0}
            </div>
            <div className="flex flex-wrap text-xs text-gray-500 mt-1">
              <span className="text-green-500 mr-2">
                {reportData.transactions?.count.successful || 0} successful
              </span>
              <span className="text-yellow-500 mr-2">
                {reportData.transactions?.count.pending || 0} pending
              </span>
              <span className="text-red-500">
                {reportData.transactions?.count.failed || 0} failed
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
              {reportData.customers?.active || 0}
            </div>
            <div className="flex flex-wrap text-xs text-gray-500 mt-1">
              <span className="text-blue-500 mr-2">
                {reportData.customers?.new || 0} new
              </span>
              <span className="text-purple-500">
                {reportData.customers?.returning || 0} returning
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
              {reportData.orders?.avgProcessingTimeHours?.toFixed(1) || 0} hours
            </div>
            <p className="text-xs text-gray-500 mt-1">
              From receipt to completion
            </p>
          </CardContent>
        </Card>
      </div>

        <ReportSalesChart
          filterOutlet={outletId}
          filterMonth={selectedMonth}
          filterYear={selectedYear}
        />

      {reportData?.revenue?.daily && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <LineChart
                data={reportData.revenue.daily}
                index="date"
                categories={["amount"]}
                colors={["blue"]}
                valueFormatter={currencyFormatter}
                yAxisWidth={80}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {reportData?.revenue?.breakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-64">
                <PieChart
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
                  index="name"
                  category="value"
                  valueFormatter={currencyFormatter}
                  colors={["blue", "green", "purple"]}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {reportData.transactions?.paymentMethods && (
                <BarChart
                  data={reportData.transactions.paymentMethods.map(
                    (method: any) => ({
                      method: method.paymentMethode || "Unknown",
                      count: method._count,
                    })
                  )}
                  index="method"
                  categories={["count"]}
                  colors={["indigo"]}
                  layout="vertical"
                  valueFormatter={numberFormatter}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {reportData?.orders?.popularItems &&
        reportData.orders.popularItems.length > 0 && (
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
                    {reportData.orders.popularItems.slice(0, 5).map((item: any) => (
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