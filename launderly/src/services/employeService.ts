import api from "@/libs/api";
import { AddEmployeeInput, Employee, EmployeeApiResponse } from "@/types/employee.type";


export const fetchAllEmployee = async (page: number = 1, pageSize: number = 5) => {
  try {
    const response = await api.get<EmployeeApiResponse>(`/employee?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch employees");
  }
};


export const createEmployee = async (data: AddEmployeeInput): Promise<Employee> => {
    try {
        const response = await api.post<Employee>("/employee/create", data);
        console.log("data :",data);
        
        return response.data;
    } catch (error) {
      throw new Error("Failed to create employee");
    }
};



