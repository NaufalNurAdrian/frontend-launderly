"use client";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Pagination from "../../paginationButton";

interface Irequest {
  type: string;
  // fetchUrl: string
}

interface Request {
  id: number;
  type: string;
  status: "pending" | "in-progress" | "completed";
}

const RequestList = ({ type }: Irequest) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([
    { id: 1, type: "Pickup", status: "pending" },
    { id: 2, type: "Delivery", status: "pending" },
  ]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState("WAITING_FOR_PICKUP_DRIVER");

  const handleButtonClick = (requestId: number, currentStatus: string) => {
    if (currentStatus === "pending") {
      // Ubah status jadi in-progress
      setRequests((prevRequests) => prevRequests.map((req) => (req.id === requestId ? { ...req, status: "in-progress" } : req)));
      setCurrentRequestId(requestId); // Tandai request yang sedang diproses
    } else if (currentStatus === "in-progress") {
      // Ubah status jadi completed
      setRequests((prevRequests) => prevRequests.map((req) => (req.id === requestId ? { ...req, status: "completed" } : req)));
      setCurrentRequestId(null); // Reset current request
    }
  };
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleRequestAction = async (request) => {
    if (orderStatus === "WAITING_FOR_PICKUP_DRIVER") {
      // Jika driver sedang menunggu pickup
      try {
        const response = await fetch("/api/requests/take", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId: request.id }),
        });
        if (response.ok) {
          setOrderStatus("ON_THE_WAY_TO_CUSTOMER"); // Ubah status driver
          setCurrentRequest(request); // Menandakan request yang diproses
        }
      } catch (error) {
        console.error("Failed to take request:", error);
      }
    } else if (orderStatus === "ON_THE_WAY_TO_CUSTOMER") {
      // Jika driver sedang dalam perjalanan menuju customer
      setOrderStatus("ON_THE_WAY_TO_OUTLET"); // Update status sesuai dengan perjalanan
    } else if (orderStatus === "ON_THE_WAY_TO_OUTLET") {
      // Jika driver sedang menuju outlet
      setOrderStatus("ARRIVED_AT_OUTLET"); // Ubah status setelah sampai
    }
  };

  const handleTakeRequest = async (request: Request) => {
  setCurrentRequest({ ...request, status: 'in-progress' });

  // Update status in database atau server
  const response = await fetch(`/api/requests/${request.id}/take`, {
      method: 'POST',
      body: JSON.stringify({ status: 'in-progress' }),
  });

    if (response.ok) {
      toast.success('Request is now in progress');
    } else {
      toast.error('Failed to take request');
    }
  };

  const handleFinishRequest = async () => {
      if (currentRequest) {
          const response = await fetch(`/api/requests/${currentRequest.id}/finish`, {
        method: 'POST',
        body: JSON.stringify({ status: 'completed' }),
      });

      if (response.ok) {
        setCurrentRequest(null); // Reset current request
        toast.success('Request finished');
      } else {
        toast.error('Failed to finish request');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        setRequests(data);
        toast.custom('There`s new request !')
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl]);

  if (loading) return <p>Loading {type} requests...</p>;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-[500px] rounded-xl bg-neutral-100 border-blue-300 border py-3 px-8 grid grid-rows-auto min-h-[20rem] justify-center ">
      <h2 className="text-xl font-bold text-blue-500">{type} Requests</h2>
      {requests.map((request) => (
        <div className="w-[450px] my-3 p-2 flex flex-col rounded-xl bg-white shadow-md">
        <div className="px-2 pb-3">
          <p className="text-blue-500 font-bold text-xl">Username</p>
          <p className="text-sm text-gray-500 mb-1">requested since 08.10</p>
          <div className="flex mb-2">
            <MapPin /> Jl. NusaIndah
          </div>
          </div>
          {orderStatus === "WAITING_FOR_PICKUP_DRIVER" && (
            <button onClick={() => handleRequestAction(currentRequest)} disabled={isProcessing && currentRequest?.id !== currentRequest.id} className="py-2 px-4 rounded-xl bg-blue-500 text-white">
              Take Request
            </button>
          )}
          {orderStatus === "ON_THE_WAY_TO_CUSTOMER" && (
            <button onClick={() => handleRequestAction(currentRequest)} className="py-2 px-4 rounded-xl bg-yellow-500">
              On the way to customer
            </button>
          )}
          {orderStatus === "ON_THE_WAY_TO_OUTLET" && (
            <button onClick={() => handleRequestAction(currentRequest)} className="py-2 px-4 rounded-xl bg-green-500 text-white">
              On the way to outlet
            </button>
          )}
          {orderStatus === "ARRIVED_AT_OUTLET" && (
            <button onClick={() => handleRequestAction(currentRequest)} className="py-2 px-4 rounded-xl bg-red-500">
              Finish Request
            </button>
          )}
        </div>
      ))}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default RequestList;
