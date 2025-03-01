"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/feat-1/dialog";
import { FiTrash } from "react-icons/fi";
import { Button } from "@/components/feat-1/button";
import { deleteUserAddress } from "@/api/address";
import { toast } from "react-toastify";

interface DeleteDialogProps {
  addressId: number;
  addressName: string;
  onAddressDeleted: () => void;
}

const DeleteAddressDialog: React.FC<DeleteDialogProps> = ({
  addressId,
  addressName,
  onAddressDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in again.");
      return;
    }

    setIsDeleting(true);

    try {
      await deleteUserAddress(addressId);
      toast.success(`Address "${addressName}" deleted successfully`);
      onAddressDeleted(); // Refresh daftar alamat
      setIsDialogOpen(false); // Tutup dialog
    } catch (error) {
      toast.error(`Failed to delete address: ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <FiTrash
          className="cursor-pointer text-red-500 hover:text-red-700"
          title="Delete"
        />
      </DialogTrigger>
      <DialogContent className="w-[380px] md:w-max">
        <DialogHeader>
          <DialogTitle>Hapus Alamat</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus alamat{" "}
            <span className="font-bold">{addressName}</span>? Tindakan ini tidak
            dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mt-6 space-x-4">
          <Button
            onClick={() => setIsDialogOpen(false)}
            variant="secondary"
            className="px-6 py-2"
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="px-6 py-2"
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAddressDialog;
