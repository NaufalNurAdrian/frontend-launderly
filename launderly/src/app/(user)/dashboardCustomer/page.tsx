"use client";

import React from "react";
import CustomerSidebar from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import useSession from "@/hooks/useSession";

const CustomerDashboard: React.FC = () => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-gray-700 text-lg mb-4">No user session found.</p>
          <Link
            href="/sign-in"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Please log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <CustomerSidebar />
      <main className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-center p-4 lg:p-8 mt-12 lg:mt-0 overflow-hidden min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row w-full lg:w-auto">
          {/* Bagian Kiri - Info User */}
          <div className="flex flex-col justify-center p-6 lg:p-12 w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-200 to-blue-100 px-4 py-2 rounded-full">
              <Image
                src="/services1.gif"
                alt="Laundry Icon"
                width={24}
                height={24}
              />
              <p className="text-blue-800 font-medium">Welcome back!</p>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Hello, {user.fullName}! 👋
            </h1>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Ready to do your laundry? Easily manage your{" "}
              <span className="text-red-500 font-semibold">Laundry</span>, check
              your <span className="text-blue-500 font-semibold">Payments</span>
              , and update your{" "}
              <span className="text-green-500 font-semibold">Profile</span>{" "}
              effortlessly.
            </p>
            {/* Tombol Navigasi */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/myLaundry"
                className="dashboard-btn bg-red-500 hover:bg-red-600"
              >
                Laundry
              </Link>
              <Link
                href="/address"
                className="dashboard-btn bg-teal-500 hover:bg-teal-600"
              >
                My Address
              </Link>
              <Link
                href="/myPayment"
                className="dashboard-btn bg-blue-500 hover:bg-blue-600"
              >
                Payment
              </Link>
              <Link
                href="/profileCustomer"
                className="dashboard-btn bg-green-500 hover:bg-green-600"
              >
                My Profile
              </Link>
            </div>
          </div>

          {/* Bagian Kanan - Avatar & Background */}
          <div className="relative flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-blue-100 to-blue-200 w-full lg:w-1/2">
            {/* Bubble Effect */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-48 h-48 lg:w-72 lg:h-72 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute left-0 bottom-10 w-24 h-24 bg-blue-300 rounded-full blur-2xl opacity-20"></div>

            {/* Avatar */}
            <div className="relative z-10 w-32 h-32 lg:w-64 lg:h-64 rounded-full overflow-hidden ring-4 ring-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Image
                src={user.avatar || "/user.png"}
                alt="User Avatar"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
