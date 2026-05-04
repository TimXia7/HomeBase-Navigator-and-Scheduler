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


// COMPONENTS:

// Re-usable components:
import AddressSearch from "../../components/AddressSearch/AddressSearch.js";

import ClickLocationMarker from "../../components/ClickLocationMarker/ClickLocationMarker.js";


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