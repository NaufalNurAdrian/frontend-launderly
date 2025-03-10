import { useState, useEffect } from 'react';
import { getReportEmployeePerformance } from '@/services/reportService';
import { EmployeePerformanceData, EmployeePerformanceResponse } from '@/types/reportEmployee.type';

interface UseEmployeePerformanceProps {
  outletId: number | undefined;
  month: string;
  year: string;
}

interface UseEmployeePerformanceReturn {
  data: EmployeePerformanceData[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

export const useEmployeePerformance = ({
  outletId,
  month,
  year
}: UseEmployeePerformanceProps): UseEmployeePerformanceReturn => {
  const [data, setData] = useState<EmployeePerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchData = async () => {
    if (month === '0' || year === '0') {
      setData([]);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getReportEmployeePerformance(
        outletId?.toString() || 'all',
        month,
        year
      );
      
      const typedResponse = response as EmployeePerformanceResponse;
      setData(typedResponse.result.result.performanceReport);
    } catch (error) {
      console.error('Error fetching employee performance:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [outletId, month, year]);

  return {
    data,
    isLoading,
    isError,
    refetch: fetchData
  };
};

export default useEmployeePerformance;