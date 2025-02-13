"use client";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IApiResponse, IOrder } from "@/types/worker";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
import SortButton from "../sortingButton";
import FilterDropdown from "../driver/history/filterButton";
import Pagination from "../paginationButton";

export default function OrderMobileHistoryTable() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    distance: "asc",
  });
  const [filter, setFilter] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc", filter: string) => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/order/history/?&page=${page}&sortBy=${sortBy}&order=${order}&type=${filter}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result: IApiResponse = await res.json();
      setRequests(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.page);
    } catch (err) {
      toast.error("Fetch failed: " + (err instanceof Error ? err.message : "Unknown error"));
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

  if (loading) {
    return <div className="text-center items-center py-5"><DefaultLoading/></div>;
  }

  if (requests.length === 0 && !loading) {
    return <div className="text-center py-5">\<NotFound text="not history found"/></div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 mb-4">
        <span className="flex justify-between mx-2">
        <SortButton sortBy="distance" label="Sort By Distance" order={order.distance} onSort={handleSort} />
        <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
        </span>
        <FilterDropdown onFilterChange={handleFilterChange} option1="pickup" option2="delivery" />
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="flex w-full justify-between h-[100px] border-2 p-4 py-2 rounded-lg shadow-sm">
            <div className="flex flex-col">
              <p className="text-sm text-blue-600 bg-blue-300 px-2 rounded-full">
                {formatDate(request.updatedAt)} : {formatTime(new Date(request.updatedAt))}
              </p>
              <div className="mt-2">
                <h1 className="text-lg text-blue-500 font-bold">{request.orderNumber}</h1>
                <h1 className="text-sm">{request.weight} kg</h1>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <h1 className="font-medium text-sm">income: </h1>
              <h1 className="font-semibold text-sm text-blue-400">{request.laundryPrice}</h1>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}