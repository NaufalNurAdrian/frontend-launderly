import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchReportData,
  fetchComparisonData,
  fetchTransactionTrends,
  fetchCustomerAnalytics,
  fetchEmployeePerformanceData,
  fetchSalesReportData,
} from "@/services/reportService";
import {
  ReportData,
  OutletComparisonData,
  ReportTimeframe,
  ReportType,
} from "@/types/report.types";

export const useReportData = (
  outletId?: number,
  timeframe: ReportTimeframe = "monthly",
  reportType: ReportType = "comprehensive",
  dateRange?: { from: Date; to: Date },
  skipFetch: boolean = false
) => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (skipFetch) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = {
        timeframe,
        reportType,
      };

      if (outletId) {
        params.outletId = outletId;
      }

      let shouldFetch = true;

      if (timeframe === "custom") {
        if (dateRange && dateRange.from && dateRange.to) {
          if (dateRange.from > dateRange.to) {
            setError("Invalid date range: start date must be before end date");
            setLoading(false);
            shouldFetch = false;
          } else {
            params.startDate = dateRange.from.toISOString();
            params.endDate = dateRange.to.toISOString();

            // console.log("Custom timeframe with date range:", {
            //   startDate: params.startDate,
            //   endDate: params.endDate,
            // });
          }
        } else {
          // console.log("Custom timeframe without date range - skipping fetch");
          setLoading(false);
          shouldFetch = false;
        }
      } else {
        const now = new Date();

        switch (timeframe) {
          case "daily":
            const dailyStart = new Date(now);
            dailyStart.setHours(0, 0, 0, 0);
            params.startDate = dailyStart.toISOString();

            const dailyEnd = new Date(now);
            dailyEnd.setHours(23, 59, 59, 999);
            params.endDate = dailyEnd.toISOString();
            break;

          case "weekly":
            const weeklyStart = new Date(now);
            weeklyStart.setDate(now.getDate() - 6);
            weeklyStart.setHours(0, 0, 0, 0);
            params.startDate = weeklyStart.toISOString();

            const weeklyEnd = new Date(now);
            weeklyEnd.setHours(23, 59, 59, 999);
            params.endDate = weeklyEnd.toISOString();
            break;

          case "monthly":
            const monthlyStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            params.startDate = monthlyStart.toISOString();

            const monthlyEnd = new Date(
              now.getFullYear(),
              11,
              31,
              23,
              59,
              59,
              999
            );
            params.endDate = monthlyEnd.toISOString();
            break;

          case "yearly":
            const yearlyStart = new Date(
              now.getFullYear() - 4,
              0,
              1,
              0,
              0,
              0,
              0
            );
            params.startDate = yearlyStart.toISOString();

            const yearlyEnd = new Date(
              now.getFullYear(),
              11,
              31,
              23,
              59,
              59,
              999
            );
            params.endDate = yearlyEnd.toISOString();
            break;
        }
      }

      if (shouldFetch) {
        const currentParamsString = JSON.stringify(params);

        if (currentParamsString !== lastParamsRef.current) {
          const reportData = await fetchReportData(params);
          setData(reportData);
          lastParamsRef.current = currentParamsString;
          setError(null);
        } else {
          // console.log("Skipping duplicate API request with same parameters");
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error("Report data fetch error:", err);
      setError(err.message || "Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  }, [outletId, timeframe, reportType, dateRange, skipFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useSalesReport = (
  filterOutlet?: string,
  filterMonth?: string,
  filterYear?: string,
  timeframe: ReportTimeframe = "monthly",
  dateRange?: { from: Date; to: Date }
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        timeframe,
        filterOutlet: filterOutlet || "all",
      };

      if (timeframe === "custom") {
        if (dateRange && dateRange.from && dateRange.to) {
          params.startDate = dateRange.from.toISOString();
          params.endDate = dateRange.to.toISOString();

          // console.log("Using custom date range for sales report:", {
          //   startDate: params.startDate,
          //   endDate: params.endDate,
          // });
        } else {
          // console.log("Custom timeframe without date range - skipping fetch");
          setLoading(false);
          return;
        }
      } else {
        if (filterMonth) params.filterMonth = filterMonth;
        if (filterYear) params.filterYear = filterYear;

        const now = new Date();

        switch (timeframe) {
          case "daily":
            params.startDate = new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000
            ).toISOString();
            params.endDate = now.toISOString();
            break;

          case "weekly":
            params.startDate = new Date(
              now.getTime() - 84 * 24 * 60 * 60 * 1000
            ).toISOString();
            params.endDate = now.toISOString();
            break;

          case "monthly":
            if (filterYear && !filterMonth) {
              params.startDate = new Date(
                parseInt(filterYear),
                0,
                1
              ).toISOString();
              params.endDate = new Date(
                parseInt(filterYear),
                11,
                31
              ).toISOString();
            } else {
              params.startDate = new Date(
                now.getFullYear(),
                0,
                1
              ).toISOString();
              params.endDate = new Date(
                now.getFullYear(),
                11,
                31
              ).toISOString();
            }
            break;
        }
      }

      const currentParamsString = JSON.stringify(params);

      if (currentParamsString !== lastParamsRef.current) {
        // console.log("Fetching sales report with params:", params);

        const salesData = await fetchSalesReportData(params);
        setData(salesData);
        lastParamsRef.current = currentParamsString;
      } else {
        // console.log("Skipping duplicate API request with same parameters");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch sales report data");
      console.error("Sales report fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filterOutlet, filterMonth, filterYear, timeframe, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useEmptyReportData = () => {
  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

export const useOutletComparison = (
  timeframe: ReportTimeframe = "monthly",
  skipFetch: boolean = false
) => {
  const [data, setData] = useState<OutletComparisonData | null>(null);
  const [loading, setLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (skipFetch) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = { timeframe };

      if (timeframe === "custom") {
        // console.log(
        //   "Custom timeframe without date range for comparison - skipping fetch"
        // );
        setLoading(false);
        return;
      }

      const now = new Date();
      switch (timeframe) {
        case "daily":
          const dailyStart = new Date(now);
          dailyStart.setDate(now.getDate() - 30);
          dailyStart.setHours(0, 0, 0, 0);
          params.startDate = dailyStart.toISOString();

          const dailyEnd = new Date(now);
          dailyEnd.setHours(23, 59, 59, 999);
          params.endDate = dailyEnd.toISOString();
          break;

        case "weekly":
          const weeklyStart = new Date(now);
          weeklyStart.setDate(now.getDate() - 84);
          weeklyStart.setHours(0, 0, 0, 0);
          params.startDate = weeklyStart.toISOString();

          const weeklyEnd = new Date(now);
          weeklyEnd.setHours(23, 59, 59, 999);
          params.endDate = weeklyEnd.toISOString();
          break;

        case "monthly":
          const monthlyStart = new Date(now.getFullYear(), 0, 1);
          params.startDate = monthlyStart.toISOString();

          const monthlyEnd = new Date(
            now.getFullYear(),
            11,
            31,
            23,
            59,
            59,
            999
          );
          params.endDate = monthlyEnd.toISOString();
          break;

        case "yearly":
          const yearlyStart = new Date(now.getFullYear() - 4, 0, 1);
          params.startDate = yearlyStart.toISOString();

          const yearlyEnd = new Date(
            now.getFullYear(),
            11,
            31,
            23,
            59,
            59,
            999
          );
          params.endDate = yearlyEnd.toISOString();
          break;
      }

      const currentParamsString = JSON.stringify(params);

      if (currentParamsString !== lastParamsRef.current) {
        const comparisonData = await fetchComparisonData(params);
        setData(comparisonData);
        lastParamsRef.current = currentParamsString;
      } else {
        // console.log("Skipping duplicate API request with same parameters");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch comparison data");
      console.error("Comparison data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [timeframe, skipFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useTransactionTrends = (
  outletId?: number,
  period: string = "daily",
  dateRange?: { from: Date; to: Date },
  skipFetch: boolean = false
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (skipFetch) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = {
        period,
      };

      if (outletId) {
        params.outletId = outletId;
      }

      if (dateRange && dateRange.from && dateRange.to) {
        params.startDate = dateRange.from.toISOString();
        params.endDate = dateRange.to.toISOString();
      } else {
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);

        params.startDate = startDate.toISOString();
        params.endDate = now.toISOString();
      }

      const currentParamsString = JSON.stringify(params);

      if (currentParamsString !== lastParamsRef.current) {
        // console.log("Fetching transaction trends with params:", params);

        const trendsData = await fetchTransactionTrends(params);
        setData(trendsData);
        lastParamsRef.current = currentParamsString;
      } else {
        // console.log("Skipping duplicate API request with same parameters");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch transaction trends");
      console.error("Transaction trends fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [outletId, period, dateRange, skipFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useCustomerAnalytics = (
  outletId?: number,
  timeframe: ReportTimeframe = "monthly",
  skipFetch: boolean = false
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (skipFetch) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = {
        timeframe,
      };

      if (outletId) {
        params.outletId = outletId;
      }

      if (timeframe === "custom") {
        // console.log(
        //   "Custom timeframe without date range for customer analytics - skipping fetch"
        // );
        setLoading(false);
        return;
      }

      const now = new Date();
      switch (timeframe) {
        case "daily":
          const dailyStart = new Date(now);
          dailyStart.setDate(now.getDate() - 30);
          dailyStart.setHours(0, 0, 0, 0);
          params.startDate = dailyStart.toISOString();

          const dailyEnd = new Date(now);
          dailyEnd.setHours(23, 59, 59, 999);
          params.endDate = dailyEnd.toISOString();
          break;

        case "weekly":
          const weeklyStart = new Date(now);
          weeklyStart.setDate(now.getDate() - 84);
          weeklyStart.setHours(0, 0, 0, 0);
          params.startDate = weeklyStart.toISOString();

          const weeklyEnd = new Date(now);
          weeklyEnd.setHours(23, 59, 59, 999);
          params.endDate = weeklyEnd.toISOString();
          break;

        case "monthly":
          const monthlyStart = new Date(now.getFullYear(), 0, 1);
          params.startDate = monthlyStart.toISOString();

          const monthlyEnd = new Date(
            now.getFullYear(),
            11,
            31,
            23,
            59,
            59,
            999
          );
          params.endDate = monthlyEnd.toISOString();
          break;
      }

      const currentParamsString = JSON.stringify(params);

      if (currentParamsString !== lastParamsRef.current) {
        // console.log("Fetching customer analytics with params:", params);

        const analyticsData = await fetchCustomerAnalytics(params);
        setData(analyticsData);
        lastParamsRef.current = currentParamsString;
      } else {
        // console.log("Skipping duplicate API request with same parameters");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch customer analytics");
      console.error("Customer analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [outletId, timeframe, skipFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useEmployeePerformance = (
  filterOutlet?: string,
  filterMonth?: string,
  filterYear?: string
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {};

      if (filterOutlet) {
        params.filterOutlet = filterOutlet;
      }

      if (filterMonth) {
        params.filterMonth = filterMonth;
      }

      if (filterYear) {
        params.filterYear = filterYear;
      }

      const currentParamsString = JSON.stringify(params);

      if (currentParamsString !== lastParamsRef.current) {
        // console.log("Fetching employee performance with params:", params);

        const performanceData = await fetchEmployeePerformanceData(params);
        setData(performanceData);
        lastParamsRef.current = currentParamsString;
      } else {
        // console.log("Skipping duplicate API request with same parameters");
      }
    } catch (err) {
      setError("Failed to fetch employee performance data");
      console.error("Employee performance fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filterOutlet, filterMonth, filterYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
