"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import ModalCreateOutlet from "./modalcreateoutlet";


export default function HeaderOutlet() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex w-full justify-between p-4 gap-4 mt-3">
      <div>
        <Input placeholder="Search Outlet" />
      </div>
      <div>
        <button 
          onClick={() => setModalOpen(true)}
          className="container bg-blue text-white px-4 py-1 rounded-md w-36"
        >
          Create Outlet
        </button>

        {isModalOpen && (
          <ModalCreateOutlet onClose={() => setModalOpen(false)} />
        )}
      </div>
    </div>
  );
}