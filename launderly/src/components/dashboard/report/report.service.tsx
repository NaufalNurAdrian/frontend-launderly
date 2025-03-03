import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, BarChart, PieChart } from "recharts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useReportData, useOutletComparison } from "@/hooks/useReportHooks";
import { fetchAllOutlet } from "@/services/outletService";
import { DateRange, ReportTimeframe } from "@/types/report.types";
import { useQuery } from "@tanstack/react-query";
import { DatePickerWithRange } from "@/helpers/datePickerWithRange";

const ReportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState<ReportTimeframe>("monthly");
  const [outletId, setOutletId] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { data: outletsResponse, isLoading: outletsLoading } = useQuery({
    queryKey: ["outlets"],
    queryFn: fetchAllOutlet,
  });

  const {
    data: reportData,
    loading: reportLoading,
    error: reportError,
  } = useReportData(outletId, timeframe, "comprehensive", dateRange);

  const { data: comparisonData, loading: comparisonLoading } =
    useOutletComparison(timeframe);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as ReportTimeframe);
    if (value !== "custom") {
      setDateRange(undefined);
    }
  };

  const handleOutletChange = (value: string) => {
    setOutletId(value === "all" ? undefined : parseInt(value));
  };

  const handleDateRangeChange = (
    range: { from: Date; to: Date } | undefined
  ) => {
    if (range) {
      setDateRange(range);
      setTimeframe("custom");
    } else {
      setDateRange(undefined);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const currencyFormatter = (value: number): string => formatCurrency(value);
  const numberFormatter = (value: number): string => value.toString();

  if ((reportLoading && !reportData) || outletsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading report data...
      </div>
    );
  }

  if (reportError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error loading report data: {reportError}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Outlet Transaction Analysis</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Outlet</label>
          <Select
            value={outletId?.toString() || "all"}
            onValueChange={handleOutletChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              {outletsResponse?.outlets.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id.toString()}>
                  {outlet.outletName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time Period</label>
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <DatePickerWithRange
            value={dateRange}
            onChange={handleDateRangeChange}
            disabled={timeframe !== "custom"}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex-1">
            Orders
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex-1">
            Customers
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex-1">
            Outlet Comparison
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {reportData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Revenue Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(reportData.revenue?.total || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reportData.metadata.timeframe} report
                  </p>
                </CardContent>
              </Card>

              {/* Transactions Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.transactions?.count.total || 0}
                  </div>
                  <div className="flex text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 mr-2">
                      {reportData.transactions?.count.successful || 0}{" "}
                      successful
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

              {/* Active Customers Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.customers?.active || 0}
                  </div>
                  <div className="flex text-xs text-muted-foreground mt-1">
                    <span className="text-blue-500 mr-2">
                      {reportData.customers?.new || 0} new
                    </span>
                    <span className="text-purple-500">
                      {reportData.customers?.returning || 0} returning
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Time Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg Processing Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.orders?.avgProcessingTimeHours?.toFixed(1) || 0}{" "}
                    hours
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From receipt to completion
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Revenue Chart */}
          {reportData?.revenue?.daily && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart
                  data={reportData.revenue.daily}
                  index="date"
                  categories={["amount"]}
                  colors={["blue"]}
                  valueFormatter={currencyFormatter}
                  yAxisWidth={80}
                />
              </CardContent>
            </Card>
          )}

          {/* Revenue Breakdown */}
          {reportData?.revenue?.breakdown && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Revenue Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
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
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  {reportData.transactions?.paymentMethods && (
                    <BarChart
                      data={reportData.transactions.paymentMethods.map(
                        (method) => ({
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

          {/* Order Status */}
          {reportData?.orders?.byStatus && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={reportData.orders.byStatus.map((status) => ({
                    status: status.orderStatus,
                    count: status._count,
                  }))}
                  index="status"
                  categories={["count"]}
                  colors={["teal"]}
                  valueFormatter={numberFormatter}
                />
              </CardContent>
            </Card>
          )}

          {/* Popular Items */}
          {reportData?.orders?.popularItems &&
            reportData.orders.popularItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.orders.popularItems
                        .slice(0, 5)
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">
                              {item.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        {/* Transactions Tab Content */}
        <TabsContent value="transactions">
          {reportData?.transactions && (
            <div className="space-y-6">
              {/* Transaction metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Conversion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(reportData.transactions.conversionRate * 100).toFixed(
                        1
                      )}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Successful vs. total transactions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Average Transaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(reportData.transactions.averageValue)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per successful transaction
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Highest Transaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(reportData.transactions.highestValue)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum single transaction
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction Status Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Transaction Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
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
                </CardContent>
              </Card>

              {/* Payment Methods Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-right">
                          Transactions
                        </TableHead>
                        <TableHead className="text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.transactions?.paymentMethods?.map(
                        (method, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {method.paymentMethode || "Unknown"}
                            </TableCell>
                            <TableCell className="text-right">
                              {method._count}
                            </TableCell>
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
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          {reportData?.orders && (
            <div className="space-y-6">
              {/* Orders by Status */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Orders by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.orders?.byStatus.map((status) => {
                        const totalOrders = reportData.orders?.byStatus.reduce(
                          (sum, s) => sum + s._count,
                          0
                        ) || 0;
                        return (
                          <TableRow key={status.orderStatus}>
                            <TableCell>{status.orderStatus}</TableCell>
                            <TableCell className="text-right">
                              {status._count}
                            </TableCell>
                            <TableCell className="text-right">
                              {((status._count / totalOrders) * 100).toFixed(1)}
                              %
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Popular Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={reportData.orders.popularItems.slice(0, 10)}
                    index="name"
                    categories={["quantity"]}
                    colors={["violet"]}
                    layout="vertical"
                    valueFormatter={numberFormatter}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          {reportData?.customers && (
            <div className="space-y-6">
              {/* Customer Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.customers.active}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      During selected period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      New Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.customers.new}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      First-time customers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Returning Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.customers.returning}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Existing customers
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Distribution */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
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
                </CardContent>
              </Card>

              {/* Top Customers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Orders</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.customers.topCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell className="text-right">
                            {customer.orderCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Outlet Comparison Tab */}
        <TabsContent value="comparison">
          {comparisonLoading ? (
            <div className="flex items-center justify-center h-64">
              Loading comparison data...
            </div>
          ) : comparisonData ? (
            <div className="space-y-6">
              {/* Outlet Comparison Table */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Outlet Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
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
                        <TableRow key={outlet.id}>
                          <TableCell>{outlet.name}</TableCell>
                          <TableCell>{outlet.type}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(outlet.revenue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {outlet.orders}
                          </TableCell>
                          <TableCell className="text-right">
                            {outlet.customers}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Revenue Comparison Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Revenue by Outlet</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={comparisonData.outlets}
                    index="name"
                    categories={["revenue"]}
                    colors={["blue"]}
                    valueFormatter={currencyFormatter}
                  />
                </CardContent>
              </Card>

              {/* Orders Comparison Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Orders by Outlet</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={comparisonData.outlets}
                    index="name"
                    categories={["orders"]}
                    colors={["green"]}
                    valueFormatter={numberFormatter}
                  />
                </CardContent>
              </Card>

              {/* Customers Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Customers by Outlet</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={comparisonData.outlets}
                    index="name"
                    categories={["customers"]}
                    colors={["purple"]}
                    valueFormatter={numberFormatter}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-yellow-500">
              No comparison data available
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDashboard;
