"use client"
import { formatTime } from "@/helpers/timeFormatter";
import Pagination from "../paginationButton";
import { useState } from "react";

interface IHistoryTable {
    date: string;
    orderId: number;
    orderType: string    
}
export default function HistoryTable({date, orderId, orderType}: IHistoryTable) {
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
    
    return(
        <div className="flex flex-col justify-center w-full items-center">
          <table className="table-auto bg-blue-300">
  <thead>
    <tr>
      <th>Date</th>
      <th>Order Id</th>
      <th>Order Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{date}</td>
    </tr>
    <tr>
      <td>{orderId}</td>
    </tr>
    <tr>
      <td>{orderType}</td>
    </tr>
  </tbody>
</table>
 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    )
}