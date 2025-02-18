"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { calculateTimeDifference } from "@/helpers/timeCounter";
import SortButton from "../sortingButton";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
import Pagination from "../paginationButton";
import { Shirt } from "lucide-react";
import { IApiResponse, IOrder } from "@/types/worker";
import ProcessOrderButton from "./processOrderButton";
import { useToken } from "@/hooks/useToken";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function RequestList() {
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

  const fetchRequests = useCallback(
    async (page: number, sortBy: string, order: "asc" | "desc") => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/order/?page=${page}&sortBy=${sortBy}&order=${order}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    },
    [token]
  );

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
    fetchRequests(currentPage, sortBy, order[sortBy]);
  }, [sortBy, order, currentPage, fetchRequests]);

  const handleSuccess = () => {
    fetchRequests(currentPage, sortBy, order[sortBy]);
  };

  return (
    <div className="max-w-[500px] mb-20 lg:w-[800px] rounded-xl bg-white shadow-md py-3 px-4 lg:px-8 min-h-[30rem] flex flex-col items-center">
      <div className="max-w-[500px] lg:max-w-[700px]">
        <h2 className="text-xl lg:text-2xl font-bold text-blue-500 mb-2 lg:mb-4 text-center lg:text-left">Order Requests</h2>
        <div className="flex flex-row justify-between gap-3 mb-2">
          <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
          <SortButton sortBy="weight" label="Sort By Weight" order={order.weight} onSort={handleSort} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 w-full">
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">
            <DefaultLoading />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex justify-center items-center my-5">
            <NotFound text="No Order Request found." />
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request: IOrder) => (
              <div key={request.id} className="bg-blue-400/30 w-full px-4 lg:px-6 py-3 rounded-xl border border-blue-600">
                <p className="text-blue-500 font-bold text-lg lg:text-xl">{request.pickupOrder.user.fullName || "Unknown User"}</p>
                <div>
                  <p className="text-blue-600 text-sm lg:text-md">{request.orderNumber}</p>
                </div>
                <p className="text-xs lg:text-sm text-gray-500">Requested {calculateTimeDifference(request.createdAt)}</p>
                <div className="flex items-center mt-2">
                  <Shirt size={16} className="text-blue-500" />
                  <span className="ml-2 text-sm lg:text-md">{request.weight || "Unknown Weight"} Kg</span>
                </div>
                <div className="mt-3">
                  <ProcessOrderButton orderId={request.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 mb-10 w-full flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
