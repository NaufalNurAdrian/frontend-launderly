
export interface INotificationDetail{
    id: number;
    createdAt: string
    isRead: boolean
    notification: INotification
}

export interface INotification{
    id: number;
    title: string;
    description: string;
    createdAt: string
}
export interface IApiResponse {
  data: INotificationDetail[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
