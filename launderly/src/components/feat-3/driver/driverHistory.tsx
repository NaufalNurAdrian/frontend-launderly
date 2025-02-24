"use client";
import { IApiResponse, IRequest } from "@/types/driver";
<<<<<<< HEAD:launderly/src/components/feat-3/driver/history/table.tsx
import Pagination from "../../paginationButton";
=======
import Pagination from "../paginationButton";
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/driverHistory.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import SortButton from "../sortingButton";
import FilterDropdown from "../filterButton";
import NotFound from "../notFound";
import { useToken } from "@/hooks/useToken";

function roundDistance(distance: number): number {
  return Math.round(distance * 10) / 10;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function HistoryTable() {
<<<<<<< HEAD:launderly/src/components/feat-3/driver/history/table.tsx
=======
  const token = useToken();
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/driverHistory.tsx
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    distance: "asc",
  });
  const [filter, setFilter] = useState<string>("");
<<<<<<< HEAD:launderly/src/components/feat-3/driver/history/table.tsx
  const token = localStorage.getItem('token')
=======
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/driverHistory.tsx
  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc", filter: string) => {
    if (!token) return;
    try {
      setLoading(true);
<<<<<<< HEAD:launderly/src/components/feat-3/driver/history/table.tsx
      const res = await fetch(`http://localhost:8000/api/request/?&page=${page}&sortBy=${sortBy}&order=${order}&type=${filter}`, {
        method: "GET",
        headers: {  "Authorization": `Bearer ${token}`,"Content-Type": "application/json" },
=======
      const res = await fetch(`${BASE_URL}/request/?page=${page}&sortBy=${sortBy}&order=${order}&type=${filter}&pageSize=7`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/driverHistory.tsx
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

  const handleFilterChange = (selectedFilter: string) => {
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
<<<<<<< HEAD:launderly/src/components/feat-3/driver/history/table.tsx
    fetchRequests(currentPage, sortBy, order[sortBy], filter);
  }, [sortBy, order, currentPage, filter]);
=======
    if (token) {
      fetchRequests(currentPage, sortBy, order[sortBy], filter);
    }
  }, [sortBy, order, currentPage, filter, token]);
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/driverHistory.tsx

  return (
    <div className="flex flex-col justify-center z-0 w-screen lg:w-[1000px] overflow-x-scroll">
      <div className="flex justify-end gap-3">
        <SortButton sortBy="distance" label="Sort By Distance" order={order.distance} onSort={handleSort} />
        <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
        <FilterDropdown onFilterChange={handleFilterChange} option1="pickup" option2="delivery" />
      </div>
      <div className="w-full bg-blue-200 rounded-md my-5 z-10 mx-10 lg:mx-0 relative overflow-visible">
        <table className="table table-lg w-screen overflow-x-scroll lg:w-[1000px] rounded-md text-lg">
          <thead className="border border-b-blue-600 text-center">
            <tr className="border border-b-white text-blue-600 bg-blue-400 text-lg">
              <th>orderName</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Distance (km)</th>
            </tr>
          </thead>
          <tbody className="border border-white text-center text-neutral-800">
            {requests.length > 0 ? (
              requests.map((request: IRequest) => (
                <tr key={request.id} className="border border-collapse-white">
                  {request.type == "delivery" ? <td className="p-5">{request.deliveryNumber}</td> : <td className="p-5">{request.pickupNumber}</td>}
                  <td>{formatDate(request.createdAt)}</td>
                  <td>{formatTime(new Date(request.updatedAt))}</td>
                  <td>{request.type}</td>
                  <td>{roundDistance(request.distance)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5">
                  <div className="flex justify-center items-center">
                    <NotFound text="No History Data Found." />
                  </div>
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
