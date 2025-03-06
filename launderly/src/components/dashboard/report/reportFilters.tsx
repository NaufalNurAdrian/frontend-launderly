import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/helpers/datePickerWithRange";
import { DateRange, ReportTimeframe } from "@/types/report.types";

interface ReportFiltersProps {
  timeframe: ReportTimeframe;
  outletId: number | undefined;
  dateRange: DateRange | undefined;
  outletsResponse: any;
  onTimeframeChange: (value: string) => void;
  onOutletChange: (value: string) => void;
  onDateRangeChange: (range: { from: Date; to: Date } | undefined) => void;
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
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
      <h2 className="text-lg font-medium mb-4 text-gray-700">Report Filters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Outlet</label>
          <Select
            value={outletId?.toString() || "all"}
            onValueChange={onOutletChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              {outletsResponse?.outlets.map((outlet: any) => (
                <SelectItem key={outlet.id} value={outlet.id.toString()}>
                  {outlet.outletName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Time Period</label>
          <Select value={timeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <DatePickerWithRange
            value={dateRange}
            onChange={onDateRangeChange}
            disabled={timeframe !== "custom"}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;