"use client";
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState, useEffect, useCallback } from "react";
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
import { toast } from "react-toastify";
import { calculateTimeDifference } from "@/helpers/timeCounter";
import SortButton from "../sortingButton";
import DefaultLoading from "../defaultLoading";
import NotFound from "../notFound";
import Pagination from "../paginationButton";
import { Shirt } from "lucide-react";
import { IApiResponse, IOrder } from "@/types/worker";
import ProcessOrderButton from "./processOrderButton";
<<<<<<< HEAD

interface IList {
  workerId: number;
}

export default function RequestList({ workerId }: IList) {
=======
import { useToken } from "@/hooks/useToken";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function WorkerRequestLists() {
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
<<<<<<< HEAD
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
=======
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
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3

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
<<<<<<< HEAD
  }, [sortBy, order, currentPage, workerId]);

  const handleSuccess = () => {
    fetchRequests(currentPage, sortBy, order[sortBy]);
  };
  return (
    <div className="lg:w-[800px] rounded-xl bg-white shadow-md py-3 px-8 min-h-[30rem] flex flex-col items-center">
      <div className="lg:w-[700px]">
        <h2 className="text-2xl font-bold text-blue-500 mb-1 my-2">Order Requests</h2>
=======
  }, [sortBy, order, currentPage, fetchRequests]);

  return (
    <div className="max-w-[500px] mb-5 lg:w-[800px] rounded-xl bg-white shadow-md py-3 px-4 lg:px-8 min-h-[30rem] flex flex-col items-center ">
      <div className="max-w-[500px] lg:flex lg:flex-col lg:w-[600px] lg:px-10">
        <h2 className="text-xl lg:text-2xl font-bold text-blue-500 mb-2 my-2 text-center lg:text-left">Order Requests</h2>

>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
        <div className="flex justify-between gap-3 mb-2">
          <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
          <SortButton sortBy="weight" label="Sort By Weight" order={order.weight} onSort={handleSort} />
        </div>
      </div>
<<<<<<< HEAD
      <div className=" grid grid-rows-auto w-full justify-center">
=======
      <div className="grid grid-cols-1 gap-4 w-full">
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">
            <DefaultLoading />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex justify-center items-center my-5">
<<<<<<< HEAD
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
=======
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
                <div className="lg:mt-3 mt-1">
                  <ProcessOrderButton orderId={request.id} />
                </div>
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
              </div>
            ))}
          </div>
        )}
      </div>
<<<<<<< HEAD
      <div className="mt-auto">
=======

      <div className=" w-full flex justify-center mt-auto">
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
