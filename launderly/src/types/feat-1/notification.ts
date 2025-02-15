import { IUserF1 } from "./user";

export interface IUserNotificationF1 {
    id: number;
    createdAt: Date;
    isRead: boolean;
    userId: number;
    notificationId: number;
    user: IUserF1;
    notification: Notification;
  }

  export interface NotificationF1 {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    userNotification: IUserNotificationF1[];
  }