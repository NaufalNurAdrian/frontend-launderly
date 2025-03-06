import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "recharts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency, numberFormatter } from "@/utils/formatters";

interface TransactionsTabProps {
  reportData: any;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ reportData }) => {
  if (!reportData?.transactions) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-sm font-medium text-green-600">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {(reportData.transactions.conversionRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Successful vs. total transactions
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-sm font-medium text-blue-600">
              Average Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.transactions.averageValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Per successful transaction
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-sm font-medium text-purple-600">
              Highest Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.transactions.highestValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum single transaction
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Transaction Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <PieChart
              data={[
                {
                  status: "Successful",
                  value: reportData.transactions.count.successful,
                },
                {
                  status: "Pending",
                  value: reportData.transactions.count.pending,
                },
                {
                  status: "Failed",
                  value: reportData.transactions.count.failed,
                },
              ]}
              index="status"
              category="value"
              valueFormatter={numberFormatter}
              colors={["green", "yellow", "red"]}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.transactions?.paymentMethods?.map(
                  (method: any, index: number) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {method.paymentMethode || "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">{method._count}</TableCell>
                      <TableCell className="text-right">
                        {(
                          (method._count /
                            (reportData.transactions?.count.total || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsTab;