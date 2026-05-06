import { useState, useRef, useEffect } from "react";
import L from "leaflet";

import {useMap} from "react-leaflet";

import { REQUEST_COOLDOWN_MS } from "../../constants/mapConstants";

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

export default AddressSearch;