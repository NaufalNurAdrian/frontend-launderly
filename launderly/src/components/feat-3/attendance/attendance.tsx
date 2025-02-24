"use client";
import formatDate from "@/helpers/dateFormatter";
import { IUser } from "@/types/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function WorkerAttendance({ token }: { token: string }) {
  const [attendanceStatus, setAttendanceStatus] = useState<string>("INACTIVE");
  const [profile, setProfile] = useState<IUser | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (error) {
      toast.error("Failed to fetch profile");
    }
  };

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
      const response = await fetch(`${BASE_URL}/attendance/check-out`, {
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
    fetchProfile();
    console.log(profile);
  }, [token, attendanceStatus]);
  return (
    <div className="flex bg-neutral-100 lg:py-8 p-3 lg:px-10 rounded-xl justify-evenly items-center shadow-md lg:mx-2">
      <div className="flex flex-col justify-center items-start h-full w-full">
        <p className="text-white border-blue-600 w-full bg-blue-400 px-2 rounded-xl mb-1">{formatDate(new Date().toISOString())}</p>
        <div className="grid grid-cols-[50px_auto] gap-1">
          <span className="font-semibold">ID </span>
          <span>: {profile?.id}</span>
          <span className="font-semibold">Name </span>
          <span>: {profile?.fullName}</span>
          <span className="font-semibold">Role </span>
          <span>: {profile?.role === "WORKER" ? profile.employee?.station.toLowerCase() : profile?.role.toLowerCase()}</span>
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
          {attendanceStatus == "INACTIVE" ? "Check In" : "Check Out"}
        </button>
      </div>
      <div className="w-[150px] h-[100px] bg-black rounded-full overflow-hidden">
       <Image src={profile?.avatar || "/user.png"} alt="Profile" width={600} height={600} className="rounded-full" />
      </div>
    </div>
  );
}
