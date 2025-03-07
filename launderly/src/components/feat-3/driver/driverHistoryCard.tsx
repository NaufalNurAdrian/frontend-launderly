"use client";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import SortButton from "../sortingButton";
import { useEffect, useState } from "react";
import { IRequest } from "@/types/driver";
import toast from "react-hot-toast";
import Pagination from "../paginationButton";
import NotFound from "../notFound";
import DefaultLoading from "../defaultLoading";
import FilterTabs from "../filterTab";
import { useToken } from "@/hooks/useToken";
import { getDriverHistory } from "@/app/api/driver";

function roundDistance(distance: number): number {
  return Math.round(distance * 10) / 10;
}

export default function MobileHistoryTable() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    distance: "asc",
  });
  const [filter, setFilter] = useState<string>("");
  const token = useToken();

  const fetchRequests = async (
    page: number,
    sortBy: string,
    order: "asc" | "desc",
    filter: string
  ) => {
    if (!token) return;
    try {
      const pageSize = 5;
      setLoading(true);
      const result = await getDriverHistory(
        token,
        page,
        sortBy,
        order,
        filter,
        pageSize
      );
      setRequests(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.page);
    } catch (err) {
      toast.error(
        "Fetch failed: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);
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
    if (token) {
      fetchRequests(currentPage, sortBy, order[sortBy], filter);
    }
  }, [sortBy, order, currentPage, filter, token]);

  if (loading) {
    return (
      <div className="text-center items-center py-5">
        <DefaultLoading />
      </div>
    );
  }

  return (
    <div className="p-4 mb-10 bg-white mx-3 rounded-lg shadow-md">
      <div className="flex flex-col gap-3 mb-4">
        <span className="flex justify-between gap-3 mx-1">
          <SortButton
            sortBy="distance"
            label="Sort By Distance"
            order={order.distance}
            onSort={handleSort}
          />
          <SortButton
            sortBy="createdAt"
            label="Sort By Date"
            order={order.createdAt}
            onSort={handleSort}
          />
        </span>
        <FilterTabs
          onFilterChange={handleFilterChange}
          option1="pickup"
          option2="delivery"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">
            <DefaultLoading />
          </div>
        ) : requests.length === 0 && !loading ? (
          <div className="flex justify-center bg-white shadow-md rounded-lg  py-10 items-center my-5">
            <NotFound text={`No history data found.`} />
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.deliveryNumber}
              className="flex w-full justify-between h-[100px] border-2 bg-white p-4 py-2 rounded-lg shadow-sm"
            >
              <div className="flex flex-col">
                <p className="text-sm text-blue-600 bg-blue-300 px-2 rounded-full">
                  {formatDate(request.updatedAt)} :{" "}
                  {formatTime(new Date(request.updatedAt))}
                </p>
                <div className="mt-1">
                  {request.type == "delivery" ? (
                    <h1 className="text-lg text-blue-500 font-bold">
                      {request.deliveryNumber}
                    </h1>
                  ) : (
                    <h1 className="text-lg text-blue-500 font-bold">
                      {request.pickupNumber}
                    </h1>
                  )}
                  <h1 className="text-sm">
                    {roundDistance(request.distance)} km from outlet
                  </h1>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center">
                <h1 className="font-semibold text-sm">{request.type}</h1>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
