"use client";
import { IApiResponse, IRequest } from "@/types/driver";
import Pagination from "../paginationButton";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import SortButton from "../sortingButton";
import FilterDropdown from "../filterButton";
import NotFound from "../notFound";
import { useToken } from "@/hooks/useToken";
import { getDriverHistory } from "@/api/driver";

function roundDistance(distance: number): number {
  return Math.round(distance * 10) / 10;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function HistoryTable() {
  const token = useToken();
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
  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc", filter: string) => {
    if (!token) return;
    try {
      const pageSize=7
      setLoading(true);
      const result = await getDriverHistory(token, page, sortBy, order, filter, pageSize)
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
    if (token) {
      fetchRequests(currentPage, sortBy, order[sortBy], filter);
    }
  }, [sortBy, order, currentPage, filter, token]);

  return (
<div className="flex flex-col justify-center z-0 bg-white shadow-md rounded-lg p-5 my-4 w-full lg:w-[1200px]">
  <div className="flex justify-end gap-3 mb-4">
    <SortButton sortBy="distance" label="Sort By Distance" order={order.distance} onSort={handleSort} />
    <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
    <FilterDropdown onFilterChange={handleFilterChange} option1="pickup" option2="delivery" />
  </div>
  <div className="w-full bg-white z-10 relative border border-blue-200 rounded-md">
    <table className="table-auto w-full text-sm text-blue-900">
      <thead className="text-center bg-[#BFDFFF] text-blue-900 font-medium">
        <tr>
          <th className="py-2 px-4 border-b border-blue-300">Order Name</th>
          <th className="py-2 px-4 border-b border-blue-300">Date</th>
          <th className="py-2 px-4 border-b border-blue-300">Time</th>
          <th className="py-2 px-4 border-b border-blue-300">Type</th>
          <th className="py-2 px-4 border-b border-blue-300">Distance (km)</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {requests.length > 0 ? (
          requests.map((request: IRequest) => (
            <tr key={request.id} className="hover:bg-blue-50 transition-colors border-b border-blue-200">
              <td className="py-2 px-4">{request.type === "delivery" ? request.deliveryNumber : request.pickupNumber}</td>
              <td className="py-2 px-4">{formatDate(request.createdAt)}</td>
              <td className="py-2 px-4">{formatTime(new Date(request.updatedAt))}</td>
              <td className="py-2 px-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                  {request.type}
                </span>
              </td>
              <td className="py-2 px-4">{roundDistance(request.distance)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center py-5">
              <div className="flex justify-center items-center">
                <NotFound text="No history data found." />
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