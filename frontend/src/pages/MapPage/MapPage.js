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

import SelectedLocationBox from "../../components/SelectedLocationBox/SelectedLocationBox.js";

import MapTaskPanel from "../../components/MapTaskPanel/MapTaskPanel.js";


// MapPage definition 
function MapPage({ columns, columnTitles }) {
  const navigate = useNavigate();

  // Store user's current selected location on interactive map
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <motion.div
      className="pageSlide"
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      {/* Navigate to BoardPage */} 
      <div className="appShell mapNavBar">
        <aside className="mapPanel">
          <button className="mapButton" onClick={() => navigate("/board")}>
            To Task Board
          </button>
        </aside>

        {/* Interactive map: */} 
        <div className="mapContainer">
          <div className="mapView">
            
            {/* Default starting location on map: */} 
            <MapContainer
              center={ottawaPosition}
              zoom={13}
              className="leafletMap"
            >
              {/* Map tiles generated using OSM info, with help from leaflet: */} 
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
        <MapTaskPanel
          columns={columns}
          columnTitles={columnTitles}
        />
      </div>
    </motion.div>
  );
}

export default MapPage;