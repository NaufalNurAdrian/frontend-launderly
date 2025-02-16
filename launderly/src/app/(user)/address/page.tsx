"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/feat-1/table";
import useSession from "@/hooks/useSession";
import { getUserAddresses } from "@/api/address";
import CreateAddressDialog from "./_components/CreateAddressDialog";
import CustomerSidebar from "@/components/ui/sidebar";
import UpdateAddressDialog from "./_components/UpdateAddressDialog";
import DeleteAddressDialog from "./_components/DeleteAddressDialog";
import { Home } from "lucide-react";

interface UserResult {
  fullname: string;
  email: string;
}

interface AddressResult {
  id: number;
  addressLine: string;
  city: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
  user: UserResult;
}

const AddressPage = () => {
  const { user } = useSession();
  const [addresses, setAddresses] = useState<AddressResult[]>([]);

  async function fetchUserAddress() {
    try {
      const data = await getUserAddresses();
      console.log("Data address dari API:", data);
      if (data.addresses) {
        setAddresses(data.addresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }

  useEffect(() => {
    fetchUserAddress();
  }, []);

  const refreshAddress = () => fetchUserAddress();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CustomerSidebar />

      {/* Konten Utama */}
      <div className="flex-1 p-4 md:p-8 space-y-6 flex flex-col items-center">
        {/* Header */}
        <div className="text-center justify-center ">
          <h1 className="text-3xl font-bold text-gray-800">My Address🏠</h1>
          <p className="text-gray-600 text-base mt-2">
            View, create, and edit your address here.
          </p>
        </div>

        {/* Filter, Pencarian, dan Tombol Buat Alamat */}
        <div className="w-full max-w-[800px] flex flex-col sm:flex-row justify-between items-center gap-4">
          <CreateAddressDialog onAddressCreated={refreshAddress} />
        </div>

        {/* Tabel Alamat */}
        <div className="w-full max-w-[800px] flex justify-center">
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-100 text-sm text-gray-700">
                  <TableHead className="text-center w-16">No.</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {addresses.length > 0 ? (
                  addresses.map((address, index) => (
                    <TableRow
                      key={address.id}
                      className="hover:bg-gray-50 text-sm"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>{address.addressLine}</TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell className="text-center">
                        <UpdateAddressDialog
                          address={address}
                          onAddressUpdated={refreshAddress}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DeleteAddressDialog
                          addressId={address.id}
                          addressName={address.addressLine}
                          onAddressDeleted={refreshAddress}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-gray-500"
                    >
                      No addresses available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
