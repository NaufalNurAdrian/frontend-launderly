"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import axios from "axios";
import { deleteOutlet, getOutletById, updateOutlet } from "@/services/outletService";
import { OutletById } from "@/types/outlet.type";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@/types/address.type";
import { Switch } from "@/components/ui/switch";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  MapPin, 
  Edit, 
  Save, 
  Trash2, 
  ArrowLeft, 
  Store, 
  MapIcon, 
  AlertTriangle,
  CheckCircle2,
  X
} from "lucide-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { toast } from "react-toastify";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'pulse-marker',
});

function MapClickHandler({ setFieldValue }: { setFieldValue: (field: string, value: any) => void }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setFieldValue("address.latitude", lat.toString());
      setFieldValue("address.longitude", lng.toString());
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const address = (response.data as { address: { road?: string; neighbourhood?: string; city?: string; town?: string } }).address;
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
  
  const [originalData, setOriginalData] = useState<OutletById | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
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

  const handleSubmit = async (values: typeof initialValues) => {
    const payload: any = {
      id: params.id,
    };
    
    if (enabledFields.outletName) {
      payload.outletName = values.outletName;
    }
    
    if (enabledFields.outletType) {
      payload.outletType = values.outletType;
    }
    
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

    try {
      setLoading(true);
      await updateOutlet(payload);
      setSuccessMessage("Outlet berhasil diperbarui");
      toast.success("Outlet berhasil diperbarui");
      
      setTimeout(() => {
        router.push("/dashboard/outlet");
      }, 1500);
    } catch (error: any) {
      console.error("Gagal memperbarui outlet:", error);
      setError(error instanceof Error ? error.message : "Gagal memperbarui outlet");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteOutlet({ id: params.id });
      setSuccessMessage("Outlet berhasil dihapus");
      toast.success("Outlet berhasil dihapus");
      
      setTimeout(() => {
        router.push("/dashboard/outlet");
      }, 1500);
    } catch (error: any) {
      console.error("Gagal delete outlet:", error);
      setError(error instanceof Error ? error.message : "Gagal delete outlet");
      toast.error(error.message || "Gagal delete outlet");
    } finally {
      setLoading(false);
      setAlertOpen(false); 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-400 rounded-full mb-4 flex items-center justify-center">
            <Store className="h-8 w-8 text-white animate-bounce" />
          </div>
          <div className="h-5 w-48 bg-blue-200 rounded mb-2"></div>
          <div className="h-4 w-36 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !successMessage) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-700">Error</CardTitle>
            </div>
            <CardDescription className="text-red-600">
              We encountered a problem while loading the outlet data
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/dashboard/outlet")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Outlets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <CardTitle className="text-green-700">Success</CardTitle>
            </div>
            <CardDescription className="text-green-600">
              {successMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-green-600 mb-4">Redirecting you back to the outlet list...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full animate-progress"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pb-6">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Outlet
              </CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                {initialValues.outletName} • ID: {params.id}
              </CardDescription>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs font-normal bg-white/10 text-white border-white/20">
                  {initialValues.outletType}
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-blue-400 hover:bg-opacity-20"
              onClick={() => router.push("/dashboard/outlet")}
              aria-label="Back to outlets"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Pilih field yang ingin diperbarui</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="toggle-name" className="cursor-pointer text-sm font-medium">Nama Outlet</Label>
                  </div>
                  <Switch
                    id="toggle-name"
                    checked={enabledFields.outletName}
                    onCheckedChange={(checked) => 
                      setEnabledFields({...enabledFields, outletName: checked})
                    }
                  />
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="toggle-type" className="cursor-pointer text-sm font-medium">Tipe Outlet</Label>
                  </div>
                  <Switch
                    id="toggle-type"
                    checked={enabledFields.outletType}
                    onCheckedChange={(checked) => 
                      setEnabledFields({...enabledFields, outletType: checked})
                    }
                  />
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="toggle-address" className="cursor-pointer text-sm font-medium">Alamat</Label>
                  </div>
                  <Switch
                    id="toggle-address"
                    checked={enabledFields.address}
                    onCheckedChange={(checked) => 
                      setEnabledFields({...enabledFields, address: checked})
                    }
                  />
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="toggle-location" className="cursor-pointer text-sm font-medium">Lokasi (Peta)</Label>
                  </div>
                  <Switch
                    id="toggle-location"
                    checked={enabledFields.location}
                    onCheckedChange={(checked) => 
                      setEnabledFields({...enabledFields, location: checked})
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

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
              <Form className="space-y-6">
                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full" 
                  defaultValue={
                    Object.entries(enabledFields).find(([_, value]) => value)?.[0]
                  }
                >
                  {enabledFields.outletName && (
                    <AccordionItem value="outletName" className="border border-gray-100 rounded-lg mb-3 shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-t-lg">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Store className="w-4 h-4 text-blue-500" />
                          <span>Nama Outlet</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-2">
                          <div className="relative">
                            <Field 
                              as={Input} 
                              name="outletName" 
                              placeholder="Nama Outlet" 
                              className="pl-8 focus-visible:ring-blue-500"
                            />
                            <Store className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                          </div>
                          <ErrorMessage name="outletName" component="p" className="text-red-500 text-xs" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {enabledFields.outletType && (
                    <AccordionItem value="outletType" className="border border-gray-100 rounded-lg mb-3 shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-t-lg">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span>Tipe Outlet</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-2">
                          <div className="relative">
                            <Field 
                              as="select" 
                              name="outletType" 
                              className="w-full pl-8 h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-blue-500"
                            >
                              <option value="MAIN">Main</option>
                              <option value="BRANCH">Branch</option>
                            </Field>
                            <Building2 className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                          </div>
                          <ErrorMessage name="outletType" component="p" className="text-red-500 text-xs" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {enabledFields.address && (
                    <AccordionItem value="address" className="border border-gray-100 rounded-lg mb-3 shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-t-lg">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>Alamat</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs mb-1 text-gray-600">Alamat Lengkap</Label>
                            <div className="relative">
                              <Field 
                                as={Input} 
                                name="address.addressLine" 
                                placeholder="Alamat Lengkap" 
                                className="pl-8 focus-visible:ring-blue-500"
                              />
                              <MapPin className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                            </div>
                            <ErrorMessage name="address.addressLine" component="p" className="text-red-500 text-xs mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs mb-1 text-gray-600">Kota</Label>
                            <div className="relative">
                              <Field 
                                as={Input} 
                                name="address.city" 
                                placeholder="Kota" 
                                className="pl-8 focus-visible:ring-blue-500"
                              />
                              <Building2 className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                            </div>
                            <ErrorMessage name="address.city" component="p" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {enabledFields.location && (
                    <AccordionItem value="location" className="border border-gray-100 rounded-lg mb-3 shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-t-lg">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MapIcon className="w-4 h-4 text-blue-500" />
                          <span>Lokasi Peta</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-4">
                          <div className="h-60 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <MapContainer
                              center={[
                                values.address.latitude ? Number(values.address.latitude) : -6.2088,
                                values.address.longitude ? Number(values.address.longitude) : 106.8456,
                              ]}
                              zoom={13}
                              style={{ height: "100%", width: "100%" }}
                              className="z-0"
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
                                  icon={customIcon}
                                >
                                  <Popup>
                                    <span className="font-medium">{values.outletName}</span>
                                    <p className="text-xs mt-1">{values.address.addressLine}</p>
                                  </Popup>
                                </Marker>
                              )}
                              <MapClickHandler setFieldValue={setFieldValue} />
                            </MapContainer>
                          </div>
                          
                          <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-50 rounded-md text-xs text-blue-700">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span>Klik pada peta untuk menentukan lokasi</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs mb-1 text-gray-600">Latitude</Label>
                              <div className="relative">
                                <Field
                                  as={Input}
                                  type="number"
                                  step="any"
                                  name="address.latitude"
                                  placeholder="Latitude"
                                  className="text-sm pl-8 focus-visible:ring-blue-500"
                                />
                                <MapPin className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                              </div>
                              <ErrorMessage name="address.latitude" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs mb-1 text-gray-600">Longitude</Label>
                              <div className="relative">
                                <Field
                                  as={Input}
                                  type="number"
                                  step="any"
                                  name="address.longitude"
                                  placeholder="Longitude"
                                  className="text-sm pl-8 focus-visible:ring-blue-500"
                                />
                                <MapPin className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                              </div>
                              <ErrorMessage name="address.longitude" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>

                <Separator className="my-4" />

                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        type="button"
                        variant="destructive" 
                        className="w-full flex gap-2 items-center"
                        disabled={loading || isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Outlet
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah anda yakin ingin menghapus outlet ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button 
                    type="submit" 
                    className="w-full flex gap-2 items-center" 
                    disabled={isSubmitting || !Object.values(enabledFields).some(v => v)}
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex gap-2 items-center" 
                    onClick={() => router.push("/dashboard/outlet")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}