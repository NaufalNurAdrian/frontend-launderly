"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IOutletAddress } from "@/types/address";
import { useEffect } from "react";

interface MapProps {
  outlets: IOutletAddress[];
  selectedOutlet: [number, number] | null;
}

const customIcon = new L.Icon({
  iconUrl: "/marker2.png",
  iconSize: [40, 45],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Map({ outlets, selectedOutlet }: MapProps) {
  const firstValidOutlet = outlets.find(
    (outlet) =>
      outlet.address.length > 0 && outlet.address[0].latitude !== undefined
  );

  const center: [number, number] = firstValidOutlet
    ? [
        firstValidOutlet.address[0].latitude,
        firstValidOutlet.address[0].longitude,
      ]
    : [-6.2088, 106.8456];

  return (
    <MapContainer
      key={selectedOutlet?.toString() || "default"}
      center={center}
      zoom={12}
      className="h-full w-full rounded-lg shadow-lg relative z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapFlyTo selectedOutlet={selectedOutlet} />{" "}
      {/* 🔹 Tambahkan komponen flyTo */}
      {outlets.map((outlet) =>
        outlet.address.length > 0 &&
        outlet.address[0]?.latitude !== undefined &&
        outlet.address[0]?.longitude !== undefined ? (
          <Marker
            key={outlet.id}
            position={[outlet.address[0].latitude, outlet.address[0].longitude]}
            icon={customIcon}
          >
            <Popup>
              <strong>{outlet.outletName}</strong> <br />
              {outlet.outletType}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}

// 🔹 Komponen untuk memindahkan peta ketika selectedOutlet berubah
function MapFlyTo({
  selectedOutlet,
}: {
  selectedOutlet: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedOutlet) {
      map.flyTo(selectedOutlet, 15, { duration: 1.5 });
    }
  }, [selectedOutlet]);

  return null;
}
