"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerSidebar from "@/components/ui/sidebar";
import Image from "next/image";
import { toast } from "react-toastify";
import ResetPasswordForm from "@/components/resetPassword/resetPassword";
import useSession from "@/hooks/useSession";


const ProfileCustomer: React.FC = () => {
  const { user} = useSession();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const editAvatar = async (file: File) => {
    if (!file || !user) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authorization token is missing. Please log in again.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/avatarcloud`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(
          "Avatar updated successfully! Please refresh the page to see the changes."
        );
      } else {
        toast.error("Failed to update avatar.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error("Failed to upload avatar. Please try again.");
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {}, [user]);



  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <CustomerSidebar />
      <main className="flex-1 bg-gray-100 overflow-auto relative p-4 sm:p-8 md:p-10">
        <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-green-200 via-sky-200 to-blue-100" />
        <Image
          src="/profile.png"
          alt="Profile Decoration"
          width={100}
          height={100}
          className="absolute top-[-38px] right-[400px] transform sm:right-[200px] md:right-[300px]"
        />
        <div className="relative">
          <div className="bg-white shadow-xl rounded-lg max-w-full sm:max-w-2xl mx-auto mt-16 p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <img
                src={user?.avatar || "/user.png"}
                alt="Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md object-cover"
              />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-4">
                {user?.fullName}
              </h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="mt-4">
                <label
                  htmlFor="avatar"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600"
                >
                  {isUploading ? "Uploading..." : "Edit Avatar"}
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      editAvatar(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Reset Password
                </label>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={() => setShowResetPasswordModal(true)}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showResetPasswordModal && (
        <ResetPasswordForm onClose={() => setShowResetPasswordModal(false)} />
      )}
    </div>
  );
};

export default ProfileCustomer;
