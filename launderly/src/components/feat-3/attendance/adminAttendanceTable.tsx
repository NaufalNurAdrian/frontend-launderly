"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import { IApiResponse, IAttendance } from "@/types/attendance";
import SortButton from "../sortingButton";
import FilterDropdown from "../driver/history/filterButton";
import Pagination from "../paginationButton";

function roundDistance(distance: number): number {
  return Math.round(distance * 10) / 10;
}

export default function HistoryTable() {
  const driverId = 1;
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IAttendance[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    distance: "asc",
  });
  const [filter, setFilter] = useState<string>("");

  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc", filter: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/attendance/all-history/?driverId=${driverId}&page=${page}&sortBy=${sortBy}&order=${order}&role=${filter}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result: IApiResponse = await res.json();
      setRequests(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.page);
    } catch (err) {
      toast.error("Fetch failed: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (selectedFilter: any) => {
    setFilter(selectedFilter);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (sortBy: string, newOrder: "asc" | "desc") => {
    setSortBy(sortBy);
    setOrder((prevOrder) => ({
      ...prevOrder,
      [sortBy]: prevOrder[sortBy] === "asc" ? "desc" : "asc",
    }));
  };
  useEffect(() => {
    fetchRequests(currentPage, sortBy, order[sortBy], filter);
  }, [sortBy, order, currentPage, driverId, filter]);

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-end gap-3">
        <SortButton sortBy="workHour" order={order.workHour} onSort={handleSort} />
        <SortButton sortBy="createdAt" order={order.createdAt} onSort={handleSort} />
        <FilterDropdown onFilterChange={handleFilterChange} option1="driver" option2="worker"/>
      </div>
      <div className="w-full bg-blue-200 rounded-md my-5">
        <table className="table table-lg lg:w-[1000px] rounded-md text-lg">
          <thead className="border border-b-blue-600 text-center">
            <tr className="border border-b-white text-blue-600 bg-blue-400 text-lg">
              <th>Date</th>
              <th>worker name</th>
              <th>Email</th>
              <th>role</th>
              <th>clock In</th>
              <th>clock Out</th>
              <th>Workhour</th>
            </tr>
          </thead>
          <tbody className="border border-white text-center text-neutral-800">
            {requests.length > 0 ? (
              requests.map((request: IAttendance) => (
                <tr key={request.id} className="border border-collapse-white">
                 <td className="p-5">{formatDate(request.createdAt)}</td> 
                  <td>{request.user.fullName}</td>
                  <td>{request.user.email}</td>
                  <td>{request.user.role}</td>
                  <td>{formatTime(new Date(request.checkIn))}</td>
                  <td>{formatTime(new Date(request.checkOut))}</td>
                  <td>{request.workHour}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-auto">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
