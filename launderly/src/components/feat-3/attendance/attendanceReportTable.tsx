"use client";
import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SortButton from "../sortingButton";
import Pagination from "../paginationButton";
import { IApiResponse, IAttendance } from "@/types/attendance";
import { fetchAllAttendanceHistory } from "@/app/api/attendance";
import { useToken } from "@/hooks/useToken";
import NotFound from "../notFound";
import FilterDropdown from "../filterButton";
import FilterTabs from "../filterTab";
import useSession from "@/hooks/useSession";
import { IUser } from "@/types/user";

export default function AttendanceReportTableForOutlet() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<IAttendance[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [filter, setFilter] = useState<string>("");
  const [order, setOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    createdAt: "desc",
    workHour: "asc",
  });
  const token = useToken();
  const { user } = useSession();
  const admin = user as IUser;

  const fetchReport = async (
    page: number,
    sortBy: string,
    order: "asc" | "desc",
    filter: string
  ) => {
    if (!token) return;
    try {
      const outletId = admin.employee.outletId;
      setLoading(true);
      const result: IApiResponse = await fetchAllAttendanceHistory(
        token,
        page,
        sortBy,
        order,
        filter,
        outletId
      );
      setReport(result.data);
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
      fetchReport(currentPage, sortBy, order[sortBy], filter);
    }
  }, [sortBy, order, currentPage, token, filter]);

  return (
    <div className="flex flex-col justify-center z-0 bg-white shadow-md w-full lg:w-[1200px] rounded-lg p-5 my-4">
      <div className="flex max-sm:flex-col justify-end gap-3 mb-4">
        <span className="flex gap-3 justify-center">
          <SortButton
            sortBy="createdAt"
            label="Sort By Date"
            order={order.createdAt}
            onSort={handleSort}
          />
          <SortButton
            sortBy="workHour"
            label="Sort By Work Hour"
            order={order.workHour}
            onSort={handleSort}
          />
        </span>
        <span className="lg:flex hidden">
          <FilterDropdown
            onFilterChange={handleFilterChange}
            option1="WORKER"
            option2="DRIVER"
          />
        </span>
        <span className="lg:hidden flex">
          <FilterTabs
            onFilterChange={handleFilterChange}
            option1="WORKER"
            option2="DRIVER"
          />
        </span>
      </div>
      <div className="w-full bg-white z-10 relative border border-blue-200 rounded-md  max-sm:overflow-auto">
        <table className="table-auto w-full text-sm text-blue-900">
          <thead className="text-center bg-[#BFDFFF] text-blue-900 font-medium">
            <tr className="text-blue-900 bg-blue-300">
              <th className="py-2 px-4 border-b border-blue-300">
                Employee Name
              </th>
              <th className="py-2 px-4 border-b border-blue-300">Date</th>
              <th className="py-2 px-4 border-b border-blue-300">
                Clock in time
              </th>
              <th className="py-2 px-4 border-b border-blue-300">
                Clock in time
              </th>
              <th className="py-2 px-4 border-b border-blue-300">Workhour</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {report.length > 0 ? (
              report.map((report: IAttendance) => (
                <tr
                  key={report.id}
                  className="hover:bg-blue-50 transition-colors border-b border-blue-200"
                >
                  <td className="py-2 px-4">{report.user.fullName}</td>
                  <td className="py-2 px-4">{formatDate(report.createdAt)}</td>
                  <td className="py-2 px-4">
                    {formatTime(new Date(report.checkIn))}
                  </td>
                  <td className="py-2 px-4">
                    {formatTime(new Date(report.checkOut))}
                  </td>
                  <td className="py-2 px-4">{report.workHour}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5">
                  <div className="flex justify-center items-center">
                    <NotFound text="No history data found." />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
