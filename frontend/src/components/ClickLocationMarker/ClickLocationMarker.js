import { useRef } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import { markerIcon, REQUEST_COOLDOWN_MS } from "../../constants/mapConstants";

function ClickLocationMarker({ selectedLocation, onSelectLocation }) {
  const lastRequestTimeRef = useRef(0);

  useMapEvents({
    async click(event) {
      const currentTime = Date.now();

      if (currentTime - lastRequestTimeRef.current < REQUEST_COOLDOWN_MS) {
        return;
      }

      lastRequestTimeRef.current = currentTime;

      const { lat, lng } = event.latlng;

      onSelectLocation({
        position: [lat, lng],
        address: "Loading address...",
      });

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        const road = data.address?.road || "";
        const city = data.address?.city || "";
        const province = data.address?.state || "";
        const postcode = data.address?.postcode || "";
        const country = data.address?.country || "";

        const readableAddress = [road, city, province, postcode, country]
          .filter(Boolean)
          .join(", ");

        onSelectLocation({
          position: [lat, lng],
          address: readableAddress || data.display_name || "Address not found",
        });
      } catch (error) {
        console.error("Reverse geocoding failed:", error);

        onSelectLocation({
          position: [lat, lng],
          address: "Could not load address",
        });
      }
    },
  });

  if (!selectedLocation) {
    return null;
  }

  return <Marker position={selectedLocation.position} icon={markerIcon} />;
}

export default ClickLocationMarker;