"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import { IApiResponse, IOrder } from "@/types/worker";
import SortButton from "../sortingButton";
import NotFound from "../notFound";
import Pagination from "../paginationButton";

export default function OrderHistoryTable() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    weight: "asc",
  });
  const [filter, setFilter] = useState<string>("");
  const token = localStorage.getItem("token");

  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc", filter: string) => {
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
  }, [sortBy, order, currentPage, filter]);

  return (
    <div className="flex flex-col justify-center z-0 w-screen h-full lg:w-[1000px] overflow-x-auto">
      <div className="flex justify-end gap-3">
        <SortButton sortBy="weight" label="Sort By Weight" order={order.weight} onSort={handleSort} />
        <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
      </div>
      <div className="w-full bg-blue-200 rounded-md my-5 z-10 mx-10 lg:mx-0 relative overflow-visible">
        {/* Table */}
        <div className="overflow-x-auto">
  <table className="table w-full rounded-md text-lg">
    {/* Header Table (Hanya Muncul di Desktop) */}
    <thead className="border border-b-blue-600 text-center hidden lg:table-header-group">
      <tr className="border border-b-white text-blue-600 bg-blue-400 text-lg">
        <th className="p-3">Order Number</th>
        <th className="p-3">Date</th>
        <th className="p-3">Time</th>
        <th className="p-3">Weight (kg)</th>
        <th className="p-3">Income</th>
      </tr>
    </thead>
    {/* Body Table */}
    <tbody className="border border-white text-center text-neutral-800">
      {requests.length > 0 ? (
        requests.map((request: IOrder) => (
          <tr key={request.id} className="border border-collapse-white flex flex-col lg:table-row">
            {/* Mobile View: Header dalam Baris */}
            <td className="p-3 lg:hidden font-bold text-blue-500">Order Number</td>
            <td className="p-3">{request.orderNumber}</td>

            <td className="p-3 lg:hidden font-bold text-blue-500">Date</td>
            <td className="p-3">{formatDate(request.createdAt)}</td>

            <td className="p-3 lg:hidden font-bold text-blue-500">Time</td>
            <td className="p-3">{formatTime(new Date(request.updatedAt))}</td>

            <td className="p-3 lg:hidden font-bold text-blue-500">Weight (kg)</td>
            <td className="p-3">{request.weight}</td>

            <td className="p-3 lg:hidden font-bold text-blue-500">Income</td>
            <td className="p-3">{request.laundryPrice}</td>
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
      </div>
      <div className="mt-auto">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}