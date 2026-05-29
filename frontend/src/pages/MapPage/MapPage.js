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


// Component inside DndContext, so useDroppable works properly
function MapPageContent({
  navigate,
  selectedLocation,
  setSelectedLocation,
  columns,
  columnTitles,
  activeTask,
  pointerPosition,
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
function MapPage({ columns, columnTitles }) {
  const navigate = useNavigate();

  // Store user's current selected location on interactive map
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Store currently active task being dragged
  const [activeTask, setActiveTask] = useState(null);

  // Store current cursor position while dragging
  const [pointerPosition, setPointerPosition] = useState(null);


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
  function handleDragEnd(event) {
    const { active, over } = event;

    setActiveTask(null);
    setPointerPosition(null);

    if (!over) {
      return;
    }

    if (over.id === "map-drop-zone") {
      console.log("Dropped task on map:", active.id);

      // Later:
      // update this task's location using map coordinates
      return;
    }

    console.log("Dropped task:", active.id);
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
        />
      </DndContext>
    </motion.div>
  );
}

export default MapPage;