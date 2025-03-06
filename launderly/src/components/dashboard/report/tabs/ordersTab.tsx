import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { numberFormatter } from "@/utils/formatters";
import { toTitleCase } from "@/helpers/toTitleCase";
import { OrdersTabProps } from "@/types/report.types";

const OrdersTab: React.FC<OrdersTabProps> = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-yellow-50 rounded-lg p-8 text-center max-w-md border border-yellow-200">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Orders Data</h3>
          <p className="text-sm text-yellow-700">
            There are no order details available. Please adjust your filters or try again later.
          </p>
        </div>
      </div>
    );
  }

  const totalOrders = reportData.orders.byStatus.reduce(
    (sum, status) => sum + status._count,
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.orders.byStatus.map((status) => {
                  const percentage = ((status._count / totalOrders) * 100).toFixed(1);
                  
                  let statusColor = "";
                  
                  if (status.orderStatus.toLowerCase().includes("complete")) {
                    statusColor = "bg-green-100 text-green-800";
                  } else if (status.orderStatus.toLowerCase().includes("cancel")) {
                    statusColor = "bg-red-100 text-red-800";
                  } else if (status.orderStatus.toLowerCase().includes("progress")) {
                    statusColor = "bg-blue-100 text-blue-800";
                  } else if (status.orderStatus.toLowerCase().includes("pending")) {
                    statusColor = "bg-yellow-100 text-yellow-800";
                  }
                  
                  return (
                    <TableRow key={status.orderStatus} className="hover:bg-gray-50">
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                          {toTitleCase(status.orderStatus)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {status._count}
                      </TableCell>
                      <TableCell className="text-right">
                        {percentage}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Popular Items</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              layout="horizontal"
              data={reportData.orders.popularItems.slice(0, 10)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => numberFormatter(value)} 
              />
              <Tooltip 
                formatter={(value) => [numberFormatter(value as number), 'Quantity']} 
              />
              <Bar dataKey="quantity" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
};

export default OrdersTab;