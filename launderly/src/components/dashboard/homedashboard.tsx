"use client"

import { getReportSales } from "@/services/reportService";
import { SalesReportApiResponse } from "@/types/reportSales.type";
import Image from "next/image";
import { useEffect, useState } from "react";

function HomeDashboard({
  filterOutlet,
  filterMonth,
  filterYear
}: {
  filterOutlet: string;
  filterMonth: string;
  filterYear: string;
}) {
  const [order, setOrder] = useState<SalesReportApiResponse>();

  useEffect(() => {
    const fetchOrder = async () => {
      const res: SalesReportApiResponse = await getReportSales(filterOutlet, filterMonth, filterYear);
      setOrder(res);
    }
    fetchOrder();
  }, [filterOutlet, filterMonth, filterYear]);

  return (
    <div className="p-5 space-y-5 w-full">
      {/* Top Section: Balance and Report */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Balance Card */}
        <div className="bg-white shadow-lg rounded-xl">
          <div className="flex bg-sky-400 rounded-t-xl p-3 text-lg sm:text-xl justify-between items-center">
            <div className="text-white font-semibold">BALANCE</div>
            <Image alt="balance" src="/Card Wallet.svg" width={30} height={30} />
          </div>
          <div className="p-5">
            <div className="text-2xl sm:text-4xl font-bold text-gray-800">
              Rp. {order?.result.result.totalIncome || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">0% This Week</div>
          </div>
        </div>

        {/* Report Card */}
        <div className="bg-white shadow-lg rounded-xl">
          <div className="flex bg-sky-400 rounded-t-xl p-3 text-lg sm:text-xl justify-between items-center">
            <div className="text-white font-semibold">REPORT</div>
            <Image alt="report" src="/Attendance.svg" width={30} height={30} />
          </div>
          <div className="p-5 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Total Order</span>
              <span>{order?.result.result.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Received</span>
              <span>{order?.result.result.receivedAtOutlet || 0}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>On Progress</span>
              <span>{order?.result.result.onProgress || 0}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Completed</span>
              <span>{order?.result.result.completed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default HomeDashboard;
