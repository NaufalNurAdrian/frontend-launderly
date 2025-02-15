"use client";

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
import { createUserAddress } from "@/api/address";
import { AddressSchema } from "@/libs/schema";
import { toast } from "react-toastify";
import useSession from "@/hooks/useSession";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { customIcon } from "@/components/feat-1/customIcon";

interface AddressFormValues {
  street: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface CreateAddressDialogProps {
  onAddressCreated: () => void;
}

const CreateAddressDialog: React.FC<CreateAddressDialogProps> = ({
  onAddressCreated,
}) => {
  const { user } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: -6.9203,
    lng: 107.6074,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location: ", error);
          }
        );
      }
    }
  }, []);

  // Component to capture map click events
  const LocationMarker = ({
    setFieldValue,
  }: {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    useMapEvents({
      click(e) {
        setFieldValue("latitude", e.latlng.lat);
        setFieldValue("longitude", e.latlng.lng);
      },
    });

    return (
      <Marker
        position={[userLocation.lat, userLocation.lng]}
        icon={customIcon}
      />
    );
  };

  // Form submission function
  const handleSubmit = async (
    values: AddressFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AddressFormValues>
  ) => {
    try {
      const payload = {
        addressLine: values.street,
        city: values.city,
        latitude: values.latitude,
        longitude: values.longitude,
        isPrimary: false,
        isDelete: false,
        userId: user?.id,
      };

      const result = await createUserAddress(payload);

      if (result) {
        toast.success(`Address successfully added`);
        onAddressCreated();
        resetForm();
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add address.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-2 rounded-lg shadow bg-teal-200">
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] md:w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold ">
            Add Address
          </DialogTitle>
          <DialogDescription className="text-sm">
            Fill in the required fields to add a new address.{" "}
            <span className="text-red-500 font-bold"> *</span> is required.
          </DialogDescription>
        </DialogHeader>

        <Formik<AddressFormValues>
          initialValues={{
            street: "",
            city: "",
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          }}
          validationSchema={AddressSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4 mt-4">
              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <Field
                  as={Input}
                  name="street"
                  placeholder="Enter street address"
                  className="w-full"
                />
                <ErrorMessage
                  name="street"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <Field
                  as={Input}
                  name="city"
                  placeholder="Enter city"
                  className="w-full"
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Map Location Selection */}
              <div>
                <label className="block text-sm font-medium">
                  Select Location
                </label>
                <MapContainer
                  center={[userLocation.lat, userLocation.lng]}
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

              {/* Latitude & Longitude */}
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

              {/* Submit & Cancel Buttons */}
              <div className="flex justify-end mt-6 space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary" 
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAddressDialog;
