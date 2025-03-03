import api from "@/libs/api";
import { OutletComparisonData, ReportData } from "@/types/report.types";
import { SalesReportApiResponse } from "@/types/reportSales.type";

export const getReportSales = async (filterOutlet: string, filterMonth: string, filterYear: string): Promise<SalesReportApiResponse> => {
  try {
    const response = await api.get<SalesReportApiResponse>(`report/sales-report?filterOutlet=${filterOutlet || "all"}&filterMonth=${filterMonth || ""}&filterYear=${filterYear || ""}`);
    return response.data;
  } catch (error: any) {
    console.error("Get Report Sales error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch report sales");
  }
};

export const getReportEmployeePerformance = async ( filterOutlet?: string, filterMonth?: string, filterYear?: string) => {
  try {
    const response = await api.get(`report/employee-performance?filterOutlet=${filterOutlet || "all"}&filterMonth=${filterMonth || ""}&filterYear=${filterYear || ""}`);
    return response.data;
  } catch (error: any) {
    console.error("Get Report Employee Performance error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch report employee performance");
  }
}


interface ReportParams {
  outletId?: number;
  timeframe?: "daily" | "weekly" | "monthly" | "custom";
  reportType?: "transactions" | "revenue" | "customers" | "orders" | "comprehensive";
  startDate?: string;
  endDate?: string;
}

interface ComparisonParams {
  timeframe?: "daily" | "weekly" | "monthly" | "custom";
}

interface TrendsParams {
  outletId?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
}

interface CustomerAnalyticsParams {
  outletId?: number;
  timeframe?: "daily" | "weekly" | "monthly" | "custom";
}

/**
 * Fetches comprehensive or specific report data based on parameters
 */
export const fetchReportData = async (params: ReportParams): Promise<ReportData> => {
  try {
    const response = await api.get<{ success: boolean; data: ReportData }>("/report/generate", { 
      params 
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch report data:", error.response?.data || error.message);
    throw new Error("Failed to load report data");
  }
};

/**
 * Fetches outlet comparison data
 */
export const fetchComparisonData = async (params: ComparisonParams): Promise<OutletComparisonData> => {
  try {
    const response = await api.get<{ success: boolean; data: OutletComparisonData }>("/report/compare", {
      params
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch comparison data:", error.response?.data || error.message);
    throw new Error("Failed to load outlet comparison data");
  }
};

/**
 * Fetches transaction trends data
 */
export const fetchTransactionTrends = async (params: TrendsParams): Promise<any> => {
  try {
    const response = await api.get<{ success: boolean; data: any }>("/report/trends", {
      params
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch trends data:", error.response?.data || error.message);
    throw new Error("Failed to load transaction trends");
  }
};

/**
 * Fetches customer analytics data
 */
export const fetchCustomerAnalytics = async (params: CustomerAnalyticsParams): Promise<any> => {
  try {
    const response = await api.get<{ success: boolean; data: any }>("/report/customers", {
      params
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch customer analytics:", error.response?.data || error.message);
    throw new Error("Failed to load customer analytics");
  }
};

/**
 * Fetches employee performance data
 */
export const fetchEmployeePerformanceData = async (params: {
  filterOutlet?: string;
  filterMonth?: string;
  filterYear?: string;
}): Promise<any> => {
  try {
    const response = await api.get<{ message: string; result: any }>("/report/employee-performance", {
      params
    });
    return response.data.result;
  } catch (error: any) {
    console.error("Failed to fetch employee performance:", error.response?.data || error.message);
    throw new Error("Failed to load employee performance data");
  }
};

/**
 * Fetches sales report data
 */
export const fetchSalesReportData = async (params: {
  filterOutlet?: string;
  filterMonth?: string;
  filterYear?: string;
}): Promise<any> => {
  try {
    const response = await api.get<{ message: string; result: any }>("/report/sales-report", {
      params
    });
    return response.data.result;
  } catch (error: any) {
    console.error("Failed to fetch sales report:", error.response?.data || error.message);
    throw new Error("Failed to load sales report data");
  }
};