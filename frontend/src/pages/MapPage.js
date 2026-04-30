import { motion } from 'framer-motion'
import { useNavigate } from "react-router-dom";
import "./MapPage.css";

function MapPage() {
  const navigate = useNavigate();

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
          <button className="mapButton" onClick={() => navigate("/")}>
            ← Back
          </button>
        </aside>

        <div className="mapContainer">
          <div className="mapView">
            <div className="mapPlaceholder">Map will go here</div>
          </div>
        </div>
      </div>
      </motion.div>
  );
}

export default MapPage;