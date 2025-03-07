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
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [error, setError] = useState("");
  
  // State for current item selection
  const [currentItem, setCurrentItem] = useState<{
    itemId: string;
    itemName: string;
    qty: string;
  }>({
    itemId: "",
    itemName: "",
    qty: "",
  });

  // Fetch item saat modal dibuka
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getItem();
        setItems(response.getitem);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setError("Failed to load items. Please try again.");
      }
    };

    fetchItems();
  }, []);

  // Handle item selection
  const handleItemSelect = (value: string) => {
    const selectedItem = items.find(item => item.id.toString() === value);
    setCurrentItem({
      itemId: value,
      itemName: selectedItem?.itemName || "",
      qty: currentItem.qty,
    });
    setError("");
  };

  // Handle quantity input
  const handleQtyChange = (value: string) => {
    setCurrentItem({
      ...currentItem,
      qty: value,
    });
    setError("");
  };

  // Handle Add Item button
  const handleAddItem = () => {
    // Validate inputs
    if (!currentItem.itemId) {
      setError("Please select an item");
      return;
    }

    if (!currentItem.qty || parseInt(currentItem.qty) <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    const itemId = parseInt(currentItem.itemId);
    const qty = parseInt(currentItem.qty);

    // Add to selected items
    setSelectedItems((prev) => {
      const existingItem = prev.find((item) => item.laundryItemId === itemId);
      if (existingItem) {
        return prev.map((item) =>
          item.laundryItemId === itemId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { laundryItemId: itemId, qty }];
    });

    // Reset current item
    setCurrentItem({
      itemId: "",
      itemName: "",
      qty: "",
    });
    
    setError("");
  };

  // Remove item from selected items
  const handleRemoveItem = (itemId: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.laundryItemId !== itemId));
  };

  // Submit Order
  const handleSubmit = async () => {
    if (!weight) {
      setError("Please enter weight");
      return;
    }
    
    if (selectedItems.length === 0) {
      setError("Please add at least one item");
      return;
    }
  
    // Format the data according to what the backend expects
    const orderData = {
      orderNumber,
      weight: parseInt(weight),
      orderItem: selectedItems.map(item => ({
        laundryItemId: String(item.laundryItemId),
        qty: String(item.qty)
      }))
    };
  
    setIsLoading(true);
    try {
      await createOrder(orderData);
      alert("Order Created Successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to create order:", error);
      setError("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[90vw] max-w-[500px] mx-4 max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Create Order</CardTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">
              ✕
            </button>
          </div>
          <CardDescription>Create Your Detail Order</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input 
              id="weight"
              placeholder="Enter weight in kg" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
            />
          </div>

          {/* Item Selection Section */}
          <div className="space-y-4 py-2 border-t border-b border-gray-100 pt-4">
            <div className="font-medium text-sm text-gray-700">Add Items</div>
            
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-7">
                <Label htmlFor="item-select">Item Name</Label>
                <Select 
                  value={currentItem.itemId} 
                  onValueChange={handleItemSelect}
                >
                  <SelectTrigger id="item-select" className="w-full">
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

              <div className="col-span-3">
                <Label htmlFor="qty-input">Qty</Label>
                <Input
                  id="qty-input"
                  type="number"
                  placeholder="Qty"
                  value={currentItem.qty}
                  onChange={(e) => handleQtyChange(e.target.value)}
                />
              </div>

              <div className="col-span-2 flex items-end">
                <Button 
                  type="button" 
                  onClick={handleAddItem} 
                  className="w-full h-10 bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Selected Items Section */}
          <div className="space-y-2">
            <div className="font-medium">Selected Items</div>
            {selectedItems.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-3 text-left">Item</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedItems.map((item) => {
                      const itemDetails = items.find((i) => i.id === item.laundryItemId);
                      return (
                        <tr key={item.laundryItemId} className="hover:bg-gray-50">
                          <td className="py-2 px-3">{itemDetails?.itemName}</td>
                          <td className="py-2 px-3 text-center">{item.qty}</td>
                          <td className="py-2 px-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveItem(item.laundryItemId)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm border rounded-md p-3 bg-gray-50">
                No items selected. Please add at least one item.
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Order"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}