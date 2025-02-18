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
import { createRequestOrder, getOutletNearby } from "@/api/order";
import { toast } from "react-toastify";
import useSession from "@/hooks/useSession";
import { getUserAddresses } from "@/api/address";
import { calculateDistance } from "@/helpers/calculateDistance";
import { IRequestOrderForm } from "@/types/request";

interface AddressResult {
  id: number;
  addressLine: string;
  city: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
}

interface OutletResult {
  id: number;
  outletName: string;
  outletType: string;
  address: AddressResult[];
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
  const [outlets, setOutlets] = useState<OutletResult[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(
    null
  );
  const [selectedOutlet, setSelectedOutlet] = useState<OutletResult | null>(
    null
  );
  const [computedDistance, setComputedDistance] = useState<number>(0);

  // Fetch alamat user ketika modal dibuka
  useEffect(() => {
    if (isDialogOpen) {
      getUserAddresses()
        .then((data) => {
          if (Array.isArray(data)) {
            setAddresses(data);
          } else if (Array.isArray(data.addresses)) {
            setAddresses(data.addresses);
          } else {
            throw new Error("Unexpected data format");
          }
        })
        .catch(() => {
          toast.error("Failed to fetch addresses");
        });
    }
  }, [isDialogOpen]);

  // Fetch outlet setelah user memilih alamat
  const fetchNearbyOutlets = async (address: AddressResult) => {
    try {
      const data = await getOutletNearby(address.latitude, address.longitude);
      setOutlets(data.nearbyOutlets);
    } catch (error) {
      toast.error("Failed to fetch nearby outlets");
    }
  };

  // Perlu memasukkan setFieldValue sebagai parameter
  const handleAddressChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const addressId = parseInt(event.target.value);
    const selected = addresses.find((addr) => addr.id === addressId) || null;
    setSelectedAddress(selected);
    setSelectedOutlet(null);
    setFieldValue("addressId", selected ? selected.id : 0);
    if (selected) {
      fetchNearbyOutlets(selected);
    }
  };

  const handleOutletSelect = (outlet: OutletResult) => {
    setSelectedOutlet(outlet);
    if (selectedAddress && outlet.address[0]) {
      const dist = calculateDistance(
        selectedAddress.latitude,
        selectedAddress.longitude,
        outlet.address[0].latitude,
        outlet.address[0].longitude
      );
      setComputedDistance(dist);
    }
  };

  const handleSubmit = async (
    values: IRequestOrderForm,
    { setSubmitting, resetForm }: FormikHelpers<IRequestOrderForm>
  ) => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }
    if (!selectedOutlet) {
      toast.error("Please select an outlet.");
      return;
    }
    try {
      const result = await createRequestOrder({
        userId: user?.id!,
        userAddressId: selectedAddress.id,
        outletId: selectedOutlet.id,
        distance: computedDistance,
      });
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
        <Button onClick={() => setIsDialogOpen(true)}>
          Create Request Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Request Order</DialogTitle>
          <DialogDescription>
            Select your address and nearby outlets
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            userId: user?.id!,
            userAddressId: 0,
            outletId: 0,
            distance: 0,
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Pilih alamat */}
              <div>
                <label
                  htmlFor=" userAddressId"
                  className="block text-sm font-medium"
                >
                  Select Address
                </label>
                <Field
                  as="select"
                  name=" userAddressId"
                  id=" userAddressId"
                  className="mt-1 block w-full border p-2 rounded bg-white"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleAddressChange(e, setFieldValue)
                  }
                  value={selectedAddress?.id || ""}
                >
                  <option value="">-- Select Address --</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.addressLine}, {address.city}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Tampilkan outlet dalam radius 5km */}
              {selectedAddress &&
              Array.isArray(outlets) &&
              outlets.length > 0 ? (
                <ul className="mt-2 p-2 border rounded">
                  <p>Our Outlet</p>
                  {outlets.map((outlet) => (
                    <label
                      key={outlet.id}
                      className="block p-2 border-b last:border-b-0 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="selectedOutlet"
                        value={outlet.id}
                        onChange={() => handleOutletSelect(outlet)}
                        checked={selectedOutlet?.id === outlet.id}
                      />
                      {outlet.outletName} ({outlet.outletType})
                    </label>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No outlets available within 5km.
                </p>
              )}

              <Button type="submit" disabled={isSubmitting || !selectedOutlet}>
                {isSubmitting ? "Submitting..." : "Create Request Order"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequestOrderDialog;
