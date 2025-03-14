"use client";

import { useState, useEffect } from "react";
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
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import api from "@/libs/api";
import {
  MdOutlineLocationOn,
  MdOutlineStorefront,
  MdOutlineClose,
  MdOutlineApartment,
  MdOutlineLocationCity,
} from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Loader2 } from "lucide-react";

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
  onSuccess
}: {
  onClose: () => void;
  onSuccess?: () => void; // Add this prop
}) {
  const [position, setPosition] = useState<[number, number]>([
    -6.2088, 106.8456,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle modal close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Handle click outside to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

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
        setIsSubmitting(true);
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

        toast.success("Success Create Outlet")

        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }

        onClose();
      } catch (error: any) {
        console.error("Error submitting form: ", error);
        toast.error(error);
      } finally {
        setIsSubmitting(false);
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
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto max-h-screen"
        onClick={handleOverlayClick}
      >
        <Card className="w-full max-w-[550px] mx-auto shadow-xl animate-in fade-in-50 duration-300 border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MdOutlineStorefront className="h-6 w-6 text-blue-200" />
                <CardTitle className="text-xl font-bold">
                  Create New Outlet
                </CardTitle>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors duration-200"
                aria-label="Close modal"
              >
                <MdOutlineClose className="h-5 w-5" />
              </button>
            </div>
            <CardDescription className="text-blue-100 mt-1">
              Fill in the details below to add a new outlet to your network
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-5">
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <MdOutlineStorefront className="h-4 w-4 text-blue-500" />
                  Outlet Name
                </Label>
                <Input
                  id="name"
                  {...formik.getFieldProps("name")}
                  className={`${
                    formik.errors.name && formik.touched.name
                      ? "border-red-300 focus-visible:ring-red-300"
                      : "focus-visible:ring-blue-300"
                  }`}
                  placeholder="Enter outlet name"
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="type"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <MdOutlineApartment className="h-4 w-4 text-blue-500" />
                  Outlet Type
                </Label>
                <Select
                  value={formik.values.type}
                  onValueChange={(value: string) =>
                    formik.setFieldValue("type", value)
                  }
                >
                  <SelectTrigger
                    className={`${
                      formik.errors.type && formik.touched.type
                        ? "border-red-300 ring-red-100"
                        : "focus:ring-blue-200"
                    }`}
                  >
                    <SelectValue placeholder="Select outlet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAIN">Main Branch</SelectItem>
                    <SelectItem value="BRANCH">Sub Branch</SelectItem>
                  </SelectContent>
                </Select>
                {formik.errors.type && formik.touched.type && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.type}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-1.5 text-gray-700">
                    <MdOutlineLocationOn className="h-4 w-4 text-blue-500" />
                    Location
                  </Label>
                  <div className="flex items-center text-xs text-blue-600">
                    <HiOutlineLocationMarker className="h-3.5 w-3.5 mr-1" />
                    Click on map to set location
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <MapContainer
                    center={[
                      formik.values.latitude || 0,
                      formik.values.longitude || 0,
                    ]}
                    zoom={13}
                    style={{ height: "250px", width: "100%" }}
                    className="z-0"
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
                          <span className="text-sm font-medium">
                            Store Location
                          </span>
                        </Popup>
                      </Marker>
                    )}
                    <MapClickHandler />
                  </MapContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="latitude" className="text-xs text-gray-600">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    {...formik.getFieldProps("latitude")}
                    className={`${
                      formik.errors.latitude && formik.touched.latitude
                        ? "border-red-300"
                        : ""
                    } text-sm`}
                  />
                  {formik.errors.latitude && formik.touched.latitude && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.latitude}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="longitude" className="text-xs text-gray-600">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    {...formik.getFieldProps("longitude")}
                    className={`${
                      formik.errors.longitude && formik.touched.longitude
                        ? "border-red-300"
                        : ""
                    } text-sm`}
                  />
                  {formik.errors.longitude && formik.touched.longitude && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.longitude}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="addressline"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <MdOutlineLocationOn className="h-4 w-4 text-blue-500" />
                  Address Line
                </Label>
                <Input
                  id="addressline"
                  {...formik.getFieldProps("addressline")}
                  className={`${
                    formik.errors.addressline && formik.touched.addressline
                      ? "border-red-300"
                      : ""
                  }`}
                  placeholder="Enter street address"
                />
                {formik.errors.addressline && formik.touched.addressline && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.addressline}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="city"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <MdOutlineLocationCity className="h-4 w-4 text-blue-500" />
                  City
                </Label>
                <Input
                  id="city"
                  {...formik.getFieldProps("city")}
                  className={`${
                    formik.errors.city && formik.touched.city
                      ? "border-red-300"
                      : ""
                  }`}
                  placeholder="Enter city name"
                />
                {formik.errors.city && formik.touched.city && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.city}
                  </p>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 p-6 pt-2 bg-gray-50 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Outlet"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
  );
}
