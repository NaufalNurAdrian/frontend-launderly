"use client";
import { useEffect, useRef } from "react";
import NotificationItem from "./notificationItem";
import { INotificationDetail } from "@/types/notification";
import NotFound from "./notFound";
import { X } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: INotificationDetail[];
  onMarkAsRead: (notificationId: number) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationModal({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead }: NotificationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed top-0 overflow-auto right-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-[1000]">
      <div className="p-4 border-b border-gray-200 flex justify-between">
        <h3 className="font-semibold text-lg text-blue-500">Notifications</h3>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {notifications.length == 0 ? (
          <div className="flex justify-center items-center lg:mx-4 z-50 my-3">
            <NotFound text="No Notification found." />
          </div>
        ) : (
          <div>
            {notifications.map((notification: INotificationDetail) => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} />
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <button onClick={onMarkAllAsRead} className="w-full text-sm text-center text-blue-500 hover:text-blue-700">
          Mark all as read
        </button>
      </div>
    </div>
  );
}
