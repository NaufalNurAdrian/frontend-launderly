
"use client"
import { formatTime } from "@/helpers/timeFormatter";
import Pagination from "../paginationButton";
import { useState } from "react";

interface IAttendanceTable {
    date: string;
    fullname: string
    role: string;
    workHour: number;
    checkIn: Date;
    checkOut: Date;
    id: number;
}
export default function AttendanceTable({date, workHour, role, checkIn, checkOut, id, fullname}: IAttendanceTable) {
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
    
      return(
        <div>
         <div className="w-full bg-blue-300 my-5 ">
  <table className="table table-lg w-[1000px]">
    {/* head */}
    <thead className="border border-b-blue-600">
      <tr className="border border-b-white text-blue-600 bg-blue-400">
        <th>Id</th>
        <th>Date</th>
        <th>Name</th>
        <th>Role</th>
        <th>Check in</th>
        <th>Check out</th>
        <th>Work Hours</th>
      </tr>
    </thead>
    <tbody className="border border-white text-center">
      {/* row 1 */}
      <tr className="border border-collapse-white">
        <td className="p-5">{id}</td>
        <td>{date}</td>
        <td>{fullname}</td>
        <td>{formatTime(checkIn)}</td>
        <td>{formatTime(checkOut)}</td>
        <td>{workHour}</td>
      </tr>
    </tbody>
  </table>
</div>
 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    )
}
