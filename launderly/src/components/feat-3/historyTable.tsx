"use client";
import { div } from "framer-motion/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SortButton from "./sortingButton";
import NotFound from "./notFound";
import Pagination from "./paginationButton";
import { useToken } from "@/hooks/useToken";

interface Column {
  key: string;
  label: string;
}

interface Props<T> {
  columns: Column[];
  fetchUrl: string;
  sortOptions: { [key: string]: "asc" | "desc" };
  dataMapper: (item: T) => any[];
  filterKey?: string;
}

export default function HistoryTable<T>({ columns, fetchUrl, sortOptions, dataMapper, filterKey }: Props<T>) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState(columns[0].key);
  const [order, setOrder] = useState(sortOptions);
  const [filterValue, setFilterValue] = useState("");
  const token = useToken();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: currentPage.toString(),
        sortBy,
        order: order[sortBy],
      });

      if (filterValue && filterKey) {
        query.append(filterKey, filterValue);
      }

      const res = await fetch(`${fetchUrl}?${query.toString()}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      setData(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.page);
    } catch (err) {
      toast.error("Fetch failed: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [sortBy, order, currentPage, filterValue]);

  return (
    <div className="flex flex-col justify-center w-screen lg:w-[1000px] overflow-x-auto">
      {filterKey && (
        <div className="flex justify-start mb-3">
          <input type="text" placeholder={`Filter by ${filterKey}`} value={filterValue} onChange={(e) => setFilterValue(e.target.value)} className="border p-2 rounded-md w-64" />
        </div>
      )}

      <div className="flex justify-end gap-3">
        {columns.map((col) => (
          <SortButton key={col.key} sortBy={col.key} label={`Sort By ${col.label}`} order={order[col.key]} onSort={setSortBy} />
        ))}
      </div>

      {/* Table */}
      <div className="w-full bg-blue-200 rounded-md my-5 mx-10 lg:mx-0 overflow-visible">
        <table className="table w-full rounded-md text-lg">
          <thead className="border border-b-blue-600 text-center">
            <tr className="border border-b-white text-blue-600 bg-blue-400 text-lg">
              {columns.map((col) => (
                <th key={col.key} className="p-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border border-white text-center text-neutral-800">
            {data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} className="border border-collapse-white">
                  {dataMapper(item).map((value, index) => (
                    <td key={index} className="p-3">
                      {value}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  <NotFound text="No History data found." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
