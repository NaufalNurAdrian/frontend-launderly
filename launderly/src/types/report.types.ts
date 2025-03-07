// src/types/report.types.ts

export interface ReportData {
  transactions: {
    count: {
      successful: number;
      pending: number;
      failed: number;
      total: number;
    };
    conversionRate: number;
    paymentMethods?: Array<{
      paymentMethode: string | null;
      _count: number;
    }>;
    averageValue: number;
    highestValue: number;
    lowestValue: number;
  };
  revenue: {
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
  customers: {
    active: number;
    new: number;
    returning: number;
    topCustomers: Array<{
      id: number;
      name: string;
      orderCount: number;
    }>;
  };
  orders: {
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

// Prop types with explicit null handling
export interface OverviewTabProps {
  reportData: ReportData | null;
  outletId?: number | string;
  selectedMonth: string;
  selectedYear: string;
}

export interface TransactionsTabProps {
  reportData: ReportData | null;
}

export interface OrdersTabProps {
  reportData: ReportData | null;
}

export interface CustomersTabProps {
  reportData: ReportData | null;
}

export interface ComparisonTabProps {
  comparisonData: OutletComparisonData | null;
  comparisonLoading: boolean;
}

export interface EmployeePerformanceTabProps {
  outletId?: number;
  selectedMonth: string;
  selectedYear: string;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
}

// Existing additional type definitions
export type ReportTimeframe = "daily" | "weekly" | "monthly" | "custom";
export type ReportType = "transactions" | "revenue" | "customers" | "orders" | "comprehensive";

export interface DateRange {
  from: Date;
  to: Date;
}