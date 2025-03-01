"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Employee, EmployeeApiResponse } from "@/types/employee.type";
import { fetchAllEmployee } from "@/services/employeService";
import { Card } from "@/components/ui/card";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data: EmployeeApiResponse = await fetchAllEmployee(currentPage, pageSize);
        setEmployees(data.employees);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage]);

  if (loading) {
    return <div className="text-center py-5 text-gray-600">Loading employees...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-5">Error: {error}</div>;
  }

  return (
    <Card className="m-6 p-5 shadow-md rounded-lg bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Employee List</h2>
      
      {/* Table Responsive */}
      <div className="overflow-x-auto">
        <Table className="min-w-full border rounded-lg">
          <TableCaption>List of employees</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="px-3 py-2">ID</TableHead>
              <TableHead className="px-3 py-2">Name</TableHead>
              <TableHead className="px-3 py-2 hidden md:table-cell">Outlet</TableHead>
              <TableHead className="px-3 py-2">Role</TableHead>
              <TableHead className="px-3 py-2 hidden lg:table-cell">Station</TableHead>
              <TableHead className="px-3 py-2 hidden lg:table-cell">Shift</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-gray-50">
                <TableCell className="px-3 py-2 font-medium">{employee.id}</TableCell>
                <TableCell className="px-3 py-2">{employee.user.fullName}</TableCell>
                <TableCell className="px-3 py-2 hidden md:table-cell">{employee.outlet?.outletName || "-"}</TableCell>
                <TableCell className="px-3 py-2">{employee.user.role}</TableCell>
                <TableCell className="px-3 py-2 hidden lg:table-cell">{employee.station || "-"}</TableCell>
                <TableCell className="px-3 py-2 hidden lg:table-cell">{employee.workShift || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Prev
        </button>
        <span className="text-gray-800">Page {currentPage} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>
    </Card>
  );
}
