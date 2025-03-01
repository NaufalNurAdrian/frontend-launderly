"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import ModalAddEmployee from "./modaladdemployee";

export default function HeaderEmployee() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className=" flex w-full justify-between p-4 gap-4 mt-3">
      <div>
        <Input placeholder="Search employee" />
      </div>
      <div>
        <button 
          onClick={() => setModalOpen(true)}
          className=" bg-blue text-white px-3 py-1 rounded-md w-36"
        >
          Add Employee
        </button>

        {isModalOpen && (
          <ModalAddEmployee onClose={() => setModalOpen(false)} />
        )}
      </div>
    </div>
  );
}