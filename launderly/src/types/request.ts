<<<<<<< HEAD
export interface IUser {
  id: number;
  fullName: string;
  email: string;
  password: string;
  isVerify: boolean;
  role: string;
  avatar: string | null;
  createdAt: string;
  isDelete: boolean;
}

export interface IRequest {
  id: number;
  type: "delivery" | "pickup";
  deliveryNumber?: string;
  pickupNumber?: string;
  deliveryStatus?: string;
  pickupStatus?: string;
  address: { addressLine: string };
  createdAt: string;
  updatedAt: string;
  distance: number;
  userId: number;
  user: IUser;
}

export interface IApiResponse {
  data: IRequest[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
=======
export interface IRequestOrderForm {
  addressId: number;
  latitude?: number;
  longitude?: number;
>>>>>>> 226747a8671504625a2e6f456aff6202199bf680
}
