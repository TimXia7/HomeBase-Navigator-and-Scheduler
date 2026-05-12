import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import BoardPage from "./pages/BoardPage/BoardPage";
import MapPage from "./pages/MapPage/MapPage";

import "./App.css";

const BOARD_STORAGE_KEY = "homebase-board-state";

const DEFAULT_BOARD_STATE = {
  columnOrder: ["newTasks", "inProgress", "finished"],

  columnTitles: {
    newTasks: "New Tasks",
    inProgress: "In Progress",
    finished: "Finished",
  },

  collapsedColumns: {
    newTasks: false,
    inProgress: false,
    finished: false,
  },

  columns: {
    newTasks: [
      {
        id: "task-1",
        title: "Example task",
        location: "No location yet",
      },
    ],
    inProgress: [],
    finished: [],
  },
};

function getSavedBoardState() {
  const savedState = localStorage.getItem(BOARD_STORAGE_KEY);

  if (!savedState) {
    return DEFAULT_BOARD_STATE;
  }

  try {
    return JSON.parse(savedState);
  } catch (error) {
    console.error("Failed to load board state from localStorage:", error);
    return DEFAULT_BOARD_STATE;
  }
}

function App() {
  const savedBoardState = getSavedBoardState();

  // Tracks current columns. Columns can be added or reordered.
  const [columnOrder, setColumnOrder] = useState(
    savedBoardState.columnOrder
  );

  // Tracks the display title for each column.
  const [columnTitles, setColumnTitles] = useState(
    savedBoardState.columnTitles
  );

  // Tracks which columns are collapsed.
  const [collapsedColumns, setCollapsedColumns] = useState(
    savedBoardState.collapsedColumns
  );

  // Tracks the tasks inside each column.
  const [columns, setColumns] = useState(savedBoardState.columns);

  // Save board data whenever it changes.
  useEffect(() => {
    const boardState = {
      columnOrder,
      columnTitles,
      collapsedColumns,
      columns,
    };

    localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boardState));
  }, [columnOrder, columnTitles, collapsedColumns, columns]);

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