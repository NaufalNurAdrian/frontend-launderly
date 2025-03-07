"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/feat-1/table";
import { getUserAddresses } from "@/app/api/address";
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
  const [addresses, setAddresses] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAddress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserAddresses();
      setAddresses(data.addresses || []);
    } catch (err) {
      setError("Failed to fetch addresses. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchUserAddress();
    }
  }, [fetchUserAddress]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CustomerSidebar />

      {/* Konten Utama */}
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            My Address <span>🏠</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            View, create, and edit your address here.
          </p>
        </div>

        {/* Create Address Button */}
        <div className="w-full max-w-[800px] flex justify-end">
          <CreateAddressDialog onAddressCreated={fetchUserAddress} />
        </div>

        {/* Tabel Alamat */}
        <div className="w-full max-w-[800px]">
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white">
            {loading ? (
              <div className="p-6 flex justify-center">
                <span className="animate-spin h-6 w-6 border-t-2 border-blue-500 rounded-full"></span>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">
                {error}
                <button
                  onClick={fetchUserAddress}
                  className="ml-2 text-blue-500 underline"
                >
                  Retry
                </button>
              </div>
            ) : addresses.length > 0 ? (
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100 text-xs md:text-sm text-gray-700">
                    <TableHead className="text-center w-16">No.</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead className="text-center">Edit</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addresses.map((address, index) => (
                    <TableRow
                      key={address.id}
                      className="hover:bg-gray-50 text-xs md:text-sm"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>{address.addressLine}</TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell className="text-center">
                        <UpdateAddressDialog
                          address={address}
                          onAddressUpdated={fetchUserAddress}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DeleteAddressDialog
                          addressId={address.id}
                          addressName={address.addressLine}
                          onAddressDeleted={fetchUserAddress}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-6 text-gray-500">
                No addresses available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
