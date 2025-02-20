"use client";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import Pagination from "../paginationButton";
import { IApiResponse, IRequest } from "@/types/driver";
import { toast } from "react-hot-toast";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
import { calculateTimeDifference } from "@/helpers/timeCounter";
import SortButton from "../sortingButton";
import RequestButton from "./processButton";

interface IList {
  type: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function DriverRequestLists({ type }: IList) {
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
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token tidak ditemukan. Redirect ke halaman login...");
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/${type}/?page=${page}&sortBy=${sortBy}&order=${order}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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
            <NotFound text={`No ${type} Request found.`} />
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
                {type === "delivery" ? (
                  <div>
                    <RequestButton requestId={request.id} status={request.deliveryStatus!} onSuccess={handleSuccess} type="delivery" />
                  </div>
                ) : (
                  <div>
                    <RequestButton requestId={request.id} status={request.pickupStatus!} onSuccess={handleSuccess} type="pickup" />
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
