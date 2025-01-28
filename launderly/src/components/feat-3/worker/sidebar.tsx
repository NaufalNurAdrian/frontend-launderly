"use client"
import { CalendarCheck, FileText, FolderClock } from "lucide-react";
import Link from "next/link";
import { usePathname} from "next/navigation";
// import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Attendance", path: "/worker/attendance", icon: <CalendarCheck size={30} /> },
        { name: "Requests", path: "/worker/requests", icon: <FileText size={30} /> },
        { name: "History", path: "/worker/history", icon: <FolderClock size={30} /> },
      ];
    return (
        <div className="bg-[#F9F9F9] min-w-[90px] h-screen fixed flex flex-col justify-between items-center gap-2 text-[#1678F2] text-[28px] py-10">
                <div className="mt-48 flex flex-col gap-8 justify-between h-[100px] items-center">
                {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`p-1 rounded-xl ${
                pathname === item.path ? "bg-[#1678F2] text-white" : ""
            }`}
          >
            {item.icon}
          </Link>
        ))}
                </div>
                
                <div className="flex flex-col gap-5 items-center justify-center font-bold">
                <div><IoLogOutOutline /></div>
                </div>
        </div>
    )
}