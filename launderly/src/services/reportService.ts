import api from "@/libs/api";
import { OutletComparisonData, ReportData } from "@/types/report.types";
import { SalesReportApiResponse } from "@/types/reportSales.type";

export const getReportSales = async (
  filterOutlet: string,
  filterMonth: string,
  filterYear: string,
  timeframe: string = "monthly",
  startDate?: string,
  endDate?: string
): Promise<SalesReportApiResponse> => {
  try {
    const params: Record<string, string> = {
      filterOutlet: filterOutlet || "all",
      timeframe,
    };

    if (timeframe === "custom") {
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;

        // console.log("Using custom date range for API request:", {
        //   startDate,
        //   endDate,
        // });
      } else {
        throw new Error("Custom timeframe requires start and end dates");
      }
    } else {
      if (filterMonth) params.filterMonth = filterMonth;
      if (filterYear) params.filterYear = filterYear;

      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
    }

    let queryString;
    try {
      queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    } catch (encodeError) {
      console.error("Error encoding query parameters:", encodeError);
      queryString = `filterOutlet=${
        filterOutlet || "all"
      }&timeframe=${timeframe}`;
    }

    const response = await api.get<SalesReportApiResponse>(
      `/report/sales-report?${queryString}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Get Report Sales error:", error);
    throw new Error(`Failed to fetch report sales: ${error.message}`);
  }
};

export const getReportEmployeePerformance = async (
  filterOutlet?: string,
  filterMonth?: string,
  filterYear?: string
) => {
  try {
    const params: Record<string, string> = {};

    if (filterOutlet) params.filterOutlet = filterOutlet;
    if (filterMonth) params.filterMonth = filterMonth;
    if (filterYear) params.filterYear = filterYear;

    let queryString;
    try {
      queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    } catch (encodeError) {
      console.error("Error encoding query parameters:", encodeError);
      queryString = "";
    }

    // console.log(`API Request: /report/employee-performance?${queryString}`);

    const response = await api.get(
      `/report/employee-performance?${queryString}`
    );
    // console.log("API Response status:", response.status);

    return response.data;
  } catch (error) {
    console.error("Get Report Employee Performance error:", error);
    throw new Error("Failed to fetch report employee performance");
  }
};

interface ReportParams {
  outletId?: number;
  timeframe?: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  reportType?:
    | "transactions"
    | "revenue"
    | "customers"
    | "orders"
    | "comprehensive";
  startDate?: string;
  endDate?: string;
}

interface ComparisonParams {
  timeframe?: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  startDate?: string;
  endDate?: string;
}

interface TrendsParams {
  outletId?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
}

interface CustomerAnalyticsParams {
  outletId?: number;
  timeframe?: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  startDate?: string;
  endDate?: string;
}

const buildQueryString = (params: Record<string, any>): string => {
  try {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (
          typeof value === "string" &&
          (key.toLowerCase().includes("date") ||
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value))
        ) {
          const safeValue = value
            .replace(/%/g, "%25")
            .replace(/\+/g, "%2B")
            .replace(/&/g, "%26")
            .replace(/=/g, "%3D")
            .replace(/\?/g, "%3F")
            .replace(/#/g, "%23")
            .replace(/\s/g, "%20");

          return `${key}=${safeValue}`;
        } else if (typeof value === "object" && value !== null) {
          if (value instanceof Date) {
            return `${key}=${value.toISOString()}`;
          }
          return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
        }
        return `${key}=${encodeURIComponent(String(value))}`;
      })
      .join("&");
  } catch (error) {
    console.error("Error building query string:", error);
    return "";
  }
};

export const fetchReportData = async (
  params: ReportParams
): Promise<ReportData> => {
  try {
    const queryString = buildQueryString(params);

    const response = await api.get<{ success: boolean; data: ReportData }>(
      `/report/generate?${queryString}`
    );

    // Log response status
    // console.log("Report data API response status:", response);

    if (!response.data.success) {
      throw new Error(
        (response.data.data as any) || "Failed to load report data"
      );
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch report data:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to load report data"
    );
  }
};

export const fetchComparisonData = async (
  params: ComparisonParams
): Promise<OutletComparisonData> => {
  try {
    const queryString = buildQueryString(params);

    const response = await api.get<{
      success: boolean;
      data: OutletComparisonData;
    }>(`/report/compare?${queryString}`);

    // Log response status
    // console.log("Comparison data API response status:", response.status);

    if (!response.data.success) {
      throw new Error(
        (response.data.data as any) || "Failed to load outlet comparison data"
      );
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch comparison data:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to load outlet comparison data"
    );
  }
};

export const fetchTransactionTrends = async (
  params: TrendsParams
): Promise<any> => {
  try {
    // console.log("Fetching transaction trends with params:", params);

    const queryString = buildQueryString(params);

    const response = await api.get<{ success: boolean; data: any }>(
      `/report/trends?${queryString}`
    );

    // Log response status
    // console.log("Transaction trends API response status:", response.status);

    if (!response.data.success) {
      throw new Error(
        (response.data.data as any) || "Failed to load transaction trends"
      );
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch trends data:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to load transaction trends"
    );
  }
};

export const fetchCustomerAnalytics = async (
  params: CustomerAnalyticsParams
): Promise<any> => {
  try {
    // console.log("Fetching customer analytics with params:", params);

    const queryString = buildQueryString(params);

    const response = await api.get<{ success: boolean; data: any }>(
      `/report/customers?${queryString}`
    );

    // Log response status
    // console.log("Customer analytics API response status:", response.status);

    if (!response.data.success) {
      throw new Error(
        (response.data.data as any) || "Failed to load customer analytics"
      );
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch customer analytics:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to load customer analytics"
    );
  }
};

export const fetchEmployeePerformanceData = async (params: {
  filterOutlet?: string;
  filterMonth?: string;
  filterYear?: string;
}): Promise<any> => {
  try {
    // console.log("Fetching employee performance with params:", params);

    const queryString = buildQueryString(params);

    const response = await api.get<{ message: string; result: any }>(
      `/report/employee-performance?${queryString}`
    );

    // Log response status
    // console.log("Employee performance API response status:", response.status);

    return response.data.result;
  } catch (error: any) {
    console.error(
      "Failed to fetch employee performance:",
      error.response?.data || error.message
    );
    throw new Error("Failed to load employee performance data");
  }
};

export const fetchSalesReportData = async (params: {
  filterOutlet?: string;
  filterMonth?: string;
  filterYear?: string;
  timeframe?: string;
  startDate?: string;
  endDate?: string;
}): Promise<any> => {
  try {
    // console.log("Fetching sales report with params:", params);

    const queryString = buildQueryString(params);

    const response = await api.get<{ message: string; result: any }>(
      `/report/sales-report?${queryString}`
    );

    // Log response status
    // console.log("Sales report API response status:", response.status);

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch sales report:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to load sales report data"
    );
  }
};
