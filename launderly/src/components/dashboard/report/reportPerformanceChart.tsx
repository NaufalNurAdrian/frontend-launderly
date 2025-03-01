import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "@/libs/api";
import { EmployeePerformanceResponse } from "@/types/reportEmployee.type";
import { getReportEmployeePerformance } from "@/services/reportService";

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
        setData(response.result.performanceReport);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployeePerformance();
  }, [filterOutlet, filterMonth, filterYear]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center">Employee Performance Report</h1>

      {/* Filter */}
      <div className="flex justify-center gap-4 my-4">
        <select
          className="border p-2 rounded"
          value={filterOutlet}
          onChange={(e) => setFilterOutlet(e.target.value)}
        >
          <option value="all">All Outlets</option>
          <option value="1">Outlet 1</option>
          <option value="2">Outlet 2</option>
        </select>
        <input
          type="number"
          placeholder="Month (1-12)"
          className="border p-2 rounded"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          className="border p-2 rounded"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load data</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Outlet</th>
                <th className="p-3 text-left">Shift</th>
                <th className="p-3 text-left">Tasks Completed</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((employee) => (
                <tr key={employee.userId} className="border-b hover:bg-gray-100">
                  <td className="p-3">{employee.userId}</td>
                  <td className="p-3">{employee.fullName}</td>
                  <td className="p-3">{employee.email}</td>
                  <td className="p-3">{employee.outlet}</td>
                  <td className="p-3">{employee.shift}</td>
                  <td className="p-3 text-center">{employee.taskCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
function isloading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

