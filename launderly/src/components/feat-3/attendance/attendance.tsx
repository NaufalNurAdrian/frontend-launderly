"use client"
import formatDate from "@/helpers/dateFormatter";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface IProfile{
    id: number;
    name: string;
    role: string;
    profile: string
}
export default function WorkerAttendance( {id, name, role, profile}: IProfile ) {
    const [attendanceStatus, setAttendanceStatus] = useState<"ACTIVE" | "INACTIVE">("INACTIVE");
    const data = { userId : 3}
  
    useEffect(() => {
        const fetchAttendanceStatus = async () => {
          try {
            const response = await fetch(`http://localhost:8000/api/attendance/history/${data.userId}`);
            if (!response.ok) {
              throw new Error("Failed to fetch attendance status");
            }
            const result = await response.json();
            setAttendanceStatus(result.data.status); 
          } catch (error) {
            console.error("Failed to fetch attendance status:", error);
            toast.error("Failed to fetch attendance status");
          }
        };
      
        fetchAttendanceStatus();
      }, [data.userId]); 

      const handleCheckIn = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/attendance/check-in', {
            body: JSON.stringify(data),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) {
            toast.error("You are already checked in");
            return;
          }
          if (response.ok) {
            toast.success('Check-in successful! Let`s work');
            setAttendanceStatus("ACTIVE"); 
          }
        } catch (error) {
          console.error('Failed to check in', error);
          toast.error('Failed to Check-in');
        }
      };
      
      const handleCheckOut = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/attendance/check-out', {
            body: JSON.stringify(data),
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) {
            toast.error("You are not checked in");
            return;
          }
          if (response.ok) {
            toast.success('Check-out successful! Get some rest');
            setAttendanceStatus("INACTIVE");  
          }
        } catch (error) {
          console.error('Failed to check out:', error);
          toast.error('Failed to Check-out');
        }
      };
  
    return(
        <div className="flex bg-neutral-100 lg:py-8 p-3 lg:px-10 rounded-xl justify-evenly items-center shadow-md lg:mx-2">
            <div className="flex flex-col justify-center items-start h-full w-full">
            <p className="text-white w-max bg-blue-300 px-2 rounded-xl mb-1">{formatDate(new Date().toISOString())}</p>
                <h1>id: {id}</h1>
                <h1>name: {name}</h1>
                <h1>{role}</h1>
                <button onClick={() => {
    if (attendanceStatus == "INACTIVE") {
      handleCheckIn(); 
    } else {
      handleCheckOut();
    }
    }} className={`py-2 mt-2 px-5 rounded-xl text-white ${attendanceStatus == "INACTIVE"? "bg-[#1678F2]  hover:bg-[#4b87cc]" : "bg-red-500 hover:bg-red-400" }`}>{attendanceStatus == "INACTIVE"? "Check In" : "Check Out"}</button>
            </div>
            <div className="lg:w-[150px] lg:h-[100px] bg-black rounded-full overflow-hidden">
                <Image
                src={profile}
                alt=""
                width={500}
                height={600}
                />
            </div>
        </div>
    )
}