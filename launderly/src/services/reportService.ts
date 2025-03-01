import api from "@/libs/api";
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