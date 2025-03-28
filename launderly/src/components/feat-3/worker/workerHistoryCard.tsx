"use client";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IOrder } from "@/types/worker";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
import SortButton from "../sortingButton";
import Pagination from "../paginationButton";
import { useToken } from "@/hooks/useToken";
import { getWorkerHistory } from "@/app/api/worker";

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
  const token = useToken();

  const fetchHistory = async (page: number, sortBy: string, order: "asc" | "desc") => {
    if (!token) return;
    try {
      const pageSize = 5;
      setLoading(true);
      const result = await getWorkerHistory(token, page, sortBy, order, pageSize);
      setRequests(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.page);
    } catch (err: any) {
      toast.error("Fetch failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setLoading(true)
    setCurrentPage(page);
  };

  const handleSort = (sortBy: string, newOrder: "asc" | "desc") => {
    setSortBy(sortBy);
    setOrder((prevOrder) => ({
      ...prevOrder,
      [sortBy]: prevOrder[sortBy] === "asc" ? "desc" : "asc",
    }));
    setRequests([]);
    setCurrentPage(1);
  };
  
  useEffect(() => {
    setRequests([]);
    if (token) {
      fetchHistory( currentPage, sortBy, order[sortBy]);
    }
  }, [currentPage, sortBy, order, token]);
  


  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 mb-4">
        <span className="flex justify-between gap-3 mx-2">
          <SortButton sortBy="distance" label="Sort By Distance" order={order.distance} onSort={handleSort} />
          <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
        </span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">
            <DefaultLoading />
          </div>
        ) : requests.length === 0 && !loading ? (
          <div className="flex py-10 bg-white shadow-md rounded-lg justify-center items-center my-5">
            <NotFound text={`No history data found.`} />
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="flex w-full justify-between h-[110px] border-2 bg-white p-4 py-2 rounded-lg shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-blue-600 bg-blue-300 px-2 rounded-full">
                  {formatDate(request.updatedAt)}
                </p>
                <div className="mt-1">
                  <h1 className="text-lg text-blue-500 font-bold">{request.orderNumber}</h1>
                  <h1 className="text-sm">{request.weight} kg</h1>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center">
                <h1 className="font-medium text-sm">income: </h1>
                <h1 className="font-semibold text-sm text-blue-400">{`Rp.${request.laundryPrice}`}</h1>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
