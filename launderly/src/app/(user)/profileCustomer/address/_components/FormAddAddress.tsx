'use client';
import FormCheckBox from '@/components/FormCheckBock';
import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useUpdateUser from '@/hooks/api/user/useUpdateUser';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ValidationSchema } from '../validationSchema';
import useCreateUserAddress from '@/hooks/api/address/useCreateUserAddress';

const CardMap = dynamic(() => import('@/components/CardMap'), { ssr: false });

const FormAddress = () => {
  const { createUserAddress } = useCreateUserAddress();
  const [locationData, setLocationData] = useState({
    addressLine: '',
    city: '',
    latitude: '',
    longitude: '',
    isPrimary: false,
  });

  const form = useForm<z.infer<typeof ValidationSchema>>({
    mode: 'all',
    resolver: zodResolver(ValidationSchema),
    defaultValues: {
      addressLine: locationData.addressLine,
      city: locationData.city,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      isPrimary: locationData.isPrimary,
    },
  });

  const onLocationSelect = (location: any) => {
    setLocationData(location);
    form.setValue('addressLine', location.addressLine);
    form.setValue('city', location.city);
    form.setValue('latitude', String(location.latitude));
    form.setValue('longitude', String(location.longitude));
    form.setValue('isPrimary', Boolean(location.isPrimary));
  };

  function onSubmit(values: z.infer<typeof ValidationSchema>) {
    createUserAddress(values);
  }

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
          className="bg-white outline mt-3 outline-teal-800 text-mythemes-maingreen font-bold hover:bg-mythemes-maingreen hover:text-white"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default FormAddress;