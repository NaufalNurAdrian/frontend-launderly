"use client";

import { INotificationDetail } from "@/types/notification";

interface NotificationItemProps {
  notification: INotificationDetail;
  onMarkAsRead: (notificationId: number) => void;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  return (
    <div className="p-4 hover:bg-gray-50 cursor-pointer fixed z-50">
      <div className="flex justify-between gap-16 items-center">
        <div>
          <p className="font-medium text-[15px]">{notification.notification.title}</p>
          <p className="text-sm text-gray-600">{notification.notification.description}</p>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(notification.createdAt).toLocaleTimeString()}
        </span>
      </div>
      {!notification.isRead && (
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="mt-2 text-sm text-blue-500 hover:text-blue-700"
        >
          Mark as read
        </button>
      )}
    </div>
  );
}