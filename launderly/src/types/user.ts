export interface IUser {
    id: number;
    fullName: string; 
    email: string;
    password: string;
    avatar: string | null;
    isVerify: boolean;
    role: string; 
    createdAt: string; 
    isDelete: boolean; 
}
