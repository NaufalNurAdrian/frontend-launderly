
"use client"
import WorkerAttendance from "@/components/feat-3/attendance/attendance";
import Table from "@/components/feat-3/attendance/attendanceTable";
import Sidebar from "@/components/feat-3/sidebar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AttendanceData {
    checkIn: string;
    checkOut: string;
    workHour: number;
    createdAt: string;
  }

export default function Attendance() {
    const userId = 3; 
    const [attendanceData, setAttendanceData] = useState<[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
          setLoading(true);
          const res = await fetch(`http://localhost:8000/api/attendance/history/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const result = await res.json();
          setAttendanceData(result.data); 
        } catch (err) {
          toast.error("Fetch failed: " + err);
        } finally {
          setLoading(false);
        }
      };
      useEffect(() => {
        getData();
      },[])
   
    return (
        <div className="flex bg-white w-screen">
            <Sidebar />

            <div className="ml-28 mt-10">
                <div className="w-[85vw] flex justify-end mx-10">
                    <WorkerAttendance
                        name="John Doe"
                        role="Worker"
                        id={userId}
                        profile="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    />
                </div>
                {attendanceData.length == 0 ? 
                    <div className="">
                        no Attendance log yet
                    </div>
                 :
                <div className="mx-10">
                {attendanceData.map((data: AttendanceData, index: number) => (
                    <Table
                    key={index}
                    date={data.createdAt}
                    checkIn={new Date(data.checkIn)}
                    checkOut={new Date(data.checkOut)}
                    workHour={data.workHour}
                    />
                ))}
                </div>
                }
            </div>
        </div>
    );
}