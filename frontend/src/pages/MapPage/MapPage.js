import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";

import {
  MapContainer,
  TileLayer,
  useMap,
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


// Gives MapPage access to the Leaflet map object
function MapInstanceTracker({ onMapReady }) {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  return null;
}


// Component inside DndContext, so useDroppable works properly
function MapPageContent({
  navigate,
  selectedLocation,
  setSelectedLocation,
  columns,
  columnTitles,
  activeTask,
  pointerPosition,
  setLeafletMap,
}) {
  // Makes the map area detectable by dnd-kit as a drop zone for dragged tasks
  const {
    setNodeRef: setMapDropRef,
    isOver: isOverMap,
  } = useDroppable({
    id: "map-drop-zone",
  });

  return (
    <>
      {/* Navigate to BoardPage */} 
      <div className="appShell mapNavBar">
        <aside className="mapPanel">
          <button className="mapButton" onClick={() => navigate("/board")}>
            To Task Board
          </button>
        </aside>

        {/* Interactive map */} 
        <div
          ref={setMapDropRef}
          className={`mapContainer ${isOverMap ? "mapContainerDropActive" : ""}`}
        >
          <div className="mapView">
            
            {/* Default starting location on map */} 
            <MapContainer
              center={ottawaPosition}
              zoom={13}
              className="leafletMap"
            >
              <MapInstanceTracker onMapReady={setLeafletMap} />

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
        {activeTask && !isOverMap ? (
          <div className="taskCard taskCardOverlay">
            <p>{activeTask.title}</p>
            <span>{activeTask.location || "No location yet"}</span>
          </div>
        ) : null}
      </DragOverlay>

      {activeTask && isOverMap && pointerPosition ? (
        <div
          className="taskMarkerCursorOverlay"
          style={{
            left: pointerPosition.x,
            top: pointerPosition.y,
          }}
        >
          📍
        </div>
      ) : null}
    </>
  );
}


// MapPage definition 
function MapPage({ columns, setColumns, columnTitles }) {
  const navigate = useNavigate();

  // Store user's current selected location on interactive map
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Store currently active task being dragged
  const [activeTask, setActiveTask] = useState(null);

  // Store current cursor position while dragging
  const [pointerPosition, setPointerPosition] = useState(null);

  // Store Leaflet map instance so drop position can be converted to lat/lng
  const [leafletMap, setLeafletMap] = useState(null);


  // Track cursor position while a task is being dragged
  useEffect(() => {
    if (!activeTask) {
      setPointerPosition(null);
      return;
    }

    function handlePointerMove(event) {
      setPointerPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [activeTask]);


  // Helper functions for MapPage:

  // Looks for a task through all columns using its task id
  function findTaskById(taskId) {
    for (const columnId in columns) {
      const foundTask = columns[columnId].find((task) => task.id === taskId);

      if (foundTask) return foundTask;
    }

    return null;
  }

  // Updates one task's location/address
  function updateTaskLocation(taskId, newLocation) {
    setColumns((prevColumns) => {
      const updatedColumns = {};

      for (const columnId in prevColumns) {
        updatedColumns[columnId] = prevColumns[columnId].map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          return {
            ...task,
            location: newLocation.address,
            position: newLocation.position,
          };
        });
      }

      return updatedColumns;
    });
  }

  // Converts the current cursor position to Leaflet lat/lng
  function getDropLatLng() {
    if (!leafletMap || !pointerPosition) {
      return null;
    }

    const mapContainer = leafletMap.getContainer();
    const mapRect = mapContainer.getBoundingClientRect();

    const containerPoint = [
      pointerPosition.x - mapRect.left,
      pointerPosition.y - mapRect.top,
    ];

    return leafletMap.containerPointToLatLng(containerPoint);
  }

  // Uses backend reverse geocoding to get a readable address
  async function getAddressFromLatLng(lat, lng) {
    try {
      const response = await fetch(
        `http://localhost:8081/api/geocode/reverse?lat=${lat}&lng=${lng}`
      );

      if (!response.ok) {
        return "Address not found";
      }

      const data = await response.json();

      return data.address || "Address not found";
    } catch (error) {
      console.error("Reverse geocoding failed after task drop:", error);
      return "Could not load address";
    }
  }

  // Runs when the user starts dragging a task
  function handleDragStart(event) {
    const task = findTaskById(String(event.active.id));

    if (task) {
      setActiveTask(task);
    }

    if (event.activatorEvent) {
      setPointerPosition({
        x: event.activatorEvent.clientX,
        y: event.activatorEvent.clientY,
      });
    }
  }

  // Runs when the user drops a task
  async function handleDragEnd(event) {
    const { active, over } = event;

    const taskId = String(active.id);
    const droppedOnMap = over?.id === "map-drop-zone";

    if (droppedOnMap) {
      const dropLatLng = getDropLatLng();

      if (dropLatLng) {
        const lat = dropLatLng.lat;
        const lng = dropLatLng.lng;

        // Show immediate feedback while reverse geocoding finishes
        updateTaskLocation(taskId, {
          address: "Loading address...",
          position: [lat, lng],
        });

        setSelectedLocation({
          position: [lat, lng],
          address: "Loading address...",
        });

        const address = await getAddressFromLatLng(lat, lng);

        updateTaskLocation(taskId, {
          address,
          position: [lat, lng],
        });

        setSelectedLocation({
          position: [lat, lng],
          address,
        });
      }
    }

    setActiveTask(null);
    setPointerPosition(null);
  }

  // Runs if the drag is cancelled
  function handleDragCancel() {
    setActiveTask(null);
    setPointerPosition(null);
  }


  return (
    <motion.div
      className="pageSlide"
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <MapPageContent
          navigate={navigate}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          columns={columns}
          columnTitles={columnTitles}
          activeTask={activeTask}
          pointerPosition={pointerPosition}
          setLeafletMap={setLeafletMap}
        />
      </DndContext>
    </motion.div>
  );
}

export default MapPage;