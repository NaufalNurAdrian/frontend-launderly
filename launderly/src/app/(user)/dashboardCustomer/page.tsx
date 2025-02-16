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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CustomerSidebar />
      <main className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-center p-4 lg:p-8 mt-12 lg:mt-0 overflow-hidden min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row w-full lg:w-auto">
          <div className="flex flex-col justify-center p-6 lg:p-12 w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <p className="text-blue-800 font-medium">Welcome back!</p>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Hello, {user.fullName}! 👋
            </h1>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Ready to laundry? You can manage your{" "}
              <span className="text-red-500 font-semibold">Laundry</span>, check
              your <span className="text-blue-500 font-semibold">Payment</span>,
              and update your{" "}
              <span className="text-green-500 font-semibold">Profile</span>{" "}
              here.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/myLaundry"
                className="flex-1 lg:flex-none text-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Laundry
              </Link>
              <Link
                href="/address"
                className="flex-1 lg:flex-none text-center bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                My Address
              </Link>
              <Link
                href="/myPayment"
                className="flex-1 lg:flex-none text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Payment
              </Link>
              <Link
                href="/profileCustomer"
                className="flex-1 lg:flex-none text-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                My Profile
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-blue-50 to-blue-100 w-full lg:w-1/2">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-48 h-48 lg:w-72 lg:h-72 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
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
