// Basic React/DOM libraries
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useNavigate } from "react-router-dom";

// For dragging and dropping components
import {
  DndContext,
  useDraggable,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";


/* Constants for task column animation/fade in and out 
columnTransition = for columns minimized and maximized
stackTransition = for the column of minimized task columns */
import {
  columnTransition,
  stackTransition,
  MAX_COL,
} from "../../constants/boardAnimations";

import "./BoardPage.css";

// COMPONENTS: 

// Re-usable components:
// Component describes an individual task
import TaskCard from "../../components/TaskCard/TaskCard";

// Component defines a sortable column: Main purpose is for the board columns like, New Tasks, Finished, etc.
import SortableColumn from "../../components/SortableColumn/SortableColumn";

// Component defines a column after it has been minimized
import CollapsedColumn from  "../../components/CollapsedColumn/CollapsedColumn";


// BoardPage definition 
function BoardPage({
  columnOrder,
  setColumnOrder,
  columnTitles,
  setColumnTitles,
  collapsedColumns,
  setCollapsedColumns,
  columns,
  setColumns,
}) {
  const navigate = useNavigate();

  // Tracks what the user is entering for adding a new column 
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // Tracks the column currently being dragged (with the ⋮⋮ handle) 
  const [activeColumnId, setActiveColumnId] = useState(null);

  // Tracks the task card currently being dragged 
  const [activeTask, setActiveTask] = useState(null);

  // Tracks new task card being created
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Tracks pop-up messages
  const [popupMessage, setPopupMessage] = useState("");


  // Functions for BoardPage:

  // Function to add a task to the New Tasks column
  function handleAddTask() {
    const trimmedTitle = newTaskTitle.trim();

    if (!trimmedTitle) {
      showPopup("New task must have a name.");
      return;
    }

    const newTask = {
      id: `task-${crypto.randomUUID()}`,
      title: trimmedTitle,
      location: "No location yet",
    };

    setColumns((prevColumns) => ({
      ...prevColumns,
      newTasks: [...prevColumns.newTasks, newTask],
    }));

    setNewTaskTitle("");
  }

  // Function to delete a task from whichever column currently contains it
  function handleDeleteTask(taskId) {
    setColumns((prevColumns) => {
      const updatedColumns = {};

      for (const columnId in prevColumns) {
        updatedColumns[columnId] = prevColumns[columnId].filter(
          (task) => task.id !== taskId
        );
      }

      return updatedColumns;
    });
  }

  // Function to delete a column
  function handleAddColumn() {
    const trimmedTitle = newColumnTitle.trim();

    // New col must have a name
    if (!trimmedTitle) {
      showPopup("New task column must have a name.");
      return;
    }

    // Cannot have more than MAX_COL columns
    if (columnOrder.length >= MAX_COL) {
      showPopup("Cannot have more than 5 task columns.");
      return;
    }

    const columnId = `column-${crypto.randomUUID()}`;

    // Put the new col to the end, but befpre the collpased col, if it exists
    setColumnOrder((prevOrder) => [...prevOrder, columnId]);

    setColumnTitles((prevTitles) => ({
      ...prevTitles,
      [columnId]: trimmedTitle,
    }));

    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: [],
    }));

    setCollapsedColumns((prevCollapsedColumns) => ({
      ...prevCollapsedColumns,
      [columnId]: false,
    }));

    setNewColumnTitle("");
  }

  // Functions to delete a column. Associated data from arrays, like col id, are cleared here
  function handleDeleteColumn(columnId) {
    setColumnOrder((prevOrder) =>
      prevOrder.filter((currentColumnId) => currentColumnId !== columnId)
    );

    setColumnTitles((prevTitles) => {
      const updatedTitles = { ...prevTitles };
      delete updatedTitles[columnId];
      return updatedTitles;
    });

    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };
      delete updatedColumns[columnId];
      return updatedColumns;
    });

    setCollapsedColumns((prevCollapsedColumns) => {
      const updatedCollapsedColumns = { ...prevCollapsedColumns };
      delete updatedCollapsedColumns[columnId];
      return updatedCollapsedColumns;
    });
  }

  // Handles the action of picking up a draggable component. Mostly just tracks the id of the component
  function handleDragStart(event) {
    const activeId = String(event.active.id);

    const expandedColumnIds = columnOrder.filter(
      (columnId) => !collapsedColumns[columnId]
    );

    if (expandedColumnIds.includes(activeId)) {
      setActiveColumnId(activeId);
      setActiveTask(null);
      return;
    }

    const task = findTaskById(activeId);

    if (task) {
      setActiveTask(task);
    }
  }

  // Handles event of user dropping a component
  function handleDragEnd(event) {

    // Already cleared in a helper function, just to ensure as it is not resource heavy
    setActiveColumnId(null);
    setActiveTask(null);

    // If the draggable component is not over anything valid, return
    // Note, the collision strat is, "closestCenter", which drops components on the closest valid target
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // find the id of what was dropped:

    // expanded cols
    const expandedColumnIds = columnOrder.filter(
      (columnId) => !collapsedColumns[columnId]
    );

    // col reordering: if the draggable was a col, reorder the col based on what it was over
    if (
      expandedColumnIds.includes(activeId) &&
      expandedColumnIds.includes(overId)
    ) {
      if (activeId !== overId) {
        setColumnOrder((prevOrder) => {
          const oldIndex = prevOrder.indexOf(activeId);
          const newIndex = prevOrder.indexOf(overId);

          return arrayMove(prevOrder, oldIndex, newIndex);
        });
      }

      return;
    }

    // Extra precaution, in cause the draggable is a col, but somehow got past prev 
    if (expandedColumnIds.includes(activeId)) {
      return;
    }


    // Was the draggable a task?
    const taskId = activeId;
    const destinationColumn = overId;

    // Checks for valid col to drop a task on
    if (!columns[destinationColumn]) return;

    // Find the task id (where the task was from)
    let sourceColumn = null;
    let movedTask = null;

    for (const columnId in columns) {
      const foundTask = columns[columnId].find((task) => task.id === taskId);

      if (foundTask) {
        sourceColumn = columnId;
        movedTask = foundTask;
        break;
      }
    }

    if (!sourceColumn || !movedTask) return;
    if (sourceColumn === destinationColumn) return;

    // Update the tasks based on the result
    setColumns((prevColumns) => ({
      ...prevColumns,
      [sourceColumn]: prevColumns[sourceColumn].filter(
        (task) => task.id !== taskId
      ),
      [destinationColumn]: [...prevColumns[destinationColumn], movedTask],
    }));
  }

  // Packaging col data for the render
  const columnInfo = columnOrder.map((columnId) => ({
    id: columnId,
    title: columnTitles[columnId],
    tasks: columns[columnId] || [],
  }));

  const expandedColumns = columnInfo.filter(
    (column) => !collapsedColumns[column.id]
  );

  const minimizedColumns = columnInfo.filter(
    (column) => collapsedColumns[column.id]
  );


  // BoardPage Helper functions

  // Toggles a col between collpased and not
  function toggleColumn(columnId) {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }

  // Looks for a task card through ALL cols
  function findTaskById(taskId) {
    for (const columnId in columns) {
      const foundTask = columns[columnId].find((task) => task.id === taskId);

      if (foundTask) {
        return foundTask;
      }
    }

    return null;
  }

  // removes active col id when the col is let go
  function handleDragCancel() {
    setActiveColumnId(null);
    setActiveTask(null);
  }

  // helper to show popup messages
  function showPopup(message) {
    setPopupMessage(message);

    setTimeout(() => {
      setPopupMessage("");
    }, 2500);
  }


  // BoardPage render;
  return (
    <motion.div
      className="pageSlide"
      initial={{ x: "-100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "-100vw" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <div className="appShell boardNavBar">
        <div className="boardPanel">
          <header className="topBar">
            <div className="inputOptions">
              <div className="inputGroup">
                <input
                  placeholder="Add a new task..."
                  value={newTaskTitle}
                  onChange={(event) => setNewTaskTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAddTask();
                    }
                  }}
                  maxLength="24"
                />

                <button type="button" onClick={handleAddTask}>
                  Add Task
                </button>
              </div>

              <div className="inputGroup">
                <input
                  placeholder="Add a new column..."
                  value={newColumnTitle}
                  onChange={(event) => setNewColumnTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAddColumn();
                    }
                  }}
                  maxLength="24"
                />
                <button onClick={handleAddColumn}>Add Column</button>
              </div>
            </div>
            {popupMessage && (
              <div className="popupMessage">
                {popupMessage}
              </div>
            )}
          </header>

          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <main className="board">
              <LayoutGroup>
                <SortableContext
                  items={expandedColumns.map((column) => column.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {expandedColumns.map((column) => (
                      <SortableColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={column.tasks}
                        onToggleCollapse={toggleColumn}
                        onDeleteColumn={handleDeleteColumn}
                        isColumnDragActive={activeColumnId !== null}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>

                <motion.div
                  layout={activeColumnId !== null ? false : true}
                  className={`collapsedColumnsArea ${
                    minimizedColumns.length === 0
                      ? "collapsedColumnsAreaEmpty"
                      : ""
                  }`}
                  transition={stackTransition}
                >
                  <AnimatePresence initial={false}>
                    {minimizedColumns.map((column) => (
                      <CollapsedColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        onToggleCollapse={toggleColumn}
                        onDeleteColumn={handleDeleteColumn}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>
            </main>

            <DragOverlay>
              {activeTask ? (
                <div className="taskCard taskCardOverlay">
                  <p>{activeTask.title}</p>
                  <span>{activeTask.location || "No location yet"}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <aside className="mapPanel">
          <button className="mapButton" onClick={() => navigate("/")}>
            To Map
          </button>
        </aside>
      </div>
    </motion.div>
  );
}

export default BoardPage;