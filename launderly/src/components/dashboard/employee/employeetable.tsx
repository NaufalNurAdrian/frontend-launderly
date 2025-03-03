"use client";

import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Employee, EmployeeApiResponse } from "@/types/employee.type";
import { fetchAllEmployee } from "@/services/employeService";
import { Card } from "@/components/ui/card";
import { LiaEdit } from "react-icons/lia";
import { RiUserLine } from "react-icons/ri";
import { MdOutlineStore, MdOutlineWorkOutline } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { GiWashingMachine } from "react-icons/gi";
import ModalEmployeeUpdate from "./updateEmployee";

interface EmployeeTableProps {
  searchQuery?: string;
}

export default function EmployeeTable({ searchQuery = "" }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const pageSize = 15;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data: EmployeeApiResponse = await fetchAllEmployee(currentPage, pageSize);
        setAllEmployees(data.employees);
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

  // Filter employees when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setEmployees(allEmployees);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allEmployees.filter(emp => 
      emp.user.fullName.toLowerCase().includes(query) ||
      (emp.outlet?.outletName && emp.outlet.outletName.toLowerCase().includes(query)) ||
      emp.user.role.toLowerCase().includes(query) ||
      (emp.station && emp.station.toLowerCase().includes(query)) ||
      (emp.workShift && emp.workShift.toLowerCase().includes(query))
    );
    
    setEmployees(filtered);
  }, [searchQuery, allEmployees]);

  const handleEditClick = (id: string) => {
    setSelectedEmployeeId(id);
    setModalOpen(true);
  };

  // Calculate if we show "No results" message
  const showNoResults = useMemo(() => {
    return !loading && employees.length === 0 && searchQuery.trim() !== "";
  }, [loading, employees, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
            <GiWashingMachine className="w-12 h-12 text-blue-600" />
          </div>
          <div className="mt-4 text-blue-600 font-medium">Loading employees...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (showNoResults) {
    return (
      <Card className="m-4 shadow-lg rounded-xl overflow-hidden bg-white border-none">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
          <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <span>Employee Directory</span>
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl text-blue-200 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No employees found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
          <button 
            onClick={() => setCurrentPage(1)} 
            className="mt-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            View all employees
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="m-4 shadow-lg rounded-xl overflow-hidden bg-white border-none">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
        <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <span>Employee Directory</span>
          {searchQuery && (
            <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
              Search: "{searchQuery}"
            </span>
          )}
        </h2>
      </div>
      
      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-semibold text-blue-900 px-4 py-3">ID</TableHead>
              <TableHead className="font-semibold text-blue-900 px-4 py-3">Name</TableHead>
              <TableHead className="font-semibold text-blue-900 px-4 py-3">Outlet</TableHead>
              <TableHead className="font-semibold text-blue-900 px-4 py-3">Role</TableHead>
              <TableHead className="font-semibold text-blue-900 px-4 py-3">Station</TableHead>
              <TableHead className="font-semibold text-blue-900 px-4 py-3">Shift</TableHead>
              <TableHead className="font-semibold text-blue-900 px-4 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-blue-50 transition-colors">
                <TableCell className="px-4 py-3 font-medium text-gray-900">{employee.id}</TableCell>
                <TableCell className="px-4 py-3">{employee.user.fullName}</TableCell>
                <TableCell className="px-4 py-3">{employee.outlet?.outletName || "-"}</TableCell>
                <TableCell className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {employee.user.role}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">{employee.station || "-"}</TableCell>
                <TableCell className="px-4 py-3">{employee.workShift || "-"}</TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <button 
                    onClick={() => handleEditClick(employee.id.toString())}
                    className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <LiaEdit className="text-blue-700" size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view - Cards */}
      <div className="md:hidden px-4 py-2 space-y-4">
        {employees.map((employee) => (
          <div 
            key={employee.id}
            className="bg-white rounded-lg border border-blue-100 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="p-4 border-b border-blue-100 flex justify-between items-center bg-blue-50">
              <div>
                <h3 className="font-medium text-gray-900">{employee.user.fullName}</h3>
                <span className="text-xs text-blue-700">ID: {employee.id}</span>
              </div>
              <button 
                onClick={() => handleEditClick(employee.id.toString())}
                className="bg-white p-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                <LiaEdit className="text-blue-700" size={18} />
              </button>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-blue-100 rounded-full">
                  <RiUserLine className="text-blue-700" />
                </span>
                <div>
                  <div className="text-gray-500">Role</div>
                  <div className="font-medium text-blue-800">{employee.user.role}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-blue-100 rounded-full">
                  <MdOutlineStore className="text-blue-700" />
                </span>
                <div>
                  <div className="text-gray-500">Outlet</div>
                  <div className="font-medium">{employee.outlet?.outletName || "-"}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-blue-100 rounded-full">
                  <MdOutlineWorkOutline className="text-blue-700" />
                </span>
                <div>
                  <div className="text-gray-500">Station</div>
                  <div className="font-medium">{employee.station || "-"}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-blue-100 rounded-full">
                  <BiTimeFive className="text-blue-700" />
                </span>
                <div>
                  <div className="text-gray-500">Work Shift</div>
                  <div className="font-medium">{employee.workShift || "-"}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Works for both mobile and desktop */}
      {employees.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-blue-50 border-t border-blue-100">
          <button
            className="flex items-center gap-1 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <IoArrowBack size={16} />
            <span className="hidden sm:inline-block">Previous</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <span className="text-sm text-blue-700 sm:hidden">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button
            className="flex items-center gap-1 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline-block">Next</span>
            <IoArrowForward size={16} />
          </button>
        </div>
      )}

      {isModalOpen && selectedEmployeeId && (
        <ModalEmployeeUpdate
          id={selectedEmployeeId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </Card>
  );
}