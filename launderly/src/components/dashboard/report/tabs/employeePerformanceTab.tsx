import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getMonthsList, getYearsList } from "@/utils/formatters";
import { Loader2 } from "lucide-react";
import { getReportEmployeePerformance } from "@/services/reportService";
import { EmployeePerformanceData, EmployeePerformanceResponse } from "@/types/reportEmployee.type";

interface EmployeePerformanceTabProps {
  outletId: number | undefined;
  selectedMonth: string;
  selectedYear: string;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
}

const EmployeePerformanceTab: React.FC<EmployeePerformanceTabProps> = ({
  outletId,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}) => {
  const [employeePerformanceData, setEmployeePerformanceData] = useState<EmployeePerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    fetchEmployeePerformance();
  }, [outletId, selectedMonth, selectedYear]);

  const fetchEmployeePerformance = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      if (selectedMonth !== "0" && selectedYear !== "0") {
        const response = await getReportEmployeePerformance(
          outletId?.toString() || "all", 
          selectedMonth, 
          selectedYear
        );
        
        const typedResponse = response as EmployeePerformanceResponse;
        setEmployeePerformanceData(typedResponse.result.result.performanceReport);
      } else {
        setEmployeePerformanceData([]);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error fetching employee performance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const months = getMonthsList();
  const years = getYearsList();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <CardTitle className="text-xl font-bold">Employee Performance Report</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <Select
                value={selectedMonth}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Select Month</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <Select
                value={selectedYear}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Select Year</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
              <span className="text-gray-600">Loading employee data...</span>
            </div>
          )}
          
          {isError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded">
              <div className="flex">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-red-700 font-medium">Failed to load employee data</p>
                  <p className="text-red-600 text-sm">Please try again or contact support if the issue persists.</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              {employeePerformanceData && employeePerformanceData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>User ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Outlet</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Tasks Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeePerformanceData.map((employee) => (
                      <TableRow key={employee.userId} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="font-mono text-sm">{employee.userId}</TableCell>
                        <TableCell className="font-medium">{employee.fullName}</TableCell>
                        <TableCell className="hidden md:table-cell text-gray-500">{employee.email}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {employee.outlet}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.shift === 'Morning' ? 'bg-yellow-100 text-yellow-800' :
                            employee.shift === 'Evening' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {employee.shift}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800 mr-2">
                              {employee.taskCompleted}
                            </span>
                            <div className="w-24 bg-gray-200 rounded-full h-2 hidden sm:block">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, employee.taskCompleted * 5)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 px-4">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No employee data available</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try changing your filter criteria or ensure employees have reported tasks for the selected period.
                  </p>
                </div>
              )}
            </div>
          )}

          {!isLoading && !isError && employeePerformanceData && employeePerformanceData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card className="overflow-hidden">
                <CardHeader className="border-b">
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="horizontal"
                      data={employeePerformanceData
                        .sort((a, b) => b.taskCompleted - a.taskCompleted)
                        .slice(0, 5)
                        .map(emp => ({
                          name: emp.fullName,
                          tasks: emp.taskCompleted
                        }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => 
                          typeof value === 'number' 
                            ? value.toString() 
                            : String(value)
                        } 
                      />
                      <Tooltip 
                        formatter={(value) => [
                          typeof value === 'number' 
                            ? value.toString() 
                            : value, 
                          'Tasks'
                        ]} 
                      />
                      <Bar dataKey="tasks" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="border-b">
                  <CardTitle>Performance by Shift</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {(() => {
                    interface ShiftData {
                      [key: string]: { total: number; count: number };
                    }
                    
                    const shifts: ShiftData = {};
                    employeePerformanceData.forEach((emp) => {
                      if (!shifts[emp.shift]) {
                        shifts[emp.shift] = { total: 0, count: 0 };
                      }
                      shifts[emp.shift].total += emp.taskCompleted;
                      shifts[emp.shift].count += 1;
                    });
                    
                    type ShiftEntryType = [string, { total: number; count: number }];
                    const shiftData = Object.entries(shifts).map(([shift, data]: ShiftEntryType) => ({
                      shift,
                      average: data.total / data.count
                    }));
                    
                    return (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                          layout="horizontal"
                          data={shiftData}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="shift" />
                          <YAxis 
                            tickFormatter={(value) => value.toFixed(1)} 
                          />
                          <Tooltip 
                            formatter={(value) => [
                              typeof value === 'number' 
                                ? value.toFixed(1) 
                                : value, 
                              'Avg Tasks'
                            ]} 
                          />
                          <Bar dataKey="average" fill="#14B8A6" />
                        </BarChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeePerformanceTab;