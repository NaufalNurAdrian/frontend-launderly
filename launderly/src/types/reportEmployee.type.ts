export interface EmployeePerformanceQuery {
  filterOutlet?: string;
  filterMonth?: string;
  filterYear?: string;
  id: number;
}

export interface EmployeePerformanceData {
  userId: number;
  fullName: string;
  email: string;
  outlet: string;
  shift: string;
  taskCompleted: number;
}

export interface EmployeePerformanceResponse {
  message: string;
  result: {
    message: string;
    result: {
      performanceReport: EmployeePerformanceData[];
    }
  };
}
