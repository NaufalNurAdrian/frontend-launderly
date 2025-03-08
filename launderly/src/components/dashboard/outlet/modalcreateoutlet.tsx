"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import Swal from "sweetalert2";
import api from "@/libs/api";

// Replace the existing icon configuration with this:
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Interface for response OpenStreetMap
interface NominatimResponse {
  address: {
    road?: string;
    city?: string;
    town?: string;
    [key: string]: any;
  };
}

export default function ModalCreateOutlet({
  onClose,
}: {
  onClose: () => void;
}) {
  const [position, setPosition] = useState<[number, number]>([
    -6.2088, 106.8456,
  ]);

  // Fetch address from coordinates
  async function fetchAddress(lat: number, lng: number) {
    try {
      const response = await axios.get<NominatimResponse>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const address = response.data.address;
      formik.setFieldValue("addressline", address.road || "Unknown Street");
      formik.setFieldValue(
        "city",
        address.city || address.town || "Unknown City"
      );
    } catch (error) {
      console.error("Geocoding error: ", error);
    }
  }

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      latitude: -6.914744,
      longitude: 107.60981,
      addressline: "",
      city: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Outlet name is required"),
      type: Yup.string().required("Outlet type is required"),
      latitude: Yup.string()
        .required("Latitude is required")
        .test(
          "is-number",
          "Must be a valid number",
          (value) => !isNaN(Number(value))
        ),
      longitude: Yup.string()
        .required("Longitude is required")
        .test(
          "is-number",
          "Must be a valid number",
          (value) => !isNaN(Number(value))
        ),
      addressline: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
    }),
    onSubmit: async (values) => {
      try {
        await api.post("/outlet/create", {
          outletName: values.name,
          outletType: values.type,
          address: [
            {
              addressLine: values.addressline,
              city: values.city,
              latitude: Number(values.latitude),
              longitude: Number(values.longitude),
            },
          ],
        });

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Outlet created successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        onClose();
      } catch (error) {
        console.error("Error submitting form: ", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to create outlet",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
      }
    },
  });

  // Map click handler
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        formik.setFieldValue("latitude", lat.toString());
        formik.setFieldValue("longitude", lng.toString());
        fetchAddress(lat, lng);
      },
    });
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[90vw] max-w-[500px] mx-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Create Outlet</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>
          <CardDescription>Create your new outlet in one-click</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Outlet Name</Label>
              <Input id="name" {...formik.getFieldProps("name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formik.values.type}
                onValueChange={(value: string) =>
                  formik.setFieldValue("type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outlet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAIN">Main</SelectItem>
                  <SelectItem value="BRANCH">Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <MapContainer
                center={[
                  formik.values.latitude || 0,
                  formik.values.longitude || 0,
                ]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {formik.values.latitude && formik.values.longitude && (
                  <Marker
                    position={[
                      Number(formik.values.latitude),
                      Number(formik.values.longitude),
                    ]}
                    icon={new L.Icon.Default()}
                  >
                    <Popup>
                      <span>Store Location</span>
                    </Popup>
                  </Marker>
                )}
                <MapClickHandler /> {/* Add this component */}
              </MapContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" {...formik.getFieldProps("latitude")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" {...formik.getFieldProps("longitude")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressline">Address Line</Label>
              <Input
                id="addressline"
                {...formik.getFieldProps("addressline")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...formik.getFieldProps("city")} />
            </div>

            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-500">
                Submit
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
