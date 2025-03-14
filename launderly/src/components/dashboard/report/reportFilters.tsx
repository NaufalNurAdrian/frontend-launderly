import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/helpers/datePickerWithRange";
import { DateRange } from "@/types/report.types";
import { ReportTimeframe } from "@/types/reportSales.type";
import { useRole } from "@/hooks/useRole";
import { Card, CardContent } from "@/components/ui/card";

interface ReportFiltersProps {
  timeframe: ReportTimeframe;
  outletId: number | undefined;
  dateRange: DateRange | undefined;
  outletsResponse: any;
  onTimeframeChange: (value: ReportTimeframe) => void;
  onOutletChange: (value: string) => void;
  onDateRangeChange: (range: { from: Date; to: Date } | undefined) => void;
  role?: string | null;
}
const ReportFilters: React.FC<ReportFiltersProps> = ({
  timeframe,
  outletId,
  dateRange,
  outletsResponse,
  onTimeframeChange,
  onOutletChange,
  onDateRangeChange,
}) => {
  const role = useRole();
  const isSuperAdmin = role === "SUPER_ADMIN";

  // Local state to track if date range is ready to be applied
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(
    dateRange
  );
  const [isDirty, setIsDirty] = useState(false);

  // Use ref to track previous props for comparison
  const prevPropsRef = useRef({ timeframe, dateRange });

  // Sync with parent component's dateRange when it changes from outside
  useEffect(() => {
    // Only update local state if parent dateRange changed and we're not in the middle of editing
    if (
      !isDirty &&
      JSON.stringify(dateRange) !==
        JSON.stringify(prevPropsRef.current.dateRange)
    ) {
      setLocalDateRange(dateRange);
    }

    // Reset dirty state when timeframe changes from outside
    if (timeframe !== prevPropsRef.current.timeframe) {
      setIsDirty(false);

      // If changing from "custom" to another timeframe, clear local date range
      if (
        prevPropsRef.current.timeframe === "custom" &&
        timeframe !== "custom"
      ) {
        setLocalDateRange(undefined);
      }
    }

    // Update ref with current props
    prevPropsRef.current = { timeframe, dateRange };
  }, [timeframe, dateRange, isDirty]);

  // Handle date range changes
  const handleDateRangeChange = (
    range: { from: Date; to: Date } | undefined
  ) => {
    console.log("Date range picker change:", range);

    // Set local state immediately
    setLocalDateRange(range);

    // Only propagate changes to parent when we have a complete range or clearing the range
    if (range === undefined || (range.from && range.to)) {
      console.log("Propagating date range to parent:", range);

      if (range) {
        // Format date range consistently
        const fromDate = new Date(range.from);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(range.to);
        toDate.setHours(23, 59, 59, 999);

        // Ensure dates are properly serialized and not losing timezone info
        const formattedRange = {
          from: fromDate,
          to: toDate,
        };

        console.log("Formatted date range:", {
          from: formattedRange.from.toISOString(),
          to: formattedRange.to.toISOString()
        });

        onDateRangeChange(formattedRange);
      } else {
        onDateRangeChange(undefined);
      }
      setIsDirty(false);
    } else {
      setIsDirty(true);
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm mb-6 transition-all hover:shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-gray-200 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">
          Report Filters
        </span>
      </div>

      <CardContent className="p-4">
        <div
          className={`grid gap-4 ${
            isSuperAdmin ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {isSuperAdmin && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Outlet
              </label>
              <Select
                value={outletId?.toString() || "all"}
                onValueChange={onOutletChange}
              >
                <SelectTrigger className="w-full h-9 text-sm bg-white border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                  <SelectValue placeholder="Select outlet" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all" className="hover:bg-blue-50">
                    All Outlets
                  </SelectItem>
                  {outletsResponse?.outlets.map((outlet: any) => (
                    <SelectItem
                      key={outlet.id}
                      value={outlet.id.toString()}
                      className="hover:bg-blue-50"
                    >
                      {outlet.outletName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">
              Time Period
            </label>
            <Select value={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger className="w-full h-9 text-sm bg-white border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily" className="hover:bg-blue-50">
                  Daily
                </SelectItem>
                <SelectItem value="weekly" className="hover:bg-blue-50">
                  Weekly
                </SelectItem>
                <SelectItem value="monthly" className="hover:bg-blue-50">
                  Monthly
                </SelectItem>
                <SelectItem value="yearly" className="hover:bg-blue-50">
                  Yearly
                </SelectItem>
                <SelectItem value="custom" className="hover:bg-blue-50">
                  Custom Range
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">
              Date Range
            </label>
            <DatePickerWithRange
              value={localDateRange}
              onChange={handleDateRangeChange}
              disabled={timeframe !== "custom"}
              className={`w-full h-9 ${
                timeframe !== "custom" ? "opacity-70" : ""
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;