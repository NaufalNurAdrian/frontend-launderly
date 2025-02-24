"use client";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
<<<<<<< HEAD:launderly/src/components/feat-3/driver/requests/requestsLists.tsx
import Pagination from "../../paginationButton";
import { IApiResponse, IRequest } from "@/types/driver";
import { toast } from "react-hot-toast";
import DefaultLoading from "../../defaultLoading";
import NotFound from "../../notFound";
=======
import Pagination from "../paginationButton";
import { IApiResponse, IRequest } from "@/types/driver";
import { toast } from "react-hot-toast";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/requestsLists.tsx
import { calculateTimeDifference } from "@/helpers/timeCounter";
import SortButton from "../sortingButton";
import RequestButton from "./processButton";

interface IList {
  type: string;
}
<<<<<<< HEAD:launderly/src/components/feat-3/driver/requests/requestsLists.tsx
export default function RequestList({ type}: IList) {
=======

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function DriverRequestLists({ type }: IList) {
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/requestsLists.tsx
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    distance: "asc",
  });

  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc") => {
<<<<<<< HEAD:launderly/src/components/feat-3/driver/requests/requestsLists.tsx

=======
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/requestsLists.tsx
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token tidak ditemukan. Redirect ke halaman login...");
      window.location.href = "/login";
      return;
<<<<<<< HEAD:launderly/src/components/feat-3/driver/requests/requestsLists.tsx
    } 

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/${type}/?page=${page}&sortBy=${sortBy}&order=${order}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },

=======
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/${type}/?page=${page}&sortBy=${sortBy}&order=${order}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/requestsLists.tsx
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
  }, [sortBy, order, currentPage, type]);

  const handleSuccess = () => {
    fetchRequests(currentPage, sortBy, order[sortBy]);
  };
  return (
<<<<<<< HEAD:launderly/src/components/feat-3/driver/requests/requestsLists.tsx
    <div className="lg:w-[500px] rounded-xl bg-white shadow-md py-3 px-8 min-h-[30rem] flex flex-col items-center">
      <div className="lg:w-[400px] ">
        <h2 className="text-2xl font-bold text-blue-500 mb-1 my-2">{type === "pickup" ? "Pick up" : "Delivery"} Requests</h2>
=======
    <div className=" max-w-[500px] max-sm:mr-8 mb-20 lg:max-w-[700px] rounded-xl bg-white shadow-md py-3 px-4 lg:px-8 min-h-[30rem] flex flex-col items-center">
      <div className=" max-w-[500px]">
        <h2 className="text-xl lg:text-2xl font-bold text-blue-500 mb-2 my-2">{type === "pickup" ? "Pick up" : "Delivery"} Requests</h2>
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/requestsLists.tsx
        <div className="flex justify-between gap-3 mb-2">
          <SortButton sortBy="distance" label="Sort by Distance" order={order.distance} onSort={handleSort} />
          <SortButton sortBy="createdAt" label="Sort by Date" order={order.createdAt} onSort={handleSort} />
        </div>
      </div>
<<<<<<< HEAD:launderly/src/components/feat-3/driver/requests/requestsLists.tsx
      <div className=" grid grid-rows-auto w-max justify-center">

=======
      <div className="grid grid-cols-1 gap-4 w-full">
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/requestsLists.tsx
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">
            <DefaultLoading />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex justify-center items-center my-5">
            <NotFound text={`No ${type} Request found.`} />
          </div>
        ) : (
          <div>
            {requests.map((request: IRequest) => (
<<<<<<< HEAD:launderly/src/components/feat-3/driver/requests/requestsLists.tsx
              <div key={request.id} className="bg-blue-400/30 mb-2 lg:w-[400px] w-[330px] px-8 lg:px-10 py-3 rounded-xl border border-blue-600">
                <p className="text-blue-500 font-bold text-xl">{request.user.fullName || "Unknown User"}</p>
=======
              <div key={request.id} className="bg-blue-400/30 mb-2 px-4 py-3 rounded-xl border border-blue-600">
                <p className="text-blue-500 font-bold text-md sm:text-lg">{request.user.fullName || "Unknown User"}</p>
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/requestsLists.tsx
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
<<<<<<< HEAD:launderly/src/components/feat-3/driver/requests/requestsLists.tsx
                <p className="text-sm text-gray-500 mb-1 mx-4">{Math.round(request.distance * 10) / 10} km from outlet</p>
                {type === "delivery" ? (
                  <div>
                    <DeliveryButton requestId={request.id} onSuccess={handleSuccess} status={request.deliveryStatus!} />
                  </div>
                ) : (
                  <div>
                    <PickupButton requestId={request.id} onSuccess={handleSuccess} status={request.pickupStatus!} />
=======
                <p className="text-xs sm:text-sm text-gray-500 mb-1 mx-4">{Math.round(request.distance * 10) / 10} km from outlet</p>
                {type === "delivery" ? (
                  <div>
                    <RequestButton requestId={request.id} status={request.deliveryStatus!} onSuccess={handleSuccess} type="delivery" />
                  </div>
                ) : (
                  <div>
                    <RequestButton requestId={request.id} status={request.pickupStatus!} onSuccess={handleSuccess} type="pickup" />
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3:launderly/src/components/feat-3/driver/requestsLists.tsx
                  </div>
                )}
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
