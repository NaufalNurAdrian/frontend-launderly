import api from "@/libs/api";
import { Address } from "@/types/address.type";
import { Outlet, OutletApiResponse, OutletById } from "@/types/outlet.type";

export const fetchAllOutlet = async (): Promise<OutletApiResponse> => {
  try {
    const response = await api.get<OutletApiResponse>("/outlet/");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch employees");
  }
};

export const getOutletById = async (id: number): Promise<OutletById> => {
  try {
    const response = await api.get<OutletById>(`/outlet/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch outlet:",
    );
    throw Error("Failed to fetch outlet details");
  }
};

export const createOutlet = async (outletData: {
  id: string;
  outletName: string;
  outletType: "MAIN" | "BRANCH";
  address: Address[];
}): Promise<OutletById> => {
  try {
    const response = await api.patch<OutletById>("/outlet/", outletData);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create outlet:",
    );
    throw Error("Failed to create outlet");
  }
};


export const updateOutlet = async (outletData: {
  id: string;
  outletName: string;
  outletType: "MAIN" | "BRANCH";
  address: Address;
}): Promise<Outlet> => {
  try {

    const response = await api.patch<Outlet>(`/outlet/update`, outletData);

    console.log("Data yang dikirim ke backend:", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to update outlet:");
    throw new Error("Failed to update outlet");
  }
};
