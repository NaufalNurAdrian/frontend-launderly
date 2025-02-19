"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Receipt,
  UserCircle,
  LogOut,
  House,
} from "lucide-react";
import { IUser } from "@/types/user";
import { deleteCookie } from "@/libs/action";
import useSession from "@/hooks/useSession";

const CustomerSidebar = () => {
  const [isClient, setIsClient] = useState(false);
  const { user } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Tutup sidebar di mobile
      } else {
        setIsCollapsed(false); // Buka sidebar di desktop
      }
    };

    handleResize(); // Panggil saat pertama kali render
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsClient(true); // Set state saat sudah di client-side
  }, []);

  if (!isClient) {
    return null; // Jangan render apapun di server-side
  }
  const onLogout = () => {
    deleteCookie("token");
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    {
      icon: <LayoutDashboard size={24} />,
      text: "Dashboard",
      href: "/dashboardCustomer",
    },
    {
      icon: <House size={24} />,
      text: "My Address",
      href: "/address",
    },
    {
      icon: <Calendar size={24} />,
      text: "My Laundry",
      href: "/myLaundry",
    },
    {
      icon: <UserCircle size={24} />,
      text: "My Profile",
      href: "/profileCustomer",
    },
    {
      icon: <Receipt size={24} />,
      text: "Payment",
      href: "/myPayment",
    },
  ];

  const customer = user as IUser;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } bg-white shadow-lg transition-all duration-300 relative flex flex-col`}
      >
        <div className="flex items-center p-4 border-b">
          <Image src="/services1.gif" alt="Logo" width={32} height={32} />
          {!isCollapsed && (
            <Link href="/" className="ml-3 text-xl font-bold text-gray-800">
              Launderly
            </Link>
          )}
        </div>
        <nav className="flex-1 mt-8 space-y-2 px-3">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                  isCollapsed ? "justify-center" : "gap-4"
                } ${
                  isActive
                    ? "bg-gray-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <div
                  className={`${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                </div>
                {!isCollapsed ? (
                  <span className="font-medium">{item.text}</span>
                ) : (
                  <span className="absolute left-full ml-6 p-2 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.text}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t">
          <div className="p-4">
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <Image
                  src={customer?.avatar || "/user.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {customer?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {customer?.email || ""}
                  </p>
                  <p className="text-xs text-blue-600 capitalize">
                    {customer?.isVerify ? "Verified Customer" : "Customer"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center group relative">
                <Image
                  src={customer?.avatar || "/user.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="absolute left-full ml-6 p-2 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {customer?.fullName || "Guest"}
                  {customer?.email && <br />}
                  {customer?.email}
                  <br />
                  <span className="capitalize">
                    {customer?.isVerify ? "Verified Customer" : "Customer"}
                  </span>
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-4 text-gray-500 hover:bg-gray-100 transition-colors flex justify-center"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
        <div className="border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center p-4 text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CustomerSidebar;
