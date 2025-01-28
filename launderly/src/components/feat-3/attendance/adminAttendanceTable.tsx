"use client"
import { formatTime } from "@/helpers/timeFormatter";
import Pagination from "../paginationButton";
import { useState } from "react";

interface IAttendanceTable {
    date: string;
    workHour: number;
    checkIn: Date;
    checkOut: Date;
    id: number;
    username: string
}
export default function AttendanceTable({date, workHour, checkIn, checkOut, id, username}: IAttendanceTable) {
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
    
    return(
        <div>
          <table className="table-fixed">
  <thead>
    <tr>
      <th>Date</th>
      <th>Id</th>
      <th>Name</th>
      <th>Check In</th>
      <th>Check Out</th>
      <th>Total Work Hour</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{date}</td>
    </tr>
    <tr>
      <td>{id}</td>
    </tr>
    <tr>
      <td>{username}</td>
    </tr>
    <tr>
      <td>{workHour}</td>
    </tr>
    <tr>
      <td>{formatTime(checkIn)}</td>
    </tr>
    <tr>
      <td>{formatTime(checkOut)}</td>
    </tr>
  </tbody>
</table>
 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    )
}