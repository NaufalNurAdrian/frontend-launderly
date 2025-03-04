import { User } from "./user.type";

export interface UserNotification {
    id: number;
    createdAt: Date;
    isRead: boolean;
    userId: number;
    notificationId: number;
    user: User;
    notification: Notification;
  }

  export interface Notification {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    userNotification: UserNotification[];
  }