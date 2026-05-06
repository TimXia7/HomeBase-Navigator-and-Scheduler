import { useState, useRef, useEffect } from "react";
import L from "leaflet";

import {useMap} from "react-leaflet";

import { REQUEST_COOLDOWN_MS } from "../../constants/mapConstants";

function AddressSearch({ onSelectLocation }) {

  // Holds user's search string for address
  const [searchText, setSearchText] = useState("");

  // Holds feedback for user's search string
  const [searchMessage, setSearchMessage] = useState("");

  // Timer to delay searches due to limited API calls
  const lastSearchTimeRef = useRef(0);

  // Holds the location the user clicked for 
  const searchBoxRef = useRef(null);

  // Stores a reference to the search form DOM element
  const map = useMap();

  // Disable search clicks on the address search box
  useEffect(() => {
    if (searchBoxRef.current) {
      L.DomEvent.disableClickPropagation(searchBoxRef.current);
      L.DomEvent.disableScrollPropagation(searchBoxRef.current);
    }
  }, []);

  async function handleSearch(event) {
    
    // Preliminary checks before search attempt
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

    // Process address search
    try {
      // fetch info from OSM API, specifically Nominatim geocoding that actually gives the address
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

      // store coords to address
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

  // Render the address search form and optional search feedback message
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

export default AddressSearch;