"use client"

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/feat-1/dialog";
import { Button } from "@/components/feat-1/button";
import { Input } from "@/components/feat-1/input";
import { updateUserAddress } from "@/app/api/address";
import { AddressSchema } from "@/libs/schema";
import { toast } from "react-toastify";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { customIcon } from "@/components/feat-1/customIcon";
import { Edit2 } from "lucide-react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

interface AddressFormValues {
  street: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface UpdateAddressDialogProps {
  address: {
    id: number;
    addressLine: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  onAddressUpdated: () => void;
}

const UpdateAddressDialog: React.FC<UpdateAddressDialogProps> = ({
  address,
  onAddressUpdated,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<AddressFormValues>({
    street: address.addressLine,
    city: address.city,
    latitude: address.latitude,
    longitude: address.longitude,
  });

  useEffect(() => {
    if (isDialogOpen) {
      setFormValues({
        street: address.addressLine,
        city: address.city,
        latitude: address.latitude,
        longitude: address.longitude,
      });
    }
  }, [isDialogOpen, address]);

  const LocationMarker = ({
    setFieldValue,
  }: {
    setFieldValue: (field: string, value: string | number) => void;
  }) => {
    useMapEvents({
      click(e) {
        setFieldValue("latitude", e.latlng.lat);
        setFieldValue("longitude", e.latlng.lng);
      },
    });

    return (
      <Marker
        position={[formValues.latitude, formValues.longitude]}
        icon={customIcon}
      />
    );
  };

  const handleSubmit = async (
    values: AddressFormValues,
    { setSubmitting }: FormikHelpers<AddressFormValues>
  ) => {
    try {
      const payload = {
        addressLine: values.street,
        city: values.city,
        latitude: values.latitude,
        longitude: values.longitude,
      };

      await updateUserAddress(address.id, payload);

      toast.success("Address successfully updated!");
      onAddressUpdated();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update address.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Edit2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] md:w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit Address
          </DialogTitle>
          <DialogDescription className="text-sm">
            Update your address details.{" "}
            <span className="text-red-500 font-bold">*</span> is required.
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={formValues}
          validationSchema={AddressSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <Field as={Input} name="street" className="w-full" />
                <ErrorMessage
                  name="street"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <Field as={Input} name="city" className="w-full" />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Select Location
                </label>
                <MapContainer
                  center={[values.latitude, values.longitude]}
                  zoom={13}
                  style={{ height: "250px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker setFieldValue={setFieldValue} />
                  <Marker
                    position={[values.latitude, values.longitude]}
                    icon={customIcon}
                  />
                </MapContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Latitude</label>
                  <Field
                    as={Input}
                    name="latitude"
                    className="w-full"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Longitude</label>
                  <Field
                    as={Input}
                    name="longitude"
                    className="w-full"
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  variant="destructive"
                  className="px-6 py-2 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg shadow"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAddressDialog;
