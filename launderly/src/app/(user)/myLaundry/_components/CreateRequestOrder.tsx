"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/feat-1/dialog";
import { Button } from "@/components/feat-1/button";
import { createRequestOrder } from "@/api/order";
import { toast } from "react-toastify";
import useSession from "@/hooks/useSession";
import { getUserAddresses } from "@/api/address";

interface IRequestOrderForm {
  addressId: number;
  latitude?: number;
  longitude?: number;
}

interface AddressResult {
  id: number;
  addressLine: string;
  city: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
}

interface CreateRequestOrderDialogProps {
  onRequestOrderCreated: () => void;
}

const CreateRequestOrderDialog: React.FC<CreateRequestOrderDialogProps> = ({
  onRequestOrderCreated,
}) => {
  const { user } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState<AddressResult[]>([]);

  // Fetch alamat user ketika modal dibuka
  useEffect(() => {
    if (isDialogOpen) {
      getUserAddresses()
        .then((data) => {
          if (Array.isArray(data)) {
            setAddresses(data); // Jika `data` sudah array
          } else if (Array.isArray(data.addresses)) {
            setAddresses(data.addresses); // Jika `data` berbentuk `{ addresses: [...] }`
          } else {
            throw new Error("Unexpected data format");
          }
        })
        .catch(() => {
          toast.error("Failed to fetch addresses");
        });
    }
  }, [isDialogOpen]);

  const handleSubmit = async (
    values: IRequestOrderForm,
    { setSubmitting, resetForm }: FormikHelpers<IRequestOrderForm>
  ) => {
    try {
      const result = await createRequestOrder(values);

      if (result) {
        toast.success("Request order successfully created!");
        onRequestOrderCreated();
        resetForm();
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error("Failed to create request order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-2 rounded-lg shadow bg-teal-200">
          Request Pickup
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Request Pickup
          </DialogTitle>
          <DialogDescription className="text-sm">
            Select your address and confirm your pickup request.
          </DialogDescription>
        </DialogHeader>

        <Formik<IRequestOrderForm>
          initialValues={{
            addressId: 0,
            latitude: undefined,
            longitude: undefined,
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4 mt-4">
              {/* Address Selector */}
              <div>
                <label className="block text-sm font-medium">
                  Select Address <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="addressId"
                  className="w-full p-2 border rounded-md bg-white"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedAddress = addresses.find(
                      (addr) => addr.id === Number(e.target.value)
                    );
                    setFieldValue("addressId", selectedAddress?.id || 0);
                    setFieldValue("latitude", selectedAddress?.latitude);
                    setFieldValue("longitude", selectedAddress?.longitude);
                  }}
                >
                  <option value="">Choose an address</option>
                  {Array.isArray(addresses) && addresses.length > 0 ? (
                    addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.addressLine}, {address.city}
                      </option>
                    ))
                  ) : (
                    <option disabled>No addresses available</option>
                  )}
                </Field>
              </div>

              {/* Latitude & Longitude Display */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Latitude</label>
                  <Field
                    as="input"
                    name="latitude"
                    className="w-full p-2 border rounded-md bg-white"
                    value={values.latitude || ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Longitude</label>
                  <Field
                    as="input"
                    name="longitude"
                    className="w-full p-2 border rounded-md bg-white"
                    value={values.longitude || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="primary">
                  {isSubmitting ? "Submitting..." : "Request Pickup"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequestOrderDialog;
