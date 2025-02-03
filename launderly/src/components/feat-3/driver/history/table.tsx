"use client";
import { IApiResponse, IRequest } from "@/types/request";
import Pagination from "../../paginationButton";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import SortButton from "../../sortingButton";
import FilterDropdown from "./filterButton";
import NotFound from "../../notFound";

function roundDistance(distance: number): number {
  return Math.round(distance * 10) / 10;
}

export default function HistoryTable() {
  const driverId = 1;
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
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/request/?driverId=${driverId}&page=${page}&sortBy=${sortBy}&order=${order}&type=${filter}`, {
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
    <div className="flex flex-col justify-center z-0 w-screen lg:w-[1000px] overflow-x-scroll">
      <div className="flex justify-end gap-3">
        <SortButton sortBy="distance" order={order.distance} onSort={handleSort} />
        <SortButton sortBy="createdAt" order={order.createdAt} onSort={handleSort} />
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
                    <NotFound text="No History data found." />
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
