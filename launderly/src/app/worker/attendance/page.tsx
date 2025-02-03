"use client";
import WorkerAttendance from "@/components/feat-3/attendance/attendance";
import Table from "@/components/feat-3/attendance/attendanceTable";
import DefaultLoading from "@/components/feat-3/defaultLoading";
import NotFound from "@/components/feat-3/notFound";
import Pagination from "@/components/feat-3/paginationButton";
import SortButton from "@/components/feat-3/sortingButton";
import Sidebar from "@/components/feat-3/worker/sidebar";
import { IApiResponse, IAttendance } from "@/types/attendance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Attendance() {
  const userId = 3;
  const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    workHour: "asc",
  });

  const getData = async (page: number, sortBy: string, order: "asc" | "desc") => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/attendance/history/${userId}?page=${page}?&sortBy=${sortBy}&order=${order}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result: IApiResponse = await res.json();
      setAttendanceData(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.page);
    } catch (err) {
      toast.error("Fetch failed: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (sortBy: string, newOrder: "asc" | "desc") => {
    setSortBy(sortBy);
    setOrder((prevOrder) => ({
      ...prevOrder,
      [sortBy]: prevOrder[sortBy] === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getData(currentPage, sortBy, order[sortBy]);
  }, [currentPage, sortBy, order[sortBy]]);

  return (
    <div className="flex bg-white min-h-screen py-3">
      <Sidebar />
      <div className="ml-28 mt-10">
        <div className="w-[85vw] flex justify-end mx-10 my-5">
          <WorkerAttendance name="Username" role="Worker" id={userId} profile="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        </div>
        <div className="flex flex-col gap-2 lg:flex-row justify-between mx-10">
          <h1 className="text-blue-500 text-2xl font-bold">Your Attendance Log: </h1>
          <div className="flex gap-2">
            <SortButton sortBy="workHour" order={order.workHour} onSort={handleSort} />
            <SortButton sortBy="createdAt" order={order.createdAt} onSort={handleSort} />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">
            <DefaultLoading />
          </div>
        ) : attendanceData.length === 0 ? (
          <div className="flex justify-center items-center">
            <NotFound text="No attendance data found." />
          </div>
        ) : (
          <div className="mx-10">
            {attendanceData.map((data: IAttendance, index: number) => (
              <Table key={index} date={data.createdAt} checkIn={new Date(data.checkIn)} checkOut={new Date(data.checkOut)} workHour={data.workHour} />
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
