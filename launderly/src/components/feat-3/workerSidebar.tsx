"use client";
import { useEffect, useRef, useState } from "react";
import { Bell, CalendarCheck, FileText, FolderClock, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { IApiResponse, INotificationDetail } from "@/types/notification";
import toast from "react-hot-toast";
import NotificationModal from "./notificationModal";
import LogoutButton from "./logoutButton";
import { useToken } from "@/hooks/useToken";
import Image from "next/image";
import Link from "next/link";
import { IUser } from "@/types/user";
import useSession from "@/hooks/useSession";
import UserProfile from "./userDetail";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotificationDetail[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const token = useToken();
  const { user } = useSession();

  const navItems = [
    { name: "Attendance", path: `/attendance`, icon: <CalendarCheck size={24} /> },
    { name: "Notifications", path: `/notifications`, icon: <Bell size={24} /> },
    { name: "Requests", path: `/requests`, icon: <FileText size={24} /> },
    { name: "History", path: `/history`, icon: <FolderClock size={24} /> },
    { name: "Profile", path: `/profile`, icon: <UserCircle size={24} /> },
  ];

  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/notification/?notificationId=${notificationId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prevNotifications) => prevNotifications.map((notification) => (notification.id === notificationId ? { ...notification, isRead: true } : notification)));

      setUnreadCount((prevCount) => prevCount - 1);
    } catch (err: any) {
      toast.error("Fetch failed: " + err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`${BASE_URL}/notification/mark-all/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((prevNotifications) => prevNotifications.map((notification) => ({ ...notification, isRead: true })));

      setUnreadCount(0);

      console.log("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notification/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result: IApiResponse = await res.json();
        setNotifications(result.data);
        setUnreadCount(result.pagination.total);
      } catch (err) {
        toast.error("Fetch failed: " + err);
      }
    };

    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const worker = user as IUser;
  return (
    <div>
      <aside className={`${isCollapsed ? "w-20" : "w-56"}  min-h-screen  justify-between items-center z-50 gap-2 text-[#1678F2]  transition-all duration-300 bg-white shadow-lg relative flex flex-col`}>
        <div className="flex flex-col w-full px-3 gap-4 justify-between h-[100px]">
          <div className="flex items-center p-4 border-b">
            {/* <Image src="/services1.gif" alt="Logo" width={32} height={32} /> */}
            {!isCollapsed && (
              <Link href="/" className="ml-3 text-xl text-center font-bold text-gray-800">
                Launderly
              </Link>
            )}
          </div>
          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={
                item.name === "Notifications"
                  ? toggleNotificationModal
                  : () => {
                      router.push(item.path);
                    }
              }
              className={`p-2 rounded-xl flex gap-3 items-center  ${isCollapsed ? "justify-center" : "justify-start"} ${
                pathname === item.path ? "text-[#1678F0] hover:text-blue-300" : "text-neutral-500 hover:text-blue-500 hover:bg-neutral-200 cursor-pointer"
              }`}
            >
              {item.name === "Notifications" ? (
                <div className="relative">
                  {item.icon}
                  {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>}
                </div>
              ) : (
                item.icon
              )}
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </div>
          ))}
        </div>
        <NotificationModal isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} notifications={notifications} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} />
        <div className="flex flex-col items-center justify-center font-bold">
          <div className="border-t">
            <div className="p-4">
              {isCollapsed ? (
                <div className="flex items-center gap-3 max-w-[200px]">
                  <Image src={worker?.avatar || "/user.png"} alt="Profile" width={32} height={32} className="rounded-full" />
                </div>
              ) : (
                <span className="w-full">
                  <UserProfile fullName={worker?.fullName} email={worker?.email} avatar={worker?.avatar!} isVerify={worker?.isVerify} />
                </span>
              )}
            </div>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full p-4 text-gray-500 hover:bg-gray-100 transition-colors flex justify-center">
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
          <div className="flex gap-2 items-center text-red-500 mb-5 border-t p-4">
            {isCollapsed ? (<LogoutButton/>) :( <LogoutButton text="Log out" />)}
          </div>
        </div>
      </aside>
    </div>
  );
}
