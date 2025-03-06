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
import { numberFormatter } from "@/utils/formatters";

interface CustomersTabProps {
  reportData: any;
}

const CustomersTab: React.FC<CustomersTabProps> = ({ reportData }) => {
  if (!reportData?.customers) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-sm font-medium text-blue-600">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {reportData.customers.active}
            </div>
            <p className="text-xs text-gray-500 mt-1">During selected period</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-sm font-medium text-green-600">
              New Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {reportData.customers.new}
            </div>
            <p className="text-xs text-gray-500 mt-1">First-time customers</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-sm font-medium text-purple-600">
              Returning Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {reportData.customers.returning}
            </div>
            <p className="text-xs text-gray-500 mt-1">Existing customers</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Customer Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <PieChart
              data={[
                { type: "New", value: reportData.customers.new },
                {
                  type: "Returning",
                  value: reportData.customers.returning,
                },
              ]}
              index="type"
              category="value"
              valueFormatter={numberFormatter}
              colors={["blue", "purple"]}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Loyalty Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.customers.topCustomers.map((customer: any) => {
                  let loyaltyLevel = "";
                  let loyaltyColor = "";
                  
                  if (customer.orderCount >= 10) {
                    loyaltyLevel = "VIP";
                    loyaltyColor = "bg-purple-100 text-purple-800";
                  } else if (customer.orderCount >= 5) {
                    loyaltyLevel = "Gold";
                    loyaltyColor = "bg-yellow-100 text-yellow-800";
                  } else if (customer.orderCount >= 3) {
                    loyaltyLevel = "Silver";
                    loyaltyColor = "bg-gray-100 text-gray-800";
                  } else {
                    loyaltyLevel = "Regular";
                    loyaltyColor = "bg-blue-100 text-blue-800";
                  }
                  
                  return (
                    <TableRow key={customer.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-right">{customer.orderCount}</TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${loyaltyColor}`}>
                          {loyaltyLevel}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersTab;