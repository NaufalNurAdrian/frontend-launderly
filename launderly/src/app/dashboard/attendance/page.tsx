import AttendanceReportTableForOutlet from "@/components/feat-3/attendance/attendanceReportTable";

export default function AttendanceReportPage() {
  return (
    <div className="h-full w-full flex flex-col gap-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Outlet Transaction Analysis</h1>
      <AttendanceReportTableForOutlet />
    </div>
  );
}
