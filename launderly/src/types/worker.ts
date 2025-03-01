export interface IUser {
    id: number;
    fullName: string;
    email: string;
  }

export interface IPickupOrder {
    id: number;
    userId: number;
    outletId: number;
    addressId: number;
    user: IUser;
  }
  
  export interface IOrder {
    id: number;
    orderNumber: string;
    orderStatus: string;
    weight: number;
    laundryPrice: number;
    createdAt: string;
    updatedAt: string;
    pickupOrderId: number;
    isPaid: boolean;
    orderItem: any[]; 
    orderWorker: any[];
    pickupOrder: IPickupOrder;
  }
  
  export interface IApiResponse {
    station: string;
    data: IOrder[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  }
  export interface ILaundryItem {
    id: number;
    itemName: string;
  }
  
  export interface IOrderItem {
    id: number;
    qty: number;
    orderId: number;
    laundryItemId: number;
    laundryItem: ILaundryItem;
  }
  
  export interface IOrderItemResponse {
    data: IOrderItem[]; 
  }
  export interface IFormValues {
    items: {
      id: number;
      itemName: string;
      quantity: number;
      workerQuantity: number;
    }[];
  }