export interface IUser {
  id: number;
  fullName: string;
  email: string;
  avatar: string | null;
  isVerify: boolean;
  role: string;
  createdAt: string;
  isDelete: boolean;
  authProvider: "email" | "google";
}
