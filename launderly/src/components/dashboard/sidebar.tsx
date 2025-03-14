"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { deleteCookie } from "@/libs/action";
import { toTitleCase } from "@/helpers/toTitleCase";
import useSession from "@/hooks/useSession";
import { useRole } from "@/hooks/useRole";
import { IUser } from "@/types/user";

// Import React Icons
import { GiWashingMachine } from "react-icons/gi";
import { MdDashboard, MdShoppingCart, MdSettings, MdLogout } from "react-icons/md";
import { FaStore, FaUser, FaBox, FaCalendarAlt } from "react-icons/fa";

interface SidebarProps {
  currentPath?: string;
}

function Sidebar({ currentPath }: SidebarProps) {
  const router = useRouter();
  const { user, isAuth, setIsAuth } = useSession();
  const role = useRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string): boolean => {
    if (!currentPath) return false;
    
    if (path === "/dashboard") {
      return currentPath === "/dashboard";
    }
    
    return currentPath === path;
  };

  const onLogout = () => {
    deleteCookie("token");
    localStorage.removeItem("token");
    setIsAuth(false);
    router.push("/");
  };

  const customer = user as IUser;

  const getMenuItems = () => {
    const baseItems = [
      { href: "/dashboard", icon: <MdDashboard size={24} />, label: "Dashboard" },
    ];

    if (role === "SUPER_ADMIN") {
      return [
        ...baseItems,
        { href: "/dashboard/outlet", icon: <FaStore size={24} />, label: "Outlet" },
        { href: "/dashboard/employee", icon: <FaUser size={24} />, label: "Employee" },
        { href: "/dashboard/item", icon: <FaBox size={24} />, label: "Item" },
        { href: "/dashboard/order", icon: <MdShoppingCart size={24} />, label: "Orders" },
        { href: "/dashboard/bypass", icon: <MdSettings size={24} />, label: "Bypass" },
        { href: "/dashboard/attendance", icon: <FaCalendarAlt size={24} />, label: "Attendance" }
      ];
    }

    if (role === "OUTLET_ADMIN") {
      return [
        ...baseItems,
        { href: "/dashboard/order", icon: <MdShoppingCart size={24} />, label: "Orders" },
        { href: "/dashboard/bypass", icon: <MdSettings size={24} />, label: "Bypass" },
      ];
    }

    return baseItems;
  };

  return (
    <div className={`fixed h-full w-[70px] md:w-[250px] flex flex-col justify-between bg-gradient-to-b from-sky-500 to-blue-600 p-3 z-50 shadow-xl rounded-r-3xl text-white ${mounted ? 'sidebar-appear' : ''}`}>
      <div className="py-4 px-2 mb-6 flex items-center justify-center">
        <div className="logo-spin">
          <GiWashingMachine className="text-white md:mr-2" size={36} />
        </div>
        <h1 className="text-2xl font-bold text-white hidden md:block logo-text">Launderly</h1>
      </div>
      
      <div className="container flex flex-col items-start gap-3">
        {getMenuItems().map((item, index) => {
          const active = isActive(item.href);
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`w-full flex items-center justify-center md:justify-start gap-4 px-2 py-4 rounded-lg transition-all duration-300 menu-item ${
                active 
                  ? "bg-white bg-opacity-20 shadow-md transform scale-105" 
                  : "hover:bg-white hover:bg-opacity-10 hover:scale-105"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`flex items-center justify-center ${active ? 'icon-pulse' : ''}`}>
                <div className={`p-2 rounded-full ${active ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'}`}>
                  <span className={`text-white ${active ? "brightness-150 drop-shadow-glow" : "brightness-120"}`}>
                    {item.icon}
                  </span>
                </div>
              </div>
              <div className={`text-base ${active ? "font-bold" : "font-normal"} text-white hidden md:block transition-all duration-300`}>
                {item.label}
              </div>
              {active && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full hidden md:block active-indicator"></div>
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto pt-6 flex flex-col gap-3 border-t border-white border-opacity-20">
        {isAuth ? (
          <div className="w-full flex items-center justify-center md:justify-start gap-4 px-3 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300 profile-card">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-400 rounded-full avatar-glow animate-pulse"></div>
              <div className="bg-white bg-opacity-20 p-1 rounded-full">
                <Image
                  alt="profile"
                  src={customer.avatar || "/Male User.svg"}
                  width={32}
                  height={32}
                  style={{ height: "auto", position: "relative", zIndex: 10 }}
                  className="rounded-full border-2 border-white border-opacity-50"
                />
              </div>
            </div>
            <div className="flex-col hidden md:block">
              <div className="text-base font-semibold text-white">
                {toTitleCase(customer.fullName)}
              </div>
              <div className="text-sm font-light text-blue-100">
                {toTitleCase(customer.role)}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center md:justify-start gap-4 px-3 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <FaUser className="text-white" size={24} />
            </div>
            <div className="text-base font-normal text-white hidden md:block">
              Profile
            </div>
          </div>
        )}
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center md:justify-start gap-4 px-3 py-3 rounded-lg bg-red-500 bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 mt-2 logout-button"
        >
          <div className="flex items-center justify-center bg-red-500 bg-opacity-20 p-2 rounded-full">
            <MdLogout className="text-red-200" size={20} />
          </div>
          <div className="text-base font-medium text-red-200 hidden md:block">
            Log Out
          </div>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;