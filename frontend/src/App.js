import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import BoardPage from "./pages/BoardPage";
import MapPage from "./pages/MapPage";

import "./App.css"

function App() {
  const location = useLocation();

  return (
    <div className="routeWrapper">
      <AnimatePresence initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<BoardPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;