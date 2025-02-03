"use client";
import { useEffect, useRef, useState } from "react";
import { Bell, CalendarCheck, FileText, FolderClock } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import { IApiResponse, INotificationDetail } from "@/types/notification";
import toast from "react-hot-toast";
import NotificationModal from "./notificationModal";

export default function Sidebar() {
  const id = 1;
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotificationDetail[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Attendance", path: "/driver/attendance", icon: <CalendarCheck size={30} /> },
    { name: "Notifications", path: "/driver/notifications", icon: <Bell size={30} /> },
    { name: "Requests", path: "/driver/requests", icon: <FileText size={30} /> },
    { name: "History", path: "/driver/history", icon: <FolderClock size={30} /> },
  ];

  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notification/?notificationId=${notificationId}`, {
        method: "PATCH",
        headers: {
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
      const response = await fetch(`http://localhost:8000/api/notification/mark-all/?userId=${id}`, {
        method: "PATCH",
        headers: {
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
        const res = await fetch(`http://localhost:8000/api/notification/?userId=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
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
  }, [isNotificationOpen] );

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

  return (
    <div className="bg-[#F9F9F9] min-w-[90px] h-screen fixed flex flex-col justify-between items-center z-50 gap-2 text-[#1678F2] text-[28px] py-10">
      <div className="mt-48 flex flex-col gap-8 justify-between h-[100px] items-center">
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
            className={`p-1 rounded-xl ${pathname === item.path ? "bg-[#1678F2] text-white hover:bg-[#1678F0]" : "hover:bg-blue-300 cursor-pointer"}`}
          >
            {item.name === "Notifications" ? (
              <div className="relative">
                {item.icon}
                {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>}
              </div>
            ) : (
              item.icon
            )}
          </div>
        ))}
      </div>

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <div className="flex flex-col gap-5 items-center justify-center font-bold">
        <div>
          <IoLogOutOutline />
        </div>
      </div>
    </div>
  );
}
