"use client";
import formatDate from "@/helpers/dateFormatter";
import formatId from "@/helpers/idFormatter";
import useSession from "@/hooks/useSession";
import { IUser } from "@/types/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function WorkerAttendance({ token }: { token: string }) {
  const [attendanceStatus, setAttendanceStatus] = useState<string>("INACTIVE");
  const { user} = useSession();

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
      const baseUrl = `${BASE_URL}/attendance/history/`;
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
      const response = await fetch(`${BASE_URL}/attendance/check-in`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) {
        toast.error("You are already clocked in");
        return;
      }
      if (response.ok) {
        setAttendanceStatus("ACTIVE");
        toast.success(
          <>
            Clock-in successful, Let's work ! <br />
            Make sure to clock out before 23.59 WIB
          </>
        );
      }
    } catch (error) {
      toast.error("Failed to Clock-in");
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await fetch(`${BASE_URL}/attendance/check-out`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) {
        toast.error("You are not clocked in");
        return;
      }
      if (response.ok) {
        setAttendanceStatus("INACTIVE");
        toast.success("Clock-out successful! Get some rest");
      }
    } catch (error) {
      toast.error("Failed to Clock-out");
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, [token, attendanceStatus]);
  
  const worker = user as IUser;
  return (
    <div className="flex bg-neutral-100 lg:py-8 p-3 lg:px-10 rounded-xl justify-evenly items-center shadow-md lg:mx-2">
      <div className="flex flex-col justify-center items-start h-full w-full">
        <p className="text-white border-blue-600 w-full bg-blue-400 px-2 rounded-xl mb-1">{formatDate(new Date().toISOString())}</p>
        <div className="grid grid-cols-[50px_auto] gap-1">
          <span className="font-semibold">ID </span>
          <span>: {formatId(worker?.id!)}</span>
          <span className="font-semibold">Name </span>
          <span>: {worker?.fullName}</span>
          <span className="font-semibold">Role </span>
         <span>: {worker?.role === "WORKER" ? worker?.employee!.station.toLowerCase() : worker?.role!.toLowerCase()}</span>
        </div>
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
          {attendanceStatus == "INACTIVE" ? "Clock In" : "Clock Out"}
        </button>
      </div>
      <div className="w-[150px] h-[100px] bg-black rounded-full overflow-hidden">
        <Image src={worker?.avatar || "/user.png"} alt="Profile" width={600} height={600} className="rounded-full" />
      </div>
    </div>
  );
}
