import { useRef, useEffect } from "react";
import L from "leaflet";

function SelectedLocationBox({ selectedLocation }) {
  const selectedBoxRef = useRef(null);

  // disable map interactions through the box
  useEffect(() => {
    if (selectedBoxRef.current) {
      L.DomEvent.disableClickPropagation(selectedBoxRef.current);
      L.DomEvent.disableScrollPropagation(selectedBoxRef.current);
    }
  }, []);

  // Show selected address and option to create a task there, presumably from a map
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

export default SelectedLocationBox;