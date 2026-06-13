import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../services/useStore.tsx";

// 1. Define customMarker OUTSIDE the component (Best for performance)
const orangeCircleIcon = L.divIcon({
  html: '<div class="bg-orange-500 w-5 h-5 rounded-full border-2 border-white shadow-xl animate-pulse"></div>',
  className: "custom-div-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

type LatLng = { lat: number; lng: number };

function LocationMarker({
  setPosition,
}: {
  setPosition: (pos: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const MapPage = () => {
  const currentOrderId = useStore((state) => state.currentOrderId);

  console.log("MapPage ID Check:", currentOrderId);
  const navigate = useNavigate();
  const setDeliveryLocation = useStore((state) => state.setDeliveryLocation);

  // Local state for the "temporary" pin before user clicks confirm
  const [position, setPosition] = useState<LatLng | null>(null);

  const handleConfirm = async () => {
    console.log("Position State:", position);
    console.log("Order ID State:", currentOrderId);
    if (!position) {
      alert("Please select a location on the map first.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${currentOrderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: position,
            status: "pending_payment",
          }),
        },
      );

      console.log("Moving to payment...");
      setDeliveryLocation(position);
      navigate(`/payment/${currentOrderId}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Header UI */}
      <div className="p-4 bg-white shadow-md flex justify-between items-center z-[1000]">
        <h2 className="text-xl font-bold text-gray-800">
          Select Delivery Location
        </h2>
        <button
          onClick={handleConfirm}
          disabled={!position}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            position
              ? "bg-orange-500 text-white shadow-lg cursor-pointer"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          Confirm Location
        </button>
      </div>

      <div className="grow relative">
        <MapContainer
          center={[9.03, 38.74]}
          zoom={13}
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker setPosition={setPosition} />

          {/* 2. Marker MUST be inside MapContainer */}
          {position && <Marker position={position} icon={orangeCircleIcon} />}
        </MapContainer>

        {!position && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/70 text-white px-4 py-2 rounded-full text-sm">
            Tap on the map to set your address
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
