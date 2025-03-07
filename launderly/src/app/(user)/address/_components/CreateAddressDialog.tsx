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
import { Input } from "@/components/feat-1/input";
import { createUserAddress } from "@/app/api/address";
import { AddressSchema } from "@/libs/schema";
import { toast } from "react-toastify";
import useSession from "@/hooks/useSession";
import "leaflet/dist/leaflet.css";
import { customIcon } from "@/components/feat-1/customIcon";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useMapEvents, useMap } from "react-leaflet";

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

interface LocationMarkerProps {
  setFieldValue: (field: string, value: string | number) => void;
  userLocation: { lat: number; lng: number };
}

interface CreateAddressDialogProps {
  onAddressCreated: () => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  setFieldValue,
  userLocation,
}) => {
  useMapEvents({
    click(e) {
      setFieldValue("latitude", e.latlng.lat);
      setFieldValue("longitude", e.latlng.lng);
    },
  });

  const map = useMap();

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [userLocation.lat, userLocation.lng]);

  return (
    <Marker position={[userLocation.lat, userLocation.lng]} icon={customIcon} />
  );
};

const CreateAddressDialog: React.FC<CreateAddressDialogProps> = ({
  onAddressCreated,
}) => {
  const { user } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: -6.9203,
    lng: 107.6074,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
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
  }, []);

  const handleUseCurrentLocation = (
    setFieldValue: (field: string, value: string | number) => void
  ) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setFieldValue("latitude", position.coords.latitude);
          setFieldValue("longitude", position.coords.longitude);
          setUserLocation(newLocation);
          toast.success("Lokasi berhasil diperoleh!");
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error("Akses lokasi ditolak. Izinkan lokasi di browser.");
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error("Informasi lokasi tidak tersedia.");
              break;
            case error.TIMEOUT:
              toast.error("Permintaan lokasi melebihi batas waktu.");
              break;
            default:
              toast.error("Terjadi kesalahan saat mendapatkan lokasi.");
          }
          console.error("Error getting location: ", error);
        }
      );
    } else {
      toast.error("Geolocation tidak didukung di perangkat ini.");
    }
  };

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
        toast.success("Address successfully added");
        onAddressCreated();
        resetForm();
        setIsDialogOpen(false);
      }
    } catch (error: unknown) {
      toast.error("Failed to add address.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isClient) return <p>Loading...</p>;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-2 rounded-lg shadow">Add New Address</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
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
              <div>
                <label className="block text-sm font-medium">
                  Name Address <span className="text-red-500">*</span>
                </label>
                <Field
                  as={Input}
                  name="street"
                  placeholder="Enter Name Address ex: My House"
                  className="w-full"
                />
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
              {/* Map */}
              <div>
                <label className="block text-sm font-medium">
                  Select Location
                </label>
                <div className="h-[250px] w-full">
                  <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={13}
                    className="h-full w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker
                      setFieldValue={setFieldValue}
                      userLocation={userLocation}
                    />
                    <Marker
                      position={[values.latitude, values.longitude]}
                      icon={customIcon}
                    />
                  </MapContainer>
                </div>
              </div>

              {/* Button: Use Current Location */}
              <Button
                type="button"
                className="w-full bg-blue-500 text-white text-center"
                onClick={() => handleUseCurrentLocation(setFieldValue)}
              >
                Gunakan Lokasi Anda Saat Ini
              </Button>

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

              {/* Buttons: Cancel & Submit */}
              <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="default"
                  className="w-full sm:w-auto"
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
