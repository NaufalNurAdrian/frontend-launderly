"use client";

import { useEffect, useState } from "react";
import { fetchAllOutlet } from "@/services/outletService";
import { OutletApiResponse } from "@/types/outlet.type";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { MdFilterAlt } from "react-icons/md";
import { GiWashingMachine } from "react-icons/gi";

interface HeaderReportFilterProps {
  setFilterOutlet: (value: string) => void;
  setFilterMonth: (value: string) => void;
  setFilterYear: (value: string) => void;
}

export default function HeaderReportFilter({
  setFilterOutlet,
  setFilterMonth,
  setFilterYear,
}: HeaderReportFilterProps) {
  const [outletData, setOutletData] = useState<OutletApiResponse>();
  const [localMonth, setLocalMonth] = useState<Date | undefined>(undefined);
  const [localYear, setLocalYear] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchOutletsData = async () => {
      try {
        const response = await fetchAllOutlet();
        setOutletData(response);
      } catch (error) {
        console.error("Failed to fetch outlets:", error);
      }
    };
    fetchOutletsData();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-blue-100/80 w-full border-b border-blue-300/50">
      <div className="flex items-center">
        <div className="flex items-center text-blue-600 gap-2 bg-white/80 px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
          <GiWashingMachine className="text-blue-600" size={20} />
          <h2 className="text-sm font-medium">Report Filters</h2>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-end">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-blue-700">Outlet:</label>
          <select
            className="border border-blue-200 p-2 rounded-lg text-sm bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:outline-none shadow-sm"
            onChange={(e) => setFilterOutlet(e.target.value)}
          >
            <option value="all">All Outlets</option>
            {outletData?.outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id.toString()}>
                {outlet.outletName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-blue-700">Month:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-32 text-sm text-left border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-400 shadow-sm rounded-lg">
                {localMonth ? format(localMonth, "MMMM") : "Select Month"}
                <CalendarIcon className="ml-auto h-4 w-4 text-blue-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-blue-200 shadow-md rounded-lg" align="start">
              <Calendar
                mode="single"
                selected={localMonth} 
                onSelect={(date) => {
                  if (date) {
                    setLocalMonth(date);
                    setFilterMonth((date.getMonth() + 1).toString());
                  }
                }}
                initialFocus
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-blue-700">Year:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-32 text-sm text-left border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-400 shadow-sm rounded-lg">
                {localYear ? format(localYear, "yyyy") : "Select Year"}
                <CalendarIcon className="ml-auto h-4 w-4 text-blue-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-blue-200 shadow-md rounded-lg" align="start">
              <Calendar
                mode="single"
                selected={localYear}
                onSelect={(date) => {
                  if (date) {
                    setLocalYear(date);
                    setFilterYear(date.getFullYear().toString());
                  }
                }}
                initialFocus
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}