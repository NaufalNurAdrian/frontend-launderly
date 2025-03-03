import { useState, useEffect, useCallback } from 'react';
import { 
  fetchReportData, 
  fetchComparisonData, 
  fetchTransactionTrends,
  fetchCustomerAnalytics,
  fetchEmployeePerformanceData,
  fetchSalesReportData
} from '@/services/reportService';
import {
  ReportData,
  OutletComparisonData,
  TransactionTrendsData,
  CustomerAnalyticsData,
  EmployeePerformanceData,
  SalesReportData,
  ReportTimeframe,
  ReportType,
  DateRange
} from '@/types/report.types';

/**
 * Hook for fetching report data
 */
export const useReportData = (
  outletId?: number,
  timeframe: ReportTimeframe = 'monthly',
  reportType: ReportType = 'comprehensive',
  dateRange?: DateRange
) => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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

      if (dateRange) {
        params.startDate = dateRange.from.toISOString();
        params.endDate = dateRange.to.toISOString();
      }

      const reportData = await fetchReportData(params);
      setData(reportData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  }, [outletId, timeframe, reportType, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for fetching outlet comparison data
 */
export const useOutletComparison = (timeframe: ReportTimeframe = 'monthly') => {
  const [data, setData] = useState<OutletComparisonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const comparisonData = await fetchComparisonData({ timeframe });
      setData(comparisonData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for fetching transaction trend data
 */
export const useTransactionTrends = (
  outletId?: number,
  period: string = 'daily',
  dateRange?: DateRange
) => {
  const [data, setData] = useState<TransactionTrendsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        period,
      };

      if (outletId) {
        params.outletId = outletId;
      }

      if (dateRange) {
        params.startDate = dateRange.from.toISOString();
        params.endDate = dateRange.to.toISOString();
      }

      const trendsData = await fetchTransactionTrends(params);
      setData(trendsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transaction trends');
    } finally {
      setLoading(false);
    }
  }, [outletId, period, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for fetching customer analytics data
 */
export const useCustomerAnalytics = (
  outletId?: number,
  timeframe: ReportTimeframe = 'monthly'
) => {
  const [data, setData] = useState<CustomerAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        timeframe,
      };

      if (outletId) {
        params.outletId = outletId;
      }

      const analyticsData = await fetchCustomerAnalytics(params);
      setData(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer analytics');
    } finally {
      setLoading(false);
    }
  }, [outletId, timeframe]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for fetching employee performance data
 */
export const useEmployeePerformance = (
  filterOutlet?: string,
  filterMonth?: string,
  filterYear?: string
) => {
  const [data, setData] = useState<EmployeePerformanceData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

      const performanceData = await fetchEmployeePerformanceData(params);
      setData(performanceData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employee performance data');
    } finally {
      setLoading(false);
    }
  }, [filterOutlet, filterMonth, filterYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for fetching sales report data
 */
export const useSalesReport = (
  filterOutlet?: string,
  filterMonth?: string,
  filterYear?: string
) => {
  const [data, setData] = useState<SalesReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

      const salesData = await fetchSalesReportData(params);
      setData(salesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sales report data');
    } finally {
      setLoading(false);
    }
  }, [filterOutlet, filterMonth, filterYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};