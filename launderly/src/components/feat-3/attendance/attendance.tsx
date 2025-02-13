"use client";
import formatDate from "@/helpers/dateFormatter";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface IProfile {
  token: string;
  id: number;
  name: string;
  role: string;
  profile: string;
}
export default function WorkerAttendance({ token, id, name, role, profile }: IProfile) {
  const [attendanceStatus, setAttendanceStatus] = useState<string>("INACTIVE");
  const fetchAttendanceStatus = async () => {
    const fetchData = async (url: string) => {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return await response.json();
    };

    try {
      const baseUrl = `http://localhost:8000/api/attendance/history/`;
      const initialData = await fetchData(baseUrl);

      console.log("Initial Data:", initialData);

      if (initialData.data.length === 0) {
        setAttendanceStatus("INACTIVE");
        return;
      }

      const lastPage = initialData.pagination.totalPages;
      const lastPageData = await fetchData(`${baseUrl}?page=${lastPage}`);

      const lastAttendance = lastPageData.data[lastPageData.data.length - 1].attendanceStatus;
      setAttendanceStatus(lastAttendance);
      console.log(lastAttendance);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch attendance status");
    }
  };
  const handleCheckIn = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/attendance/check-in", {
        body: JSON.stringify({ userId: id }),
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) {
        toast.error("You are already checked in");
        return;
      }
      if (response.ok) {
        setAttendanceStatus("ACTIVE");
        toast.success("Check-in successful! Let`s work");
      }
    } catch (error) {
      toast.error("error");
    }
  };
  const handleCheckOut = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/attendance/check-out", {
        body: JSON.stringify({ userId: id }),
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) {
        toast.error("You are not checked in");
        return;
      }
      if (response.ok) {
        setAttendanceStatus("INACTIVE");
        toast.success("Check-out successful! Get some rest");
      }
    } catch (error) {
      toast.error("Failed to Check-out");
    }
  };
  useEffect(() => {
    fetchAttendanceStatus();
  }, [attendanceStatus]);
  return (
    <div className="flex bg-neutral-100 lg:py-8 p-3 lg:px-10 rounded-xl justify-evenly items-center shadow-md lg:mx-2">
      <div className="flex flex-col justify-center items-start h-full w-full">
        <p className="text-white border-blue-600 w-max bg-blue-400 px-2 rounded-xl mb-1">{formatDate(new Date().toISOString())}</p>
        <h1>id: {id}</h1>
        <h1>name: {name}</h1>
        <h1>{role}</h1>
        <button
          onClick={() => {
            if (attendanceStatus == "INACTIVE") {
              handleCheckIn();
            } else {
              handleCheckOut();
            }
          }}
          className={`py-2 mt-2 px-5 rounded-xl text-white ${attendanceStatus == "INACTIVE" ? "bg-[#1678F2]  hover:bg-[#4b87cc]" : "bg-red-500 hover:bg-red-400"}`}
        >
          {attendanceStatus == "INACTIVE" ? "Check In" : "Check Out"}
        </button>
      </div>
      <div className="lg:w-[150px] lg:h-[100px] bg-black rounded-full overflow-hidden">
        <Image src={profile} alt="profile" width={500} height={600} />
      </div>
    </div>
  );
}
