'use client';

import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import FormAddress from './FormAddAddress';
import { Separator } from '@radix-ui/react-separator';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/feat-1/ui/sheet';

const AddAddress = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen}>
        <SheetTitle></SheetTitle>
        <SheetTrigger onClick={() => setIsOpen(true)}>Add Address</SheetTrigger>
        <SheetContent className="py-8 w-full">
          <div className="flex flex-col gap-4  ">
            <div className="flex  relative">
              <ChevronLeft
                className="absolute"
                onClick={() => setIsOpen(false)}
              />
              <div className=" flex justify-between w-full">
                <h1 className=" font-extrabold ml-8">Add Address</h1>
              </div>
            </div>
            <Separator />
            <div>
              <FormAddress />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AddAddress;