import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./MapPage.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const REQUEST_COOLDOWN_MS = 1100;

function ClickLocationMarker() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  const lastRequestTimeRef = useRef(0);

  useMapEvents({
    async click(event) {
      const currentTime = Date.now();

      if (currentTime - lastRequestTimeRef.current < REQUEST_COOLDOWN_MS) {
        setSelectedAddress("Please wait before selecting another location.");
        return;
      }

      lastRequestTimeRef.current = currentTime;

      const { lat, lng } = event.latlng;

      setSelectedPosition([lat, lng]);
      setSelectedAddress("Loading address...");

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

        setSelectedAddress(
          readableAddress || data.display_name || "Address not found"
        );
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        setSelectedAddress("Could not load address");
      }
    },
  });

  if (!selectedPosition) {
    return null;
  }

  return (
    <>
      <div className="selectedLocationBox">
        <div className="selectedLocationHeader">
          <strong>Selected Location</strong>

          <button className="addTaskFromMapButton" type="button">
            Add New Task
          </button>
        </div>

        <p>{selectedAddress}</p>

        <span>
          {selectedPosition[0].toFixed(5)}, {selectedPosition[1].toFixed(5)}
        </span>
      </div>

      <Marker position={selectedPosition} icon={markerIcon}/>
    </>
  );
}

function MapPage() {
  const navigate = useNavigate();

  const ottawaPosition = [45.4215, -75.6972];

  return (
    <motion.div
      className="pageSlide"
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <div className="appShell mapNavBar">
        <aside className="mapPanel">
          <button className="mapButton" onClick={() => navigate("/board")}>
            To Task Board
          </button>
        </aside>

        <div className="mapContainer">
          <div className="mapView">
            <MapContainer
              center={ottawaPosition}
              zoom={13}
              className="leafletMap"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <ClickLocationMarker />
            </MapContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MapPage;