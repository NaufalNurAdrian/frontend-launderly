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
}

export interface SalesReportApiResponse {
  message: string;
  result: {
    message: string;
    result: SalesReportResult;
  };
}
