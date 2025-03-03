"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import axios from "axios";
import { getOutletById, updateOutlet } from "@/services/outletService";
import { OutletById } from "@/types/outlet.type";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@/types/address.type";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// React Leaflet imports
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { toast } from "react-toastify";

// Configure default Leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// MapClickHandler component with reverse geocoding
function MapClickHandler({ setFieldValue }: { setFieldValue: (field: string, value: any) => void }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      // Update coordinates in form
      setFieldValue("address.latitude", lat.toString());
      setFieldValue("address.longitude", lng.toString());
      try {
        // Reverse geocoding using Nominatim API
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const address = (response.data as { address: { road?: string; neighbourhood?: string; city?: string; town?: string } }).address;
        // Update addressLine and city fields based on response
        setFieldValue("address.addressLine", address.road || address.neighbourhood || "Unknown Street");
        setFieldValue("address.city", address.city || address.town || "Unknown City");
      } catch (error) {
        console.error("Geocoding error: ", error);
      }
    },
  });
  return null;
}

export default function EditOutletPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enabledFields, setEnabledFields] = useState({
    outletName: false,
    outletType: false,
    address: false,
    location: false
  });
  
  // Original outlet data from the API
  const [originalData, setOriginalData] = useState<OutletById | null>(null);
  
  // Form initial values
  const [initialValues, setInitialValues] = useState({
    outletName: "",
    outletType: "BRANCH" as "BRANCH" | "MAIN",
    address: {
      addressLine: "",
      city: "",
      latitude: 0,
      longitude: 0,
    } as Partial<Address>,
  });

  const router = useRouter();

  // Validation schema with Yup - Now all fields are conditional based on the enabled state
  const validationSchema = Yup.object({
    outletName: Yup.string().when('$enabledFields.outletName', {
      is: true,
      then: (schema) => schema.required("Nama outlet harus diisi"),
      otherwise: (schema) => schema
    }),
    outletType: Yup.string().when('$enabledFields.outletType', {
      is: true,
      then: (schema) => schema.oneOf(["MAIN", "BRANCH"], "Tipe tidak valid").required("Tipe outlet harus dipilih"),
      otherwise: (schema) => schema
    }),
    address: Yup.object().when('$enabledFields.address', {
      is: true,
      then: (schema) => Yup.object({
        addressLine: Yup.string().required("Alamat harus diisi"),
        city: Yup.string().required("Kota harus diisi"),
      }),
      otherwise: (schema) => schema
    }).when('$enabledFields.location', {
      is: true,
      then: (schema) => Yup.object({
        latitude: Yup.number()
          .typeError("Harus berupa angka")
          .required("Latitude harus diisi"),
        longitude: Yup.number()
          .typeError("Harus berupa angka")
          .required("Longitude harus diisi"),
      }),
      otherwise: (schema) => schema
    }),
  });

  // Fetch outlet data from API and set initial form values
  useEffect(() => {
    const loadData = async () => {
      try {
        const data: OutletById = await getOutletById(Number(params.id));
        setOriginalData(data);
        
        if (data.outlet) {
          setInitialValues({
            outletName: data.outlet.outletName,
            outletType: data.outlet.outletType as "BRANCH" | "MAIN",
            address: {
              addressLine: data.outlet.address[0]?.addressLine || "",
              city: data.outlet.address[0]?.city || "",
              latitude: data.outlet.address[0]?.latitude || 0,
              longitude: data.outlet.address[0]?.longitude || 0,
            },
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil data outlet");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  // Submit function: send data to updateOutlet API
  const handleSubmit = async (values: typeof initialValues) => {
    // Create payload based on enabled fields only
    const payload: any = {
      id: params.id,
    };
    
    // Only include fields that are enabled
    if (enabledFields.outletName) {
      payload.outletName = values.outletName;
    }
    
    if (enabledFields.outletType) {
      payload.outletType = values.outletType;
    }
    
    // Handle address fields
    if (enabledFields.address || enabledFields.location) {
      payload.address = {} as Partial<Address>;
      
      if (enabledFields.address) {
        payload.address.addressLine = values.address.addressLine;
        payload.address.city = values.address.city;
      }
      
      if (enabledFields.location) {
        payload.address.latitude = Number(values.address.latitude);
        payload.address.longitude = Number(values.address.longitude);
      }
    }
  
    console.log("Data yang dikirim ke backend:", payload);
  
    try {
      setLoading(true);
      await updateOutlet(payload);
      toast.success("Outlet berhasil diperbarui");
      router.push("/dashboard/outlet");
    } catch (error: any) {
      console.error("Gagal memperbarui outlet:", error);
      setError(error instanceof Error ? error.message : "Gagal memperbarui outlet");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading outlet data...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container px-4 py-6 mx-auto max-w-md">
      <Card className="p-4 shadow-md">
        <h1 className="text-xl font-bold mb-4">Edit Outlet</h1>
        <p className="text-sm text-gray-500 mb-4">Pilih field yang ingin diperbarui</p>
        
        {/* Field Toggles */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="toggle-name" className="cursor-pointer">Nama Outlet</Label>
            <Switch
              id="toggle-name"
              checked={enabledFields.outletName}
              onCheckedChange={(checked) => 
                setEnabledFields({...enabledFields, outletName: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="toggle-type" className="cursor-pointer">Tipe Outlet</Label>
            <Switch
              id="toggle-type"
              checked={enabledFields.outletType}
              onCheckedChange={(checked) => 
                setEnabledFields({...enabledFields, outletType: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="toggle-address" className="cursor-pointer">Alamat</Label>
            <Switch
              id="toggle-address"
              checked={enabledFields.address}
              onCheckedChange={(checked) => 
                setEnabledFields({...enabledFields, address: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="toggle-location" className="cursor-pointer">Lokasi (Peta)</Label>
            <Switch
              id="toggle-location"
              checked={enabledFields.location}
              onCheckedChange={(checked) => 
                setEnabledFields({...enabledFields, location: checked})
              }
            />
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={true}
          validationContext={{ enabledFields }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {/* Outlet Name Section */}
                {enabledFields.outletName && (
                  <AccordionItem value="name">
                    <AccordionTrigger className="text-sm font-medium">Nama Outlet</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <Field as={Input} name="outletName" placeholder="Nama Outlet" />
                        <ErrorMessage name="outletName" component="p" className="text-red-500 text-xs" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Outlet Type Section */}
                {enabledFields.outletType && (
                  <AccordionItem value="type">
                    <AccordionTrigger className="text-sm font-medium">Tipe Outlet</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <Field 
                          as="select" 
                          name="outletType" 
                          className="w-full p-2 border rounded-md text-sm"
                        >
                          <option value="MAIN">Main</option>
                          <option value="BRANCH">Branch</option>
                        </Field>
                        <ErrorMessage name="outletType" component="p" className="text-red-500 text-xs" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Address Fields Section */}
                {enabledFields.address && (
                  <AccordionItem value="address">
                    <AccordionTrigger className="text-sm font-medium">Alamat</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <div>
                          <Label className="text-xs mb-1">Alamat Lengkap</Label>
                          <Field as={Input} name="address.addressLine" placeholder="Alamat Lengkap" />
                          <ErrorMessage name="address.addressLine" component="p" className="text-red-500 text-xs" />
                        </div>
                        <div>
                          <Label className="text-xs mb-1">Kota</Label>
                          <Field as={Input} name="address.city" placeholder="Kota" />
                          <ErrorMessage name="address.city" component="p" className="text-red-500 text-xs" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Map Section */}
                {enabledFields.location && (
                  <AccordionItem value="location">
                    <AccordionTrigger className="text-sm font-medium">Lokasi Peta</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="h-48 w-full rounded-md overflow-hidden border">
                          <MapContainer
                            center={[
                              values.address.latitude ? Number(values.address.latitude) : -6.2088,
                              values.address.longitude ? Number(values.address.longitude) : 106.8456,
                            ]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {values.address.latitude && values.address.longitude && (
                              <Marker
                                position={[
                                  Number(values.address.latitude),
                                  Number(values.address.longitude),
                                ]}
                                icon={new L.Icon.Default()}
                              >
                                <Popup>
                                  <span>Lokasi Outlet</span>
                                </Popup>
                              </Marker>
                            )}
                            <MapClickHandler setFieldValue={setFieldValue} />
                          </MapContainer>
                        </div>
                        
                        <p className="text-xs text-gray-500">Klik pada peta untuk menentukan lokasi</p>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Latitude</Label>
                            <Field
                              as={Input}
                              type="number"
                              step="any"
                              name="address.latitude"
                              placeholder="Latitude"
                              className="text-sm"
                            />
                            <ErrorMessage name="address.latitude" component="p" className="text-red-500 text-xs" />
                          </div>
                          <div>
                            <Label className="text-xs">Longitude</Label>
                            <Field
                              as={Input}
                              type="number"
                              step="any"
                              name="address.longitude"
                              placeholder="Longitude"
                              className="text-sm"
                            />
                            <ErrorMessage name="address.longitude" component="p" className="text-red-500 text-xs" />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>

              <div className="flex flex-col gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !Object.values(enabledFields).some(v => v)}
                >
                  {isSubmitting ? "Memperbarui..." : "Simpan Perubahan"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => router.push("/dashboard/outlet")}
                >
                  Kembali
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}