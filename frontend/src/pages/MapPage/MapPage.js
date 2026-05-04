import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  markerIcon,
  REQUEST_COOLDOWN_MS,
  ottawaPosition,
} from "../../constants/mapConstants.js";

import "./MapPage.css";

function AddressSearch({ onSelectLocation }) {
  const [searchText, setSearchText] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const lastSearchTimeRef = useRef(0);
  const searchBoxRef = useRef(null);

  const map = useMap();

  useEffect(() => {
    if (searchBoxRef.current) {
      L.DomEvent.disableClickPropagation(searchBoxRef.current);
      L.DomEvent.disableScrollPropagation(searchBoxRef.current);
    }
  }, []);

  async function handleSearch(event) {
    event.preventDefault();

    const currentTime = Date.now();

    if (currentTime - lastSearchTimeRef.current < REQUEST_COOLDOWN_MS) {
      setSearchMessage("Please wait before searching again.");
      return;
    }

    const trimmedSearch = searchText.trim();

    if (!trimmedSearch) {
      setSearchMessage("Enter an address first.");
      return;
    }

    lastSearchTimeRef.current = currentTime;

    setSearchMessage("Searching...");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          trimmedSearch
        )}&limit=1`
      );

      const data = await response.json();

      if (data.length === 0) {
        setSearchMessage("Address not found.");
        return;
      }

      const result = data[0];
      const lat = Number(result.lat);
      const lng = Number(result.lon);

      map.setView([lat, lng], 16);

      onSelectLocation({
        position: [lat, lng],
        address: result.display_name,
      });

      setSearchMessage("");
    } catch (error) {
      console.error("Address search failed:", error);
      setSearchMessage("Could not search address.");
    }
  }

  return (
    <form
      ref={searchBoxRef}
      className="addressSearchBox"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        placeholder="Search address..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <button type="submit">Search</button>

      {searchMessage && <span>{searchMessage}</span>}
    </form>
  );
}

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

function SelectedLocationBox({ selectedLocation }) {
  const selectedBoxRef = useRef(null);

  useEffect(() => {
    if (selectedBoxRef.current) {
      L.DomEvent.disableClickPropagation(selectedBoxRef.current);
      L.DomEvent.disableScrollPropagation(selectedBoxRef.current);
    }
  }, []);

  return (
    <div ref={selectedBoxRef} className="selectedLocationBox">
      <div className="selectedLocationHeader">
        <strong>Selected Location</strong>

        <button className="addTaskFromMapButton" type="button">
          Add New Task
        </button>
      </div>

      <p>{selectedLocation.address}</p>

      <span>
        {selectedLocation.position[0].toFixed(5)},{" "}
        {selectedLocation.position[1].toFixed(5)}
      </span>
    </div>
  );
}

function MapPage() {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState(null);

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

              <AddressSearch onSelectLocation={setSelectedLocation} />

              <ClickLocationMarker
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
              />
            </MapContainer>

            {selectedLocation && (
              <SelectedLocationBox selectedLocation={selectedLocation} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MapPage;