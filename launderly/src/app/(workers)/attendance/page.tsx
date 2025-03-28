"use client";
import WorkerAttendance from "@/components/feat-3/attendance/attendance";
import Table from "@/components/feat-3/attendance/attendanceTable";
import DefaultLoading from "@/components/feat-3/defaultLoading";
import NotFound from "@/components/feat-3/notFound";
import Pagination from "@/components/feat-3/paginationButton";
import SortButton from "@/components/feat-3/sortingButton";
import { IApiResponse, IAttendance } from "@/types/attendance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/feat-3/navbar";
import { useToken } from "@/hooks/useToken";
import WorkerSidebar from "@/components/feat-3/workerSidebar";
import ProtectedPage from "@/hoc/protectedRoutes";
import { fetchAttendanceHistory } from "@/app/api/attendance";

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    workHour: "asc",
  });
  const token = useToken();

  const getData = async (page: number, sortBy: string, order: "asc" | "desc") => {
    if (!token) return;
    try {
      const result: IApiResponse = await fetchAttendanceHistory(token, page, sortBy, order);

      setAttendanceData(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.page);
    } catch (err: any) {
      toast.error("Fetch failed: " + err.message);
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
    if (token) {
      getData(currentPage, sortBy, order[sortBy]);
    }
  }, [token, currentPage, sortBy, order[sortBy]]);
  return (
    <ProtectedPage allowedRoles={["DRIVER", "WORKER"]}>
      <div className="flex bg-white min-h-screen lg:py-3">
        <div>
          <span className="hidden lg:block">
            <WorkerSidebar />
          </span>
          <span className="max-md:block lg:hidden">
            <Navbar />
          </span>
        </div>
        <div className="flex w-full flex-col items-center lg:mt-10">
          <div className=" flex justify-end mx-10 my-5">
            <WorkerAttendance token={token!} />
          </div>
          <div className="flex  flex-col max-md:gap-2 lg:gap-5 lg:flex-row justify-between mx-10">
            <h1 className="text-blue-500 text-2xl font-bold">Your Attendance Log: </h1>
            <div className="flex gap-2">
              <SortButton sortBy="workHour" label="Sort By Work Hour" order={order.workHour} onSort={handleSort} />
              <SortButton sortBy="createdAt" label="Sort By Date" order={order.createdAt} onSort={handleSort} />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center text-3xl font-bold my-20">
              <DefaultLoading />
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="flex justify-center items-center my-10 max-sm:my-20 max-sm:mx-5">
              <NotFound text="No attendance data found." />
            </div>
          ) : (
            <div className="w-full lg:px-10 px-5 max-sm:mb-5">
              {attendanceData.map((data: IAttendance, index: number) => (
                <Table key={index} date={data.createdAt} checkIn={new Date(data.checkIn)} checkOut={data.checkOut == null ? null : new Date(data.checkOut)} workHour={data.workHour} />
              ))}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
