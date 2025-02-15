'use client';

import FormCheckBox from '@/components/FormCheckBock';
import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ValidationSchema } from '../validationSchema';

const CardMap = dynamic(() => import('@/components/CardMap'), { ssr: false });

interface FormUpdateAddress {
  addressLine: string;
  city: string;
  latitude: string;
  longitude: string;
  isPrimary?: boolean;
}

interface FormEditAddressProps {
  isLoading: boolean;
  onSubmit: (data: FormUpdateAddress) => void;
  initialValues: FormUpdateAddress;
}

const FormUpdateAddress: FC<FormEditAddressProps> = ({
  initialValues,
  isLoading,
  onSubmit,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<any>();
  const [locationData, setLocationData] = useState({});

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const form = useForm<z.infer<typeof ValidationSchema>>({
    mode: 'all',
    resolver: zodResolver(ValidationSchema),
    defaultValues: initialValues,
  });

  const onLocationSelect = (location: any) => {
    setLocationData(location);
    form.setValue('addressLine', location.addressLine);
    form.setValue('city', location.city);
    form.setValue('latitude', String(location.latitude));
    form.setValue('longitude', String(location.longitude));
    form.setValue('isPrimary', Boolean(location.isPrimary));
  };

  const errors = form.formState.errors;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="w-full flex flex-col gap-3">
          <FormInput
            name="addressLine"
            type="text"
            label="Your Address"
            placeholder="Your Address"
            form={form}
          />

          <FormInput
            name="city"
            type="text"
            label="City"
            placeholder="City"
            form={form}
          />

          <FormInput
            name="latitude"
            type="text"
            label="Latitude"
            placeholder="Latitude"
            form={form}
          />

          <FormInput
            name="longitude"
            type="text"
            label="longitude"
            placeholder="longitude"
            form={form}
          />

          <FormCheckBox form={form} name="isPrimary" />
          <CardMap onLocationSelect={onLocationSelect} />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-white outline mt-3 outline-teal-800 text-mythemes-maingreen font-bold hover:bg-mythemes-maingreen hover:text-white"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default FormUpdateAddress;