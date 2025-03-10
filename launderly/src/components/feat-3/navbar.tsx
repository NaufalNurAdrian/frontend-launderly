"use client";
import { useEffect, useRef, useState } from "react";
import { Bell, CalendarCheck, FileText, FolderClock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { IApiResponse, INotificationDetail } from "@/types/notification";
import toast from "react-hot-toast";
import NotificationModal from "./notificationModal";
import { useToken } from "@/hooks/useToken";
import Image from "next/image";
import useSession from "@/hooks/useSession";
import { IUser } from "@/types/user";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotificationDetail[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const token = useToken();
  const { user } = useSession();

  const worker = user as IUser;
  const navItems = [
    {
      name: "Attendance",
      path: `/attendance`,
      icon: <CalendarCheck size={20} />,
    },
    { name: "Notifications", path: `/notifications`, icon: <Bell size={20} /> },
    { name: "Requests", path: `/requests`, icon: <FileText size={20} /> },
    { name: "History", path: `/history`, icon: <FolderClock size={20} /> },
  ];

  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/notification/?notificationId=${notificationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to mark notification as read"
        );
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (err: unknown) {
      console.error("Failed to mark notification as read:", err);

      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
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

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      toast.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notification/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result: IApiResponse = await res.json();
        setNotifications(result.data);
        setUnreadCount(result.pagination.total);
      } catch (err : any) {
        toast.error("Fetch failed: " + err.message);
      }
    };

    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-[#F9F9F9] shadow-lg sm:hidden z-50">
        <div className="flex justify-between items-center py-2 px-4 max-w-full">
          <div className="flex justify-around items-center flex-1">
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
                className={`p-2 rounded-lg ${
                  pathname === item.path
                    ? "bg-[#1678F2] text-white"
                    : "text-[#1678F2] hover:bg-blue-100"
                } cursor-pointer`}
              >
                {item.name === "Notifications" ? (
                  <div className="relative">
                    {item.icon}
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                ) : (
                  item.icon
                )}
              </div>
            ))}
            <Link href="/profile">
              <Image
                src={worker?.avatar || "/user.png"}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Link>
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
}
