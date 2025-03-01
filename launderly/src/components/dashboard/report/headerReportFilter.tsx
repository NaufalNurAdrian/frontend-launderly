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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-zinc-200 w-full rounded-r-3xl mr-5 shadow-xl">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Outlet:</label>
        <select
          className="border p-2 rounded-md text-sm"
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

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Month:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-32 text-sm text-left">
                {localMonth ? format(localMonth, "MMMM") : "Select Month"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Year:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-32 text-sm text-left">
                {localYear ? format(localYear, "yyyy") : "Select Year"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localYear} // localYear bertipe Date | undefined
                onSelect={(date) => {
                  if (date) {
                    setLocalYear(date);
                    setFilterYear(date.getFullYear().toString());
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

    </div>
  );
}
