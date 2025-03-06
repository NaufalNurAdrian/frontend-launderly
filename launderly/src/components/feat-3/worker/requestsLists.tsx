"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { calculateTimeDifference } from "@/helpers/timeCounter";
import SortButton from "../sortingButton";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
import Pagination from "../paginationButton";
import { Shirt } from "lucide-react";
import { IOrder } from "@/types/worker";
import { useToken } from "@/hooks/useToken";
import { getWorkerRequests } from "@/api/worker";
import ProcessOrderModal from "./requestModal";

export default function WorkerRequestLists() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    weight: "asc",
  });
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const token = useToken();

  const fetchRequests = useCallback(
    async (page: number, sortBy: string, order: "asc" | "desc") => {
      try {
        if (!token) return;
        setLoading(true);
        const result = await getWorkerRequests(page, sortBy, order, token);
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
  const openProcessModal = (order: IOrder) => {
    setSelectedOrder(order);
  };

  const closeProcessModal = () => {
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchRequests(currentPage, sortBy, order[sortBy]);
  }, [sortBy, order, currentPage, fetchRequests]);

  return (
    <div className="max-w-[500px] lg:w-[800px] mb-20 rounded-xl bg-white shadow-md py-3 px-4 lg:px-8 min-h-[30rem] flex flex-col items-center ">
      <div className="max-w-[500px] lg:flex lg:flex-col lg:w-[600px] lg:px-10">
        <h2 className="text-xl lg:text-2xl font-bold text-blue-500 mb-2 my-2 text-center lg:text-left">Order Requests</h2>

        <div className="flex justify-between gap-3 mb-2">
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
          <div className="flex justify-center items-center my-5 p-10">
            <NotFound text="No order request found." />
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
                <div className="lg:mt-3 mt-1">
                  <button onClick={() => openProcessModal(request)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Process Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className=" w-full flex justify-center mt-auto">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      {selectedOrder && (
        <ProcessOrderModal
          order={selectedOrder}
          onClose={closeProcessModal}
          onConfirm={() => {
            closeProcessModal();
          }}
        />
      )}
    </div>
  );
}
