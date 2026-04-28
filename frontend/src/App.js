import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import BoardPage from "./pages/BoardPage";
import MapPage from "./pages/MapPage";

function App() {
  const location = useLocation();

  return (
    <div className="appShell">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<BoardPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;