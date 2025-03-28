import api from "@/libs/api";
import {
  AddEmployeeInput,
  Employee,
  EmployeeApiResponse,
  EmployeeById,
  EmployeeStation,
  EmployeeWorkShift,
} from "@/types/employee.type";

export const fetchAllEmployee = async (
  page: number = 1,
  pageSize: number = 5
) => {
  try {
    const response = await api.get<EmployeeApiResponse>(
      `/employee?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch employees");
  }
};

export const createEmployee = async (
  data: AddEmployeeInput
): Promise<Employee> => {
  try {
    const response = await api.post<Employee>("/employee/create", data);
    // console.log("data :", data);

    return response.data;
  } catch (error) {
    console.log({message: "cannot create employee", error})
    throw new Error("Failed to create employee");
  }
};

export const getEmployeeById = async (id: string): Promise<EmployeeById> => {
  try {
    const response = await api.get<EmployeeById>(`/employee/${id}`);
    return response.data;
  } catch (error) {
    throw new Error();
  }
};

export interface EmployeeInput {
  workShift?: EmployeeWorkShift;
  station?: EmployeeStation;
  outletId?: string;
  role?: string;
  fullName?: string;
  email?: string;
  password?: string;
}

export const updateEmployee = async (
  id: string,
  employeeData: EmployeeInput
): Promise<Employee> => {
  try {
    const response = await api.patch<Employee>(
      `/employee/update/${id}`,
      employeeData
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update employee:");
    throw new Error("Failed to update employee");
  }
};

export const deleteEmployee = async (id: { id: string }): Promise<Employee> => {
  try {
    const response = await api.patch<Employee>(`/employee/delete`, id);

    return response.data;
  } catch (error) {
    console.error("Failed to delete employee:");
    throw new Error("Failed to delete employee");
  }
};
