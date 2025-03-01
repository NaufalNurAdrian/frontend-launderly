export interface IUser {
  id: number;
  fullName: string;
  email: string;
  avatar: string | null;
  isVerify: boolean;
  role: "DRIVER" | "WORKER" |"OUTLET_ADMIN" |"SUPER_ADMIN" | "CUSTOMER"
  createdAt: string;
  isDelete: boolean;
  authProvider: "email" | "google";
  employee : IEmployee
}

export interface IEmployee {
  station: string
}
