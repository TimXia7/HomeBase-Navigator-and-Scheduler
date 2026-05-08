import { useState, useRef, useEffect } from "react";
import L from "leaflet";

import {useMap} from "react-leaflet";

function AddressSearch({ onSelectLocation }) {

  // Holds user's search string for address
  const [searchText, setSearchText] = useState("");

  // Holds feedback for user's search string
  const [searchMessage, setSearchMessage] = useState("");

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
    event.preventDefault();
    const trimmedSearch = searchText.trim();

    if (!trimmedSearch) {
      setSearchMessage("Enter an address first.");
      return;
    }

    setSearchMessage("Searching...");

    try {
      const response = await fetch(
        `http://localhost:8081/api/geocode/search?query=${encodeURIComponent(
          trimmedSearch
        )}`
      );

      if (!response.ok) {
        setSearchMessage("Address not found.");
        return;
      }

      const data = await response.json();

      const lat = Number(data.lat);
      const lng = Number(data.lng);

      map.setView([lat, lng], 16);

      onSelectLocation({
        position: [lat, lng],
        address: data.address,
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