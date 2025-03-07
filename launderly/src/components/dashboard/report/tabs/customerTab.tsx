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
import { numberFormatter } from "@/utils/formatters";
import { CustomersTabProps } from "@/types/report.types";

const CustomersTab: React.FC<CustomersTabProps> = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-yellow-50 rounded-lg p-8 text-center max-w-md border border-yellow-200">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Customer Data</h3>
          <p className="text-sm text-yellow-700">
            There are no customer details available. Please adjust your filters or try again later.
          </p>
        </div>
      </div>
    );
  }

  const customerData = [
    {
      type: "New Customers",
      value: reportData.customers.new,
    },
    {
      type: "Returning Customers",
      value: reportData.customers.returning,
    },
  ];

  const COLORS = ['#3B82F6', '#10B981'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-sm font-medium text-blue-600">
              Total Active Customers
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
              <span className="text-green-500">
                {reportData.customers.returning} returning
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Customer Composition</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [numberFormatter(value as number), 'Customers']} 
              />
              <Legend 
                formatter={(value) => `${value} (${numberFormatter(customerData.find(d => d.type === value)?.value || 0)})`} 
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {reportData.customers.topCustomers && reportData.customers.topCustomers.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead className="text-right">Total Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.customers.topCustomers.slice(0, 5).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-right">{customer.orderCount}</TableCell>
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

export default CustomersTab;