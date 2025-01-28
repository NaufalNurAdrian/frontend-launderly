"use client"
import Pagination from "../paginationButton";
import { useState } from "react";

interface IHistoryTable {
    date: string;
    time: string;
    orderId: number;
    orderType: string    
}
export default function HistoryTable({date, time, orderId, orderType}: IHistoryTable) {
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
    
    return(
               <div>
                <div className="w-full bg-blue-300 my-5 ">
         <table className="table table-lg w-[700px] text-lg">
           {/* head */}
           <thead className="border border-b-blue-600">
             <tr className="border border-b-white text-blue-600 bg-blue-400 text-lg">
               <th>Id</th>
               <th>Date</th>
               <th>Time</th>
               <th>Type</th>
               </tr>
           </thead>
           <tbody className="border border-white text-center">
             {/* row 1 */}
             <tr className="border border-collapse-white">
               <td className="p-5">{orderId}</td>
               <td>{date}</td>
               <td>{time}</td>
               <td>{orderType}</td>
               </tr>
           </tbody>
         </table>
       </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
               </div>
    )
}