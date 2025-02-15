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
    <div className="flex min-h-screen">
      <CustomerSidebar />
      <div className="flex-1 p-1 md:p-6 space-y-6">
        {/* Judul */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">My Address</h1>
          <h1 className="text-base font-bold text-gray-600 mx-8 mt-2">
            On this address user can see and create also edit the address
          </h1>
        </div>

        <>
          {/* Filter, Pencarian, dan Tombol Buat Pengguna */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <CreateAddressDialog onAddressCreated={refreshAddress} />
            <div className="max-w-xs w-full sm:w-auto"></div>
          </div>

          {/* Tabel Alamat */}
          <div className="overflow-x-auto shadow rounded-md border border-gray-200">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-100 text-sm">
                  <TableHead className="text-center">No.</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Kota</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delte</TableHead>
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
                      <TableCell>
                        <UpdateAddressDialog
                          address={address}
                          onAddressUpdated={refreshAddress}
                        />
                      </TableCell>
                      <TableCell>
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
                    <TableCell colSpan={4} className="text-center py-4">
                      Tidak ada alamat yang tersedia.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      </div>
    </div>
  );
};

export default AddressPage;
