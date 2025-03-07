"use client"

import Image from "next/image";
import Link from "next/link";
import { GiWashingMachine } from "react-icons/gi";
import useSession from "@/hooks/useSession";
import { IUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/libs/action";
import { toTitleCase } from "@/helpers/toTitleCase";

interface SidebarProps {
  currentPath?: string;
}

function Sidebar({ currentPath }: SidebarProps) {
  const router = useRouter();
  const { user, isAuth, setIsAuth } = useSession();
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
      router.push("/");
    };

    const customer = user as IUser;

  return (
    <div className="fixed h-full w-[70px] md:w-[250px] flex flex-col justify-between bg-gradient-to-b from-blue-600 to-blue-800 p-3 z-50 shadow-lg">
      {/* Logo - Visible on mobile */}
      <div className="py-4 px-2 mb-6 flex items-center justify-center">
        <GiWashingMachine className="text-white md:mr-2" size={36} />
        <h1 className="text-2xl font-bold text-white hidden md:block">Launderly</h1>
      </div>
      
      <div className="container flex flex-col items-start gap-2">
        {[
          { href: "/dashboard", icon: "/dashboard Layout.svg", label: "Dashboard" },
          { href: "/dashboard/outlet", icon: "/Online Store.svg", label: "Outlet" },
          { href: "/dashboard/employee", icon: "/customer.svg", label: "Employee" },
          { href: "/dashboard/item", icon: "/item.svg", label: "Item" },
          { href: "/dashboard/order", icon: "/Shopping Trolley.svg", label: "Orders" },
          { href: "/dashboard/bypass", icon: "/Settings.svg", label: "Bypass" }
        ].map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`w-full flex items-center justify-center md:justify-start gap-4 px-2 py-4 rounded-lg ${
                active 
                  ? "bg-blue-400 bg-opacity-30" 
                  : "hover:bg-blue-500 hover:bg-opacity-20"
              }`}
            >
              <div className="flex items-center justify-center">
                <Image
                  alt={item.label}
                  src={item.icon}
                  width={32}
                  height={32}
                  className={`${active ? "" : "filter invert opacity-80"}`}
                  style={{ filter: active ? "invert(80%) sepia(60%) saturate(1500%) hue-rotate(170deg) brightness(105%) contrast(105%)" : "" }}
                />
              </div>
              <div className={`text-base ${active ? "font-bold" : "font-normal"} text-white hidden md:block`}>
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto pt-6 flex flex-col gap-2 border-t border-blue-500">
        {isAuth ? (
          <div 
          className="w-full flex items-center justify-center md:justify-start gap-4 px-2 py-4 rounded-lg hover:bg-blue-500 hover:bg-opacity-20"
        >
          <div className="flex items-center justify-center">
            <Image
              alt="profile"
              src={customer.avatar || "/Male User.svg"}
              width={32}
              height={32}
              className="filter invert opacity-80"
            />
          </div>
          <div className="flex-col hidden md:block">
            <div className="text-base font-normal text-white">
              {toTitleCase(customer.fullName)}
            </div>
            <div className="text-base font-normal text-white">
              {toTitleCase(customer.role)}
            </div>
          </div>
        </div>
        ) : (

        <div 
          className="w-full flex items-center justify-center md:justify-start gap-4 px-3 py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-20"
        >
          <div className="flex items-center justify-center">
            <Image
              alt="profile"
              src="/Male User.svg"
              width={24}
              height={24}
              className="filter invert opacity-80"
            />
          </div>
          <div className="text-base font-normal text-white hidden md:block">
            Profile
          </div>
        </div>
        )}
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center md:justify-start gap-4 px-2 py-4 rounded-lg hover:bg-red-500 hover:bg-opacity-20"
        >
          <div className="flex items-center justify-center">
            <Image
              alt="logout"
              src="/Export.svg"
              width={24}
              height={24}
              style={{ filter: "invert(60%) sepia(75%) saturate(2000%) hue-rotate(360deg) brightness(105%) contrast(105%)" }}
            />
          </div>
          <div className="text-base font-normal text-orange-400 hidden md:block">
            Log Out
          </div>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;