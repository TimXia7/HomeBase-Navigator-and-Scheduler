import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import {
  MapContainer,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
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

  // Store currently active task being dragged
  const [activeTask, setActiveTask] = useState(null);


  // Helper functions for MapPage:

  // Looks for a task through all columns using its task id
  function findTaskById(taskId) {
    for (const columnId in columns) {
      const foundTask = columns[columnId].find((task) => task.id === taskId);

      if (foundTask) return foundTask;
    }

    return null;
  }

  // Runs when the user starts dragging a task
  function handleDragStart(event) {
    const task = findTaskById(String(event.active.id));

    if (task) setActiveTask(task);
  }

  // Runs when the user drops a task
  function handleDragEnd(event) {
    setActiveTask(null);

    // For now, just confirms the map page can detect dropped tasks.
    // Later, this is where the task location update logic will go.
    console.log("Dropped task:", event.active.id);
  }

  // Runs if the drag is cancelled
  function handleDragCancel() { setActiveTask(null); }


  return (
    <motion.div
      className="pageSlide"
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Navigate to BoardPage */} 
        <div className="appShell mapNavBar">
          <aside className="mapPanel">
            <button className="mapButton" onClick={() => navigate("/board")}>
              To Task Board
            </button>
          </aside>

          {/* Interactive map */} 
          <div className="mapContainer">
            <div className="mapView">
              
              {/* Default starting location on map */} 
              <MapContainer
                center={ottawaPosition}
                zoom={13}
                className="leafletMap"
              >
                {/* Map tiles generated using OSM info, with help from Leaflet */} 
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

        <DragOverlay>
          {activeTask ? (
            <div className="taskCard taskCardOverlay">
              <p>{activeTask.title}</p>
              <span>{activeTask.location || "No location yet"}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}

export default MapPage;