'use client';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useGetAddressById from '@/hooks/api/address/useGetAddressById';
import useUpdateUserAddress from '@/hooks/api/user/useUpdateUserAddress';
import { ChevronLeft } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import FormUpdateAddress from './FormUpdateAddress';
import { getChangedValues } from '@/utils/getChangeValues';
import Image from 'next/image';
import logo1 from '../../../../../../public/Black Friday Typography Instagram Post.png'

interface UpdateAddressProps {
  addressId: number;
}

interface FormUpdateAddressArgs {
  addressLine: string;
  city: string;
  latitude: string;
  longitude: string;
  isPrimary: boolean;
}

interface AddressResult {
  addressLine: string;
  city: string;
  isPrimary: boolean;
  latitude: string;
  longitude: string;
}

const UpdateAddress: FC<UpdateAddressProps> = ({ addressId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialValues, setInitialValues] = useState<AddressResult | null>(
    null,
  );
  const { address, isLoading, refetch } = useGetAddressById(addressId);
  const { updateUserAddress, isLoading: isLoadingUpdateAddress } =
    useUpdateUserAddress(addressId);

  useEffect(() => {
    if (address) {
      setInitialValues({
        addressLine: address.addressLine,
        city: address.city,
        latitude: String(address.latitude),
        longitude: String(address.longitude),
        isPrimary: address.isPrimary,
      });
    }
  }, [address]);

  const handleOnSubmit = async (values: Partial<FormUpdateAddressArgs>) => {
    const payload = await getChangedValues(values, initialValues!);
    await updateUserAddress(payload);
    refetch();
    setIsOpen(false);
  };

  if (isLoading || !initialValues) {
    return (
      <div className="container flex justify-center px-4 pt-24 text-4xl font-semibold">
         <div className="animate-pulse">
          <Image alt="logo" src={logo1} />
        </div>
      </div>
    );
  }

  return (
    <Sheet open={isOpen}>
      <SheetTrigger
        onClick={() => setIsOpen(true)}
        className="col-span-7 rounded-xl bg-white text-black border hover:ring-mythemes-maingreen hover:ring text-sm p-1 hover:bg-mythemes-grey"
      >
        Edit Address
      </SheetTrigger>
      <SheetContent className="py-8 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex relative">
            <ChevronLeft
              className="absolute"
              onClick={() => setIsOpen(false)}
            />
            <div className="flex justify-between w-full">
              <h1 className="font-extrabold ml-8">Edit Address</h1>
            </div>
          </div>
          <Separator /> 
          <div>
            <FormUpdateAddress
              initialValues={initialValues}
              isLoading={isLoadingUpdateAddress}
              onSubmit={handleOnSubmit}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateAddress;