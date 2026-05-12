import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import BoardPage from "./pages/BoardPage/BoardPage";
import MapPage from "./pages/MapPage/MapPage";

import "./App.css";

function App() {
  // Tracks current columns. Columns can be added or reordered.
  const [columnOrder, setColumnOrder] = useState([
    "newTasks",
    "inProgress",
    "finished",
  ]);

  // Tracks the display title for each column.
  const [columnTitles, setColumnTitles] = useState({
    newTasks: "New Tasks",
    inProgress: "In Progress",
    finished: "Finished",
  });

  // Tracks which columns are collapsed.
  const [collapsedColumns, setCollapsedColumns] = useState({
    newTasks: false,
    inProgress: false,
    finished: false,
  });

  // Tracks the tasks inside each column.
  const [columns, setColumns] = useState({
    newTasks: [
      {
        id: "task-1",
        title: "Example task",
        location: "No location yet",
      },
    ],
    inProgress: [],
    finished: [],
  });

  return (
    <div className="routeWrapper">
      <Routes>
        <Route element={<NavBar />}>
          <Route path="/" element={<MapPage />} />

          <Route
            path="/board"
            element={
              <BoardPage
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                columnTitles={columnTitles}
                setColumnTitles={setColumnTitles}
                collapsedColumns={collapsedColumns}
                setCollapsedColumns={setCollapsedColumns}
                columns={columns}
                setColumns={setColumns}
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;