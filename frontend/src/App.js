import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import BoardPage from "./pages/BoardPage/BoardPage";
import MapPage from "./pages/MapPage";

import "./App.css";

function App() {
  return (
    <div className="routeWrapper">
      <Routes>
        <Route element={<NavBar />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/board" element={<BoardPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;