"use client";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Irequest {
  type: string;
  // fetchUrl: string
}

interface Request {
  id: number;
  type: string; // Jenis request (pickup/delivery)
  status: "pending" | "in-progress" | "completed";
}

const RequestList = ({ type }: Irequest) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;
  const [requests, setRequests] = useState<Request[]>([
    { id: 1, type: "Pickup", status: "pending" },
    { id: 2, type: "Delivery", status: "pending" },
  ]); // Simpan list requests
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleButtonClick = (requestId: number, currentStatus: string) => {
    if (currentStatus === "pending") {
      // Ubah status jadi in-progress
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: "in-progress" } : req
        )
      );
      setCurrentRequestId(requestId); // Tandai request yang sedang diproses
    } else if (currentStatus === "in-progress") {
      // Ubah status jadi completed
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: "completed" } : req
        )
      );
      setCurrentRequestId(null); // Reset current request
    }
  };
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  // const handleTakeRequest = async (request: Request) => {
  // setCurrentRequest({ ...request, status: 'in-progress' });

  // // Update status in database atau server
  // const response = await fetch(`/api/requests/${request.id}/take`, {
  //   method: 'POST',
  //   body: JSON.stringify({ status: 'in-progress' }),
  // });

  //   if (response.ok) {
  //     toast.success('Request is now in progress');
  //   } else {
  //     toast.error('Failed to take request');
  //   }
  // };

  // const handleFinishRequest = async () => {
  //   if (currentRequest) {
  //     const response = await fetch(`/api/requests/${currentRequest.id}/finish`, {
  //       method: 'POST',
  //       body: JSON.stringify({ status: 'completed' }),
  //     });

  //     if (response.ok) {
  //       setCurrentRequest(null); // Reset current request
  //       toast.success('Request finished');
  //     } else {
  //       toast.error('Failed to finish request');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(fetchUrl);
  //       const data = await response.json();
  //       setRequests(data);
  //       toast.custom('There`s new request !')
  //     } catch (error) {
  //       console.error("Error fetching requests:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [fetchUrl]);

  // if (loading) return <p>Loading {type} requests...</p>;

  return (
    <div className="w-[500px] rounded-xl bg-neutral-100 border-blue-300 border py-3 px-8 grid grid-rows-auto min-h-[20rem] justify-center ">
      <h2 className="text-xl font-bold text-blue-500">{type} Requests</h2>
      {requests.map((request) => (
      <div className="w-[450px] my-3 p-2 flex flex-col rounded-xl bg-white shadow-md">
        <div className="px-2 pb-3">
          <p className="text-blue-500 font-bold text-xl">Username</p>
          <p className="text-sm text-gray-500">requested since 08.10</p>
          <br />
        </div>
        <button
          onClick={() => handleButtonClick(request.id, request.status)}
          disabled={
            currentRequestId !== null && currentRequestId !== request.id
          } // Nonaktifkan tombol lain jika ada yang sedang diproses
          className={`px-4 py-2 mx-8 rounded-lg bg-blue-500 hover:bg-blue-400 text-white`}
        >
            Take Request
        </button>
      </div>
      ))}
      <div className="flex justify-center mt-4">
        <button className="px-3 h-[40px] bg-gray-200 rounded" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          <ChevronLeft />
        </button>
        <button className="px-3 h-[40px] bg-gray-200 rounded ml-2" onClick={() => setCurrentPage(currentPage + 1)}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default RequestList;
