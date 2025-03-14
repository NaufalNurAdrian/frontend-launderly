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
import { formatCurrency, numberFormatter } from "@/utils/formatters";
import { ComparisonTabProps } from "@/types/report.types";

const ComparisonTab: React.FC<ComparisonTabProps> = ({ 
  comparisonData, 
  comparisonLoading,
  dateRange,
  timeframe
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
            There is no outlet comparison data available. Try adjusting your filters or ensuring there are multiple outlets with data.
          </p>
        </div>
      </div>
    );
  }

  // Get readable timeframe description
  const getTimeframeDescription = () => {
    switch(comparisonData.timeframe) {
      case 'daily':
        return 'Today only';
      case 'weekly':
        return 'Last 7 days';
      case 'monthly':
        return 'Last 30 days';
      case 'yearly':
        return 'Last 365 days';
      case 'custom':
        return 'Custom date range';
      default:
        return comparisonData.timeframe;
    }
  };

  // Format the date range for display
  const dateRangeDisplay = comparisonData.dateRange ? 
    `(${new Date(comparisonData.dateRange.from).toLocaleDateString()} - ${new Date(comparisonData.dateRange.to).toLocaleDateString()})` : 
    '';

  // Calculate totals for summary display
  const totalRevenue = comparisonData.outlets.reduce((sum, outlet) => sum + outlet.revenue, 0);
  const totalOrders = comparisonData.outlets.reduce((sum, outlet) => sum + outlet.orders, 0);
  const totalCustomers = comparisonData.outlets.reduce((sum, outlet) => sum + outlet.customers, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="overflow-hidden bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <CardTitle>Outlet Performance Comparison</CardTitle>
            <span className="text-sm text-gray-700 mt-1 md:mt-0 font-medium">
              {getTimeframeDescription()} {dateRangeDisplay}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Summary section */}
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-lg font-bold text-blue-700">{formatCurrency(totalRevenue)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-lg font-bold text-blue-700">{totalOrders}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Customers</div>
                <div className="text-lg font-bold text-blue-700">{totalCustomers}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Note: These totals represent data from all displayed outlets for the selected time period.
            </div>
          </div>
          
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
                {comparisonData.outlets.map((outlet) => (
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData.outlets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)} 
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Revenue']} 
                />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Orders by Outlet</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData.outlets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => numberFormatter(value)} 
                />
                <Tooltip 
                  formatter={(value) => [numberFormatter(value as number), 'Orders']} 
                />
                <Bar dataKey="orders" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Customers by Outlet</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData.outlets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => numberFormatter(value)} 
              />
              <Tooltip 
                formatter={(value) => [numberFormatter(value as number), 'Customers']} 
              />
              <Bar dataKey="customers" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Add debug information card that can be expanded */}
      <details className="text-xs text-gray-500 p-2 border border-gray-200 rounded-lg">
        <summary className="cursor-pointer font-medium">Debug Information</summary>
        <div className="p-2 space-y-1">
          <div><strong>Timeframe:</strong> {comparisonData.timeframe}</div>
          <div><strong>Date Range:</strong> {dateRangeDisplay || 'None'}</div>
          <div><strong>Outlet Count:</strong> {comparisonData.outlets.length}</div>
          <div><strong>Total Revenue:</strong> {formatCurrency(totalRevenue)}</div>
          <div><strong>Total Orders:</strong> {totalOrders}</div>
          <div><strong>Total Customers:</strong> {totalCustomers}</div>
          <div className="text-xs text-blue-500 mt-2">
            Note: If totals differ from Overview tab, it may be due to different calculation methods or filters.
            The Comparison tab counts only direct orders per outlet, while Overview may include aggregated data.
          </div>
        </div>
      </details>
    </div>
  );
};

export default ComparisonTab;