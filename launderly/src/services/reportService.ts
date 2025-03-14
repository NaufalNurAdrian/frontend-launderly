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

    // Add filters based on timeframe
    if (timeframe === "custom") {
      if (startDate && endDate) {
        // Ensure dates are properly formatted as YYYY-MM-DD
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        params.startDate = startDateObj.toISOString().split('T')[0];
        params.endDate = endDateObj.toISOString().split('T')[0];
        
        console.log("Custom date range params:", {
          startRaw: startDate,
          endRaw: endDate,
          startFormatted: params.startDate,
          endFormatted: params.endDate
        });
      } else {
        console.warn("Custom timeframe without start/end dates");
      }
    } else {
      // For non-custom timeframes, include month/year if provided
      if (filterMonth) params.filterMonth = filterMonth;
      if (filterYear) params.filterYear = filterYear;
    }
    
    console.log("API request params:", params);
    
    // Build query string with proper encoding
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

    console.log(`Making API request to: /report/sales-report?${queryString}`);
    
    const response = await api.get<SalesReportApiResponse>(
      `/report/sales-report?${queryString}`
    );

    console.log("API response status:", response.status);
    console.log("Data returned - dateLabels length:", 
      response.data?.result?.result?.dateLabels?.length || 0
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
    const apiParams: Record<string, any> = {
      timeframe: params.timeframe || 'monthly'
    };
    
    // Consistent date handling for custom timeframe
    if (params.timeframe === 'custom') {
      if (!params.startDate || !params.endDate) {
        throw new Error("Start date and end date are required for custom timeframe");
      }
      
      // Ensure consistent date formatting - use the same format as other tabs
      if (params.startDate) {
        const startDate = typeof params.startDate === 'object' 
          ? params.startDate as Date 
          : new Date(params.startDate);
        
        // Format consistently - use same hours/minutes/seconds as other services
        startDate.setHours(0, 0, 0, 0);
        apiParams.startDate = startDate.toISOString();
      }
      
      if (params.endDate) {
        const endDate = typeof params.endDate === 'object' 
          ? params.endDate as Date 
          : new Date(params.endDate);
        
        // Format consistently - use same hours/minutes/seconds as other services
        endDate.setHours(23, 59, 59, 999);
        apiParams.endDate = endDate.toISOString();
      }
    }
    
    // Debug log the actual dates that will be sent to the API
    if (apiParams.startDate && apiParams.endDate) {
      console.log("Comparison API date range:", {
        start: new Date(apiParams.startDate).toLocaleDateString(),
        end: new Date(apiParams.endDate).toLocaleDateString()
      });
    }
    
    const queryString = buildQueryString(apiParams);
    
    // Make the API request
    const response = await api.get<{
      success: boolean;
      data: OutletComparisonData;
    }>(`/report/compare?${queryString}`);
    
    // More detailed logging of the response
    if (response.data && response.data.data) {
      console.log("Comparison data response:", {
        timeframe: response.data.data.timeframe,
        dateRange: {
          from: new Date(response.data.data.dateRange.from).toLocaleDateString(),
          to: new Date(response.data.data.dateRange.to).toLocaleDateString()
        },
        outletCount: response.data.data.outlets?.length || 0,
        totalRevenue: response.data.data.outlets.reduce((sum, o) => sum + o.revenue, 0),
        totalOrders: response.data.data.outlets.reduce((sum, o) => sum + o.orders, 0)
      });
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