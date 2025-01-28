"use client";
import WorkerAttendance from "@/components/feat-3/attendance/attendance";
import Table from "@/components/feat-3/attendance/attendanceTable";
import Pagination from "@/components/feat-3/paginationButton";
import Sidebar from "@/components/feat-3/sidebar";
import SortButton from "@/components/feat-3/sortingButton";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AttendanceData {
  checkIn: string;
  checkOut: string;
  workHour: number;
  createdAt: string;
}

interface ApiResponse {
  data: AttendanceData[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export default function Attendance() {
  const userId = 3;
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    workHour: "desc",
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
      const result: ApiResponse = await res.json();
      console.log("Data received:", result);
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
    setOrder((prevOrder) => ({
      ...prevOrder,
      [sortBy]: newOrder,
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getData(currentPage, sortBy, order.createdAt || order.workHour);
  }, [currentPage, sortBy, order]);

  return (
    <div className="flex bg-white ">
      <Sidebar />
      <div className="ml-28 mt-10">
        <div className="w-[85vw] flex justify-end mx-10 my-5">
          <WorkerAttendance name="John Doe" role="Driver" id={userId} profile="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        </div>
        <div className="flex flex-col gap-2 lg:flex-row justify-between mx-10">
          <h1 className="text-blue-500 text-2xl font-bold">Your Attendance Log: </h1>
          <div className="flex gap-2">
            <SortButton sortBy="workHour" order={order.workHour} onSort={handleSort} />
            <SortButton sortBy="createdAt" order={order.createdAt} onSort={handleSort} />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20">Loading...</div>
        ) : attendanceData.length === 0 ? (
          <div className="flex justify-center items-center text-3xl font-bold my-20 text-red-500">No attendance data found.</div>
        ) : (
          <div className="mx-10">
            {attendanceData.map((data: AttendanceData, index: number) => (
              <Table key={index} date={data.createdAt} checkIn={new Date(data.checkIn)} checkOut={new Date(data.checkOut)} workHour={data.workHour} />
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
