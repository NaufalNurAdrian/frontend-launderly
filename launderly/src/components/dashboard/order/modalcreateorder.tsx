"use client";

import { useState, useEffect } from "react";
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
import { createOrder } from "@/services/orderService";
import { LaundryItem } from "@/types/laundryItem.type";
import { getItem } from "@/services/itemService";

export default function ModalCreateOrder({
  orderNumber,
  onClose,
}: {
  orderNumber: string;
  onClose: () => void;
}) {
  const [weight, setWeight] = useState("");
  const [items, setItems] = useState<LaundryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ laundryItemId: number; qty: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch item saat modal dibuka
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getItem();
        setItems(response.getitem);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    fetchItems();
  }, []);

  // Handle pemilihan item
  const handleAddItem = (itemId: number, qty: string) => {
    if (!qty || parseInt(qty) <= 0) return;

    setSelectedItems((prev) => {
      const existingItem = prev.find((item) => item.laundryItemId === itemId);
      if (existingItem) {
        return prev.map((item) =>
          item.laundryItemId === itemId ? { ...item, qty: item.qty + parseInt(qty) } : item
        );
      }
      return [...prev, { laundryItemId: itemId, qty: parseInt(qty) }];
    });
  };

  // Submit Order
  const handleSubmit = async () => {
    if (!weight || selectedItems.length === 0) {
      alert("Please fill in all fields!");
      return;
    }

    const orderData = {
      orderNumber, // Bisa digenerate dari backend
      weight: parseInt(weight),
      orderItem: selectedItems,
    };

    setIsLoading(true);
    try {
      await createOrder(orderData);
      alert("Order Created Successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[90vw] max-w-[500px] mx-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Create Order</CardTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">
              ✕
            </button>
          </div>
          <CardDescription>Create Your Detail Order</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2 py-2">
            <Label>Weight</Label>
            <Input placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>

          {/* Pilih Item */}
          <div className="flex w-full gap-2 mt-4">
            <div className="space-y-2 flex-col w-[70%]">
              <Label>Item Name</Label>
              <Select onValueChange={(value: string) => handleAddItem(parseInt(value), "1")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.itemName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-[30%] space-y-2">
              <Label>Qty</Label>
              <Input
                type="number"
                placeholder="Qty"
                onChange={(e) => {
                  if (items.length > 0) {
                    handleAddItem(items[0].id, e.target.value);
                  }
                }}
              />
            </div>
          </div>

          {/* List Item Terpilih */}
          <div className="mt-4">
            <Label>Selected Items</Label>
            {selectedItems.length > 0 ? (
              <ul className="border p-2 rounded-md text-sm">
                {selectedItems.map((item) => (
                  <li key={item.laundryItemId} className="flex justify-between">
                    <span>{items.find((i) => i.id === item.laundryItemId)?.itemName}</span>
                    <span>{item.qty} pcs</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No items selected.</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
