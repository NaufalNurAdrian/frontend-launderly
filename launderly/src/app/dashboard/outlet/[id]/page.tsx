"use client"

import { Card } from "@/components/ui/card";
import { getOutletById } from "@/services/outletService";
import { Outlet, OutletById } from "@/types/outlet.type";
import { useEffect, useState } from "react";


export default function OutletDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [outlets, setOutlets] = useState<OutletById>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log({outlets: (outlets)});
  
  console.log("Fetching outlet with ID:", params.id);

  useEffect(() => {
      const loadData = async () => {
        try {
          const data: OutletById = await getOutletById(Number(params.id));
          setOutlets(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load data");
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, []);

    if (loading) {
      return <div>Loading employees...</div>;
    }
  
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }

  return (
    <div className="container mt-5 p-5">
      <Card className="p-5">
        <h1 className="text-2xl font-bold">{outlets?.outlet.outletName}</h1>
        <p className="text-gray-700">Type: {outlets?.outlet.outletType}</p>
        <p className="text-gray-700">
  Address: {outlets?.outlet.address?.length ? outlets.outlet.address[0].addressLine : "No address available"}
</p>
      </Card>
    </div>
  );
}
