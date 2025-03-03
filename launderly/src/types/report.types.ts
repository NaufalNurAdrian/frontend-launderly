// Report data types for the application
export interface ReportData {
    transactions?: {
      count: {
        successful: number;
        pending: number;
        failed: number;
        total: number;
      };
      conversionRate: number;
      paymentMethods: Array<{
        paymentMethode: string | null;
        _count: number;
      }>;
      averageValue: number;
      highestValue: number;
      lowestValue: number;
    };
    revenue?: {
      total: number;
      breakdown: {
        laundry: number;
        pickup: number;
        delivery: number;
      };
      daily: Array<{
        date: string;
        amount: number;
      }>;
    };
    customers?: {
      active: number;
      new: number;
      returning: number;
      topCustomers: Array<{
        id: number;
        name: string;
        orderCount: number;
      }>;
    };
    orders?: {
      byStatus: Array<{
        orderStatus: string;
        _count: number;
      }>;
      avgProcessingTimeHours: number;
      popularItems: Array<{
        id: number;
        name: string;
        quantity: number;
      }>;
    };
    outletDetails?: {
      id: number;
      outletName: string;
      outletType: string;
    };
    metadata: {
      generatedAt: string;
      timeframe: string;
      dateRange: {
        from: string;
        to: string;
      };
    };
  }
  
  export interface OutletComparisonData {
    outlets: Array<{
      id: number;
      name: string;
      type: string;
      revenue: number;
      orders: number;
      customers: number;
    }>;
    timeframe: string;
    dateRange: {
      from: string;
      to: string;
    };
  }
  
  export interface TransactionTrendsData {
    trends: Array<{
      date: string;
      amount: number;
    }>;
    period: string;
    totalRevenue: number;
  }
  
  export interface CustomerAnalyticsData {
    active: number;
    new: number;
    returning: number;
    topCustomers: Array<{
      id: number;
      name: string;
      orderCount: number;
    }>;
  }
  
  export interface EmployeePerformanceData {
    employeeId: number;
    name: string;
    role: string;
    completedOrders: number;
    averageProcessingTime: number;
    efficiency: number;
    attendanceRate: number;
    // Add other employee performance metrics as needed
  }
  
  export interface SalesReportData {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    categorySales: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
    monthlySales: Array<{
      month: string;
      amount: number;
    }>;
    // Add other sales metrics as needed
  }
  
  // Report filter/parameter types
  export type ReportTimeframe = "daily" | "weekly" | "monthly" | "custom";
  export type ReportType = "transactions" | "revenue" | "customers" | "orders" | "comprehensive";
  
  export interface DateRange {
    from: Date;
    to: Date;
  }