import { useRef } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import { markerIcon, REQUEST_COOLDOWN_MS } from "../../constants/mapConstants";

function ClickLocationMarker({ selectedLocation, onSelectLocation }) {
  
  // Limit location marker clicks since API calls are limited
  const lastRequestTimeRef = useRef(0);

  // Listen for map clicks and reverse geocode the clicked coordinates
  useMapEvents({
    async click(event) {
      const currentTime = Date.now();

      // Enforce a cooldown between reverse geocoding requests
      if (currentTime - lastRequestTimeRef.current < REQUEST_COOLDOWN_MS) {
        return;
      }

      lastRequestTimeRef.current = currentTime;

      const { lat, lng } = event.latlng;

      // Show the marker immediately, even while the address is loading
      onSelectLocation({
        position: [lat, lng],
        address: "Loading address...",
      });

      try {
        // Ask backend to convert clicked coordinates into a readable address
        const response = await fetch(
          `http://localhost:8081/api/geocode/reverse?lat=${lat}&lng=${lng}`
        );

        if (!response.ok) {
          onSelectLocation({
            position: [lat, lng],
            address: "Address not found",
          });
          return;
        }

        const data = await response.json();

        // Backend returns a cleaned address string
        onSelectLocation({
          position: [lat, lng],
          address: data.address || "Address not found",
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