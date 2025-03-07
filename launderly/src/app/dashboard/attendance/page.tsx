import AttendanceReportTableForOutlet from "@/components/feat-3/attendance/attendanceReportTable";

export default function AttendanceReportPage() {
  return (
    <div className="min-h-screen w-full max-sm:min-w-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl md:text-3xl font-bold my-3 text-gray-800">Attendance Report</h1>
      <AttendanceReportTableForOutlet />
    </div>
  );
}
