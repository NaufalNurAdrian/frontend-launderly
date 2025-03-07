"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import { IOrder } from "@/types/worker";
import SortButton from "../sortingButton";
import NotFound from "../notFound";
import Pagination from "../paginationButton";
import { useToken } from "@/hooks/useToken";
import { getWorkerHistory } from "@/app/api/worker";

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
  const token = useToken();

  const fetchHistory = async (
    token: string,
    page: number,
    sortBy: string,
    order: "asc" | "desc"
  ) => {
    if (!token) return;
    try {
      const pageSize = 7;
      setLoading(true);
      const result = await getWorkerHistory(
        token,
        page,
        sortBy,
        order,
        pageSize
      );
      setRequests(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.page);
    } catch (err) {
      toast.error("Fetch failed: " + err);
    } finally {
      setLoading(false);
    }
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
      fetchHistory(token, currentPage, sortBy, order[sortBy]);
    }
  }, [sortBy, order, currentPage, token]);

  return (
    <div className="flex flex-col justify-center z-0 bg-white shadow-md w-full lg:w-[1200px] rounded-lg p-5 my-4">
      <div className="flex justify-end gap-3 mb-4">
        <SortButton
          sortBy="weight"
          label="Sort By Weight"
          order={order.weight}
          onSort={handleSort}
        />
        <SortButton
          sortBy="createdAt"
          label="Sort By Date"
          order={order.createdAt}
          onSort={handleSort}
        />
      </div>
      <div className="w-full bg-white z-10 relative border border-blue-200 rounded-md">
        <table className="table-auto w-full text-sm text-blue-900">
          <thead className="text-center bg-[#BFDFFF] text-blue-900 font-medium">
            <tr className="text-blue-900 bg-blue-300">
              <th className="py-2 px-4 border-b border-blue-300">
                Order Number
              </th>
              <th className="py-2 px-4 border-b border-blue-300">Date</th>
              <th className="py-2 px-4 border-b border-blue-300">Time</th>
              <th className="py-2 px-4 border-b border-blue-300">
                Weight (kg)
              </th>
              <th className="py-2 px-4 border-b border-blue-300">Income</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {requests.length > 0 ? (
              requests.map((request: IOrder) => (
                <tr
                  key={request.id}
                  className="hover:bg-blue-50 transition-colors border-b border-blue-200"
                >
                  <td className="py-2 px-4">{request.orderNumber}</td>
                  <td className="py-2 px-4">{formatDate(request.createdAt)}</td>
                  <td className="py-2 px-4">
                    {formatTime(new Date(request.updatedAt))}
                  </td>
                  <td className="py-2 px-4">{request.weight}</td>
                  <td className="py-2 px-4">{request.laundryPrice}</td>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
