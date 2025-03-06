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
import { formatCurrency, numberFormatter } from "@/utils/formatters";

interface ComparisonTabProps {
  comparisonData: any;
  comparisonLoading: boolean;
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({
  comparisonData,
  comparisonLoading,
}) => {
  if (comparisonLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-400 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
          <div className="mt-2 text-gray-500">Loading comparison data...</div>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-yellow-50 rounded-lg p-8 text-center max-w-md border border-yellow-200">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Comparison Data</h3>
          <p className="text-sm text-yellow-700">
            There is no outlet comparison data available for the selected period. Try adjusting your filters or ensuring there are multiple outlets with data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Outlet Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Customers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.outlets.map((outlet: any) => (
                  <TableRow key={outlet.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{outlet.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {outlet.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(outlet.revenue)}
                    </TableCell>
                    <TableCell className="text-right">{outlet.orders}</TableCell>
                    <TableCell className="text-right">{outlet.customers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Revenue by Outlet</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <BarChart
                data={comparisonData.outlets}
                index="name"
                categories={["revenue"]}
                colors={["blue"]}
                valueFormatter={(value: number) => formatCurrency(value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Orders by Outlet</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <BarChart
                data={comparisonData.outlets}
                index="name"
                categories={["orders"]}
                colors={["green"]}
                valueFormatter={numberFormatter}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Customers by Outlet</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <BarChart
              data={comparisonData.outlets}
              index="name"
              categories={["customers"]}
              colors={["purple"]}
              valueFormatter={numberFormatter}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonTab;