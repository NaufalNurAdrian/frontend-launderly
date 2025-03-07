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
  ReportTimeframe,
  ReportType
} from '@/types/report.types';

/**
 * Hook for fetching report data with an option to skip fetching
 */
export const useReportData = (
  outletId?: number,
  timeframe: ReportTimeframe = 'monthly',
  reportType: ReportType = 'comprehensive',
  dateRange?: { from: Date; to: Date },
  skipFetch: boolean = false
) => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Skip API call if skipFetch is true
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
  }, [outletId, timeframe, reportType, dateRange, skipFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Mock function to return empty data without making API call
 */
export const useEmptyReportData = () => {
  return { 
    data: null, 
    loading: false, 
    error: null, 
    refetch: () => Promise.resolve() 
  };
};

/**
 * Hook for fetching outlet comparison data with an option to skip fetching
 */
export const useOutletComparison = (
  timeframe: ReportTimeframe = 'monthly',
  skipFetch: boolean = false
) => {
  const [data, setData] = useState<OutletComparisonData | null>(null);
  const [loading, setLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Skip API call if skipFetch is true
    if (skipFetch) {
      setLoading(false);
      return;
    }
    
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
  }, [timeframe, skipFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for fetching transaction trend data with an option to skip fetching
 */
export const useTransactionTrends = (
  outletId?: number,
  period: string = 'daily',
  dateRange?: { from: Date; to: Date },
  skipFetch: boolean = false
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Skip API call if skipFetch is true
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
  }, [outletId, period, dateRange, skipFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for fetching customer analytics data with an option to skip fetching
 */
export const useCustomerAnalytics = (
  outletId?: number,
  timeframe: ReportTimeframe = 'monthly',
  skipFetch: boolean = false
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Skip API call if skipFetch is true
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

      const analyticsData = await fetchCustomerAnalytics(params);
      setData(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer analytics');
    } finally {
      setLoading(false);
    }
  }, [outletId, timeframe, skipFetch]);

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
  const [data, setData] = useState<any>(null);
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
  const [data, setData] = useState<any>(null);
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