"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { calculateTimeDifference } from "@/helpers/timeCounter";
import SortButton from "../sortingButton";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
import Pagination from "../paginationButton";
import { Shirt } from "lucide-react";
import { IApiResponse, IOrder } from "@/types/worker";
import ProcessOrderButton from "./processOrderButton";

interface IList {
  workerId: number;
}

export default function RequestList({ workerId }: IList) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
   weight: "asc",
  });
  const token = localStorage.getItem("token")
  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc") => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/order/?workerId=${workerId}&page=${page}&sortBy=${sortBy}&order=${order}`, {
        method: "GET",
        headers: {   'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
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
  }, [sortBy, order, currentPage, workerId]);

  const handleSuccess = () => {
    fetchRequests(currentPage, sortBy, order[sortBy]);
  };
  return (
    <div className="lg:w-[800px] rounded-xl bg-white shadow-md py-3 px-8 min-h-[30rem] flex flex-col items-center">
      <div className="lg:w-[700px]">
        <h2 className="text-2xl font-bold text-blue-500 mb-1 my-2">Order Requests</h2>
        <div className="flex justify-between gap-3 mb-2">
          <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
          <SortButton sortBy="weight" label="Sort By Weight" order={order.weight} onSort={handleSort} />
        </div>
      </div>
      <div className=" grid grid-rows-auto w-full justify-center">
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">
            <DefaultLoading />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex justify-center items-center my-5">
            <NotFound text={`No Order Request found.`} />
          </div>
        ) : (
          <div>
            {requests.map((request: IOrder) => (
              <div key={request.id} className="bg-blue-400/30 mb-2 lg:w-[400px] w-[330px] px-8 lg:px-10 py-3 rounded-xl border border-blue-600">
                <p className="text-blue-500 font-bold text-xl">{request.pickupOrder.user.fullName || "Unknown User"}</p>
                <div>
                  <p className="text-blue-600 text-md">{request.orderNumber}</p>
                </div>
                <p className="text-sm text-gray-500">Requested {calculateTimeDifference(request.createdAt)}</p>
                <div className="flex items-center">
                  <Shirt size={16} className=" text-blue-500" />
                  {request.weight|| "Unknown Weight"} Kg
                </div>
                <div><ProcessOrderButton orderId={request.id} workerId={workerId}/></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
