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
  
  export interface IAttendance {
    id: number;
    checkIn: string; 
    checkOut: string; 
    createdAt: string; 
    workHour: number;
    userId: number;
    attendanceStatus: "ACTIVE" | "INACTIVE";
    user: IUser; 
  }
  
  export interface IApiResponse {
     data: IAttendance[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
  }
