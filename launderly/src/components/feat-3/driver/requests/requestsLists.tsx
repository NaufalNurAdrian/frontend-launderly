"use client";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import Pagination from "../../paginationButton";
import { IApiResponse, IRequest } from "@/types/request";
import { toast } from "react-toastify";
import DefaultLoading from "../../defaultLoading";
import NotFound from "../../notFound";
import { calculateTimeDifference } from "@/helpers/timeCounter";
import SortButton from "../../sortingButton";
import DeliveryButton from "../process/deliveryButton";
import PickupButton from "../process/pickupButton";

interface IList {
  type: string;
  driverId: number;
}

export default function RequestList({ type, driverId }: IList) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    distance: "asc",
  });

  const fetchRequests = async (page: number, sortBy: string, order: "asc" | "desc") => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/${type}/?driverId=${driverId}&page=${page}&sortBy=${sortBy}&order=${order}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
  }, [sortBy, order, currentPage, type, driverId]);

  const handleSuccess = () => {
    fetchRequests(currentPage, sortBy, order[sortBy]);
  };
  return (
    <div className="lg:w-[500px] rounded-xl bg-white shadow-md py-3 px-8 min-h-[30rem] flex flex-col items-center">
      <div className="lg:w-[400px]">
        <h2 className="text-2xl font-bold text-blue-500 mb-1 my-2">{type === "pickup" ? "Pick up" : "Delivery"} Requests</h2>
        <div className="flex justify-between gap-3 mb-2">
          <SortButton sortBy="distance" order={order.distance} onSort={handleSort} />
          <SortButton sortBy="createdAt" order={order.createdAt} onSort={handleSort} />
        </div>
      </div>
      <div className=" grid grid-rows-auto">
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
              <div key={request.id} className="bg-blue-400/30 mb-2 pb-3 lg:w-[400px] px-10 py-3 rounded-xl border border-blue-600">
                <p className="text-blue-500 font-bold text-xl">{request.user.fullName || "Unknown User"}</p>
                {type === "delivery" ? (
                  <div>
                    <p className="text-blue-600 text-md">{request.deliveryNumber}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-blue-600 text-md"> {request.pickupNumber}</p>
                  </div>
                )}
                <p className="text-sm text-gray-500">Requested {calculateTimeDifference(request.createdAt)}</p>
                <div className="flex items-center">
                  <MapPin size={20} className=" text-blue-500" />
                  {request.address.addressLine || "Unknown Address"}
                </div>
                <p className="text-sm text-gray-500 mb-1 mx-4">{Math.round(request.distance * 10) / 10} km from outlet</p>
                {request.type === "delivery" ? (
                  <div>
                    <DeliveryButton driverId={driverId} requestId={request.id} onSuccess={handleSuccess} status={request.deliveryStatus!}/>
                  </div>
                ) : (
                  <div>
                    <PickupButton driverId={driverId} requestId={request.id} onSuccess={handleSuccess} status={request.pickupStatus!}/>
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
