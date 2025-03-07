import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency, numberFormatter } from "@/utils/formatters";
import { TransactionsTabProps } from "@/types/report.types";

const TransactionsTab: React.FC<TransactionsTabProps> = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-yellow-50 rounded-lg p-8 text-center max-w-md border border-yellow-200">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Transactions Data</h3>
          <p className="text-sm text-yellow-700">
            There are no transaction details available. Please adjust your filters or try again later.
          </p>
        </div>
      </div>
    );
  }

  const statusData = [
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
  ];

  const COLORS = ['#10B981', '#FBBF24', '#EF4444'];

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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [numberFormatter(value as number), 'Transactions']} 
              />
              <Legend 
                formatter={(value) => `${value} (${numberFormatter(statusData.find(d => d.status === value)?.value || 0)})`} 
              />
            </PieChart>
          </ResponsiveContainer>
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
                {reportData.transactions.paymentMethods?.map(
                  (method, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {method.paymentMethode || "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">{method._count}</TableCell>
                      <TableCell className="text-right">
                        {(
                          (method._count /
                            reportData.transactions.count.total) *
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