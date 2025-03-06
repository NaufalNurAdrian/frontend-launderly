import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "recharts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { numberFormatter } from "@/utils/formatters";

interface OrdersTabProps {
  reportData: any;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ reportData }) => {
  if (!reportData?.orders) return null;

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
                {reportData.orders?.byStatus.map((status: any) => {
                  const totalOrders = reportData.orders?.byStatus.reduce(
                    (sum: number, s: any) => sum + s._count,
                    0
                  ) || 0;
                  
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
                          {status.orderStatus}
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
          <div className="h-96">
            <BarChart
              data={reportData.orders.popularItems.slice(0, 10)}
              index="name"
              categories={["quantity"]}
              colors={["violet"]}
              layout="vertical"
              valueFormatter={numberFormatter}
            />
          </div>
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
              {reportData.orders?.avgProcessingTimeHours?.toFixed(1) || 0} hours
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