"use client";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { IRequest } from "@/types/driver";
import { toast } from "react-hot-toast";
import { calculateTimeDifference } from "@/helpers/timeCounter";
import SortButton from "../sortingButton";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
import Pagination from "../paginationButton";
import { getDriverRequests } from "@/api/driver";
import Modal from "./processModal";
import { useToken } from "@/hooks/useToken";

interface IProps {
  type: "pickup" | "delivery";
}

export default function DriverRequestLists({ type }: IProps) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    distance: "asc",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: number;
    type: "pickup" | "delivery";
    status: string;
    address: string;
    orderNumber: string;
  } | null>(null);
  const token = useToken();
  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc") => {
    try {
      if (!token) return;
      setLoading(true);
      const result = await getDriverRequests(page, sortBy, order, token, type);
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

  const handleSuccess = (requestId: number, newStatus: string) => {
    updateRequestStatus(requestId, newStatus);
    fetchRequests(currentPage, sortBy, order[sortBy]);
  };
  
  const openModal = (requestId: number, type: "pickup" | "delivery", status: string, address: string, orderNumber: string) => {
    setSelectedRequest({ id: requestId, type, status, address, orderNumber });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const updateRequestStatus = (requestId: number, newStatus: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              ...(type === "delivery" ? { deliveryStatus: newStatus } : { pickupStatus: newStatus }),
            }
          : req
      )
    );
  };
  useEffect(() => {
    fetchRequests(currentPage, sortBy, order[sortBy]);
  }, [sortBy, order[sortBy], currentPage, type, token]);

  return (
    <div className=" max-w-[500px] max-sm:mr-8 mb-20 lg:max-w-[700px] rounded-xl bg-white shadow-md py-3 px-4 lg:px-8 min-h-[30rem] flex flex-col items-center">
      <div className=" max-w-[500px]">
        <h2 className="text-xl lg:text-2xl font-bold text-blue-500 mb-2 my-2">{type === "pickup" ? "Pick up" : "Delivery"} Requests</h2>
        <div className="flex justify-between gap-3 mb-2">
          <SortButton sortBy="distance" label="Sort by Distance" order={order.distance} onSort={handleSort} />
          <SortButton sortBy="createdAt" label="Sort by Date" order={order.createdAt} onSort={handleSort} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 w-full">
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">
            <DefaultLoading />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex justify-center items-center my-5">
            <NotFound text={`No ${type === "pickup" ? "pick up" : "delivery"} request found.`} />
          </div>
        ) : (
          <div>
            {requests.map((request: IRequest) => (
              <div key={request.id} className="bg-blue-400/30 mb-2 px-4 py-3 rounded-xl border border-blue-600">
                <p className="text-blue-500 font-bold text-md sm:text-lg">{request.user.fullName || "Unknown User"}</p>
                {type === "delivery" ? (
                  <div>
                    <p className="text-blue-600 text-md">{request.deliveryNumber}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-blue-600 text-md">{request.pickupNumber}</p>
                  </div>
                )}
                <p className="text-xs sm:text-sm text-gray-500">Requested {calculateTimeDifference(request.createdAt)}</p>
                <div className="flex items-center">
                  <MapPin size={20} className="text-blue-500" />
                  {request.address.addressLine || "Unknown Address"}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 mx-4">{Math.round(request.distance * 10) / 10} km from outlet</p>
                <button
                  onClick={() =>
                    openModal(
                      request.id,
                      type as "pickup" | "delivery",
                      type === "delivery" ? request.deliveryStatus! : request.pickupStatus!,
                      request.address.addressLine,
                      type === "delivery" ? request.deliveryNumber! : request.pickupNumber!
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Process Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={closeModal}
          requestId={selectedRequest.id}
          type={selectedRequest.type}
          status={selectedRequest.type === "pickup" ? requests.find((r) => r.id === selectedRequest.id)?.pickupStatus || "" : requests.find((r) => r.id === selectedRequest.id)?.deliveryStatus || ""}
          address={selectedRequest.address}
          orderNumber={selectedRequest.orderNumber}
          onSuccess={handleSuccess}
          updateRequestStatus={updateRequestStatus}
        />
      )}
    </div>
  );
}
