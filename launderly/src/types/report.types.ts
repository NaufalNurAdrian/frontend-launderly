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

export interface OverviewTabProps {
  reportData: ReportData | null;
  outletId: string;
  selectedMonth: string;
  selectedYear: string;
  timeframe?: ReportTimeframe;
  dateRange?: DateRange;
  onTimeframeChange?: (value: string) => void;
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
  dateRange?: DateRange;
  timeframe?: ReportTimeframe;
}

export interface EmployeePerformanceTabProps {
  outletId?: number;
  selectedMonth: string;
  selectedYear: string;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
}

export interface ReportSalesChartProps {
  filterOutlet: string;
  filterMonth: string;
  filterYear: string;
  timeframe?: ReportTimeframe;
  dateRange?: DateRange;
  onTimeframeChange?: (value: string) => void;
}

// Updated to include "yearly"
export type ReportTimeframe = "daily" | "weekly" | "monthly" | "yearly" | "custom";
export type ReportType = "transactions" | "revenue" | "customers" | "orders" | "comprehensive";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ReportFilters {
  outletId?: number;
  startDate?: Date;
  endDate?: Date;
  timeframe?: ReportTimeframe;
  reportType?: ReportType;
}

export interface SalesReportResult {
  totalIncome: number;
  totalTransaction: number;
  totalOrders: number;
  receivedAtOutlet: number;
  onProgress: number;
  completed: number;
  totalWeight: number;
  incomeDaily: number[];
  transactionDaily: number[];
  weightDaily: number[];
  incomeMonthly: number[];
  transactionMonthly: number[];
  weightMonthly: number[];
  pastYears: number[];
  incomeYearly: number[];
  transactionYearly: number[];
  weightYearly: number[];
  timeframe: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  dateLabels: string[];
}

export interface SalesReportApiResponse {
  message: string;
  result: {
    message: string;
    result: SalesReportResult;
  };
}