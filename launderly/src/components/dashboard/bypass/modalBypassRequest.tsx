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
import { Label } from "@/components/ui/label";
import { bypassOrder, fetchOrders } from "@/services/orderService";
import { OrderApiResponse } from "@/types/order.type";

interface ModalBypassProps {
  orderWorkerId: number;
  orderNumber: string;
  onClose: () => void;
}

export default function ModalBypass({
  orderWorkerId,
  orderNumber,
  onClose,
}: ModalBypassProps) {
  const [items, setItems] = useState<OrderApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetchOrders(1, orderNumber);
        setItems(response);
      } catch (error) {
        console.error("Gagal mengambil data order:", error);
        setError("Gagal memuat data order.");
      }
    };

    fetchItems();
  }, [orderNumber]);

  const handleSubmit = async (action: "accept" | "reject") => {
    if (!orderWorkerId) {
      alert("Data order tidak valid!");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await bypassOrder({ orderWorkerId, action });
      alert(`Order berhasil ${action === "accept" ? "diterima" : "ditolak"}!`);
      onClose();
    } catch (error: any) {
      console.error(`Gagal ${action} order:`, error);
      setError(error.message || `Gagal ${action} order.`);
    } finally {
      setIsLoading(false);
    }
  };

  const order = items?.getOrder?.orders?.[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[90vw] max-w-[500px] mx-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bypass Order</CardTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">
              ✕
            </button>
          </div>
          <CardDescription>Konfirmasi bypass order</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {error && <div className="text-red-500">{error}</div>}
          {!order && !error && <div>Memuat data order...</div>}
          {order && (
            <>
              <div>
                <Label>Order Number</Label>
                <div>{order.orderNumber}</div>
              </div>
              <div>
                <Label>Customer Name</Label>
                <div>{order.pickupOrder?.user?.fullName || "N/A"}</div>
              </div>
              <div>
                <Label>Status</Label>
                <div>{order.orderStatus}</div>
              </div>
              <div>
                <Label>Worker Name</Label>
                {order.orderWorker
                  .filter((worker) => worker.bypassRequest)
                  .map((worker) => (
                    <div key={worker.id}>{worker.worker.user.fullName}</div>
                  ))}
              </div>
              <div>
                <Label>Bypass Note</Label>
                {order.orderWorker
                  .filter((worker) => worker.bypassRequest)
                  .map((worker) => (
                    <div key={worker.id}>{worker.bypassNote}</div>
                  ))}
              </div>
              <div className="flex w-full gap-2 mt-4">
                <div className="space-y-2 flex-col w-[70%]">
                  <Label>Item Name</Label>
                  {order.orderItem.map((item) => (
                    <div key={item.id}>{item.laundryItem.itemName}</div>
                  ))}
                </div>
                <div className="flex flex-col w-[30%] space-y-2 mt-1">
                  <Label>Qty</Label>
                  {order.orderItem.map((item) => (
                    <div key={item.id}>{item.qty}</div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <div className="flex gap-2">
            <Button className="bg-red-500" onClick={() => handleSubmit("reject")} disabled={isLoading || !order}>
              {isLoading ? "Processing..." : "Reject"}
            </Button>
            <Button className="bg-blue" onClick={() => handleSubmit("accept")} disabled={isLoading || !order}>
              {isLoading ? "Processing..." : "Accept"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
