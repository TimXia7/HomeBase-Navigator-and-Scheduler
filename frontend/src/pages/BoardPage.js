import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import "./BoardPage.css";

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="taskCard"
      {...listeners}
      {...attributes}
    >
      <p>{task.title}</p>
      <span>{task.location}</span>
    </div>
  );
}

function Column({ id, title, tasks, isCollapsed, onToggleCollapse }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={`column ${isCollapsed ? "columnCollapsed" : ""}`}
    >
      <div className="columnHeader">
        <h2>{title}</h2>

        <button className="collapseButton" onClick={() => onToggleCollapse(id)}>
          {isCollapsed ? "Maximize" : "Minimize"}
        </button>
      </div>

      {!isCollapsed &&
        tasks.map((task) => <TaskCard key={task.id} task={task} />)}
    </section>
  );
}

function BoardPage() {
  const navigate = useNavigate();

  const [collapsedColumns, setCollapsedColumns] = useState({
    newTasks: false,
    inProgress: false,
    finished: false,
  });

  function toggleColumn(columnId) {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }


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

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const destinationColumn = over.id;

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

    setColumns((prevColumns) => ({
      ...prevColumns,
      [sourceColumn]: prevColumns[sourceColumn].filter(
        (task) => task.id !== taskId
      ),
      [destinationColumn]: [...prevColumns[destinationColumn], movedTask],
    }));
  }

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
            <div className="taskInput">
              <input placeholder="Add a new task..." />
              <button>Add</button>
            </div>
          </header>

          <DndContext onDragEnd={handleDragEnd}>
            <main className="board">
              <Column
                id="newTasks"
                title="New Tasks"
                tasks={columns.newTasks}
                isCollapsed={collapsedColumns.newTasks}
                onToggleCollapse={toggleColumn}
              />

              <Column
                id="inProgress"
                title="In Progress"
                tasks={columns.inProgress}
                isCollapsed={collapsedColumns.inProgress}
                onToggleCollapse={toggleColumn}
              />

              <Column
                id="finished"
                title="Finished"
                tasks={columns.finished}
                isCollapsed={collapsedColumns.finished}
                onToggleCollapse={toggleColumn}
              />
            </main>
          </DndContext>
        </div>

        <aside className="mapPanel">
          <button className="mapButton" onClick={() => navigate("/map")}>
            To Map
          </button>
        </aside>
      </div>
    </motion.div>
  );
}

export default BoardPage;