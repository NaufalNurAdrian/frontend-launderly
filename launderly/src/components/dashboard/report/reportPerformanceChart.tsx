import { useEffect, useState } from "react";
import { EmployeePerformanceResponse } from "@/types/reportEmployee.type";
import { getReportEmployeePerformance } from "@/services/reportService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EmployeePerformance {
  userId: number;
  fullName: string;
  email: string;
  outlet: string;
  shift: string;
  taskCompleted: number;
}

export default function ReportEmployeePerformanceChart() {
  const [filterOutlet, setFilterOutlet] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [data, setData] = useState<EmployeePerformance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmployeePerformance = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await getReportEmployeePerformance(filterOutlet, filterMonth, filterYear) as EmployeePerformanceResponse;
        setData(response.result.result.performanceReport);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployeePerformance();
  }, [filterOutlet, filterMonth, filterYear]);

  // Generate months for dropdown
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  // Generate years (current year and 4 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="w-full p-4 text-black">
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black">
          <CardTitle className="text-2xl font-bold text-center">Employee Performance Report</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Outlet</label>
              <select
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterOutlet}
                onChange={(e) => setFilterOutlet(e.target.value)}
              >
                <option value="all">All Outlets</option>
                <option value="1">Outlet 1</option>
                <option value="2">Outlet 2</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Month</label>
              <select
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <select
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Messages */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading data...</span>
            </div>
          )}
          
          {isError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-red-700 font-medium">Failed to load data</p>
                  <p className="text-red-600 text-sm">Please try again or contact support if the issue persists.</p>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              {data && data.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outlet</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Completed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((employee) => (
                      <tr key={employee.userId} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.userId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.outlet}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.shift}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {employee.taskCompleted}
                            </span>
                            <div className="ml-4 w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, employee.taskCompleted * 5)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No data available for the selected filters.</p>
                  <p className="text-sm mt-2">Try changing your filter criteria or ensure employees have reported tasks.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}