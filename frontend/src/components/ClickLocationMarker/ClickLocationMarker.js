import { useRef } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import { markerIcon, REQUEST_COOLDOWN_MS } from "../../constants/mapConstants";

function ClickLocationMarker({ selectedLocation, onSelectLocation }) {
  
  // limit location marker clicks since OSM API limits calls (temp)
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

      // Show the marker on click, even if address hasn't been loaded
      onSelectLocation({
        position: [lat, lng],
        address: "Loading address...",
      });

      try {
        // Convert the clicked coordinates into a readable address Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        // Extract useful address fields if they exist
        const road = data.address?.road || "";
        const city = data.address?.city || "";
        const province = data.address?.state || "";
        const postcode = data.address?.postcode || "";
        const country = data.address?.country || "";

        // Build a readable address string from the available fields
        const readableAddress = [road, city, province, postcode, country]
          .filter(Boolean)
          .join(", ");

        // Finally, update the selected location with the resolved address
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