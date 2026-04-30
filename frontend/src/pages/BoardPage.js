import { useState, forwardRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  useDraggable,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";

/* For draggable columns */
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import "./BoardPage.css";

const columnTransition = {
  layout: {
    duration: 0.2,
    ease: "easeInOut",
  },
  opacity: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

const stackTransition = {
  layout: {
    duration: 0.2,
    ease: "easeInOut",
  },
  opacity: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`taskCard ${isDragging ? "taskCardDragging" : ""}`}
      {...listeners}
      {...attributes}
    >
      <p>{task.title}</p>
      <span>{task.location}</span>
    </div>
  );
}

const SortableColumn = forwardRef(function SortableColumn(
  { id, title, tasks, onToggleCollapse, isColumnDragActive },
  forwardedRef
) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  function setRefs(node) {
    setNodeRef(node);

    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  }

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <motion.section
      layout={isColumnDragActive ? false : true}
      ref={setRefs}
      style={style}
      className="column"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={columnTransition}
    >
      <div>
        <div className="columnHeader">
          <h2>{title}</h2>

          <div className="columnHeaderButtons">
            <button
              className="columnDragHandle"
              type="button"
              {...attributes}
              {...listeners}
            >
              ⋮⋮
            </button>

            <button
              className="collapseButton"
              onClick={() => onToggleCollapse(id)}
            >
              −
            </button>
          </div>
        </div>

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </motion.section>
  );
});

function CollapsedColumn({ id, title, onToggleCollapse }) {
  return (
    <motion.section
      layout
      className="column columnCollapsed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={columnTransition}
    >
      <div>
        <button
          className="collapsedColumnButton"
          onClick={() => onToggleCollapse(id)}
        >
          + {title}
        </button>
      </div>
    </motion.section>
  );
}

function BoardPage() {
  const navigate = useNavigate();

  const [activeColumnId, setActiveColumnId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const [columnOrder, setColumnOrder] = useState([
    "newTasks",
    "inProgress",
    "finished",
  ]);

  const [collapsedColumns, setCollapsedColumns] = useState({
    newTasks: false,
    inProgress: false,
    finished: false,
  });

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

  function toggleColumn(columnId) {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }

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

  function handleDragCancel() {
    setActiveColumnId(null);
    setActiveTask(null);
  }

  function handleDragEnd(event) {
    handleDragCancel();

    setActiveColumnId(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const expandedColumnIds = columnOrder.filter(
      (columnId) => !collapsedColumns[columnId]
    );

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

    if (expandedColumnIds.includes(activeId)) {
      return;
    }

    const taskId = activeId;
    const destinationColumn = overId;

    if (!columns[destinationColumn]) return;

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

  function findTaskById(taskId) {
    for (const columnId in columns) {
      const foundTask = columns[columnId].find((task) => task.id === taskId);

      if (foundTask) {
        return foundTask;
      }
    }

    return null;
  }

  const columnData = {
    newTasks: {
      id: "newTasks",
      title: "New Tasks",
      tasks: columns.newTasks,
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: columns.inProgress,
    },
    finished: {
      id: "finished",
      title: "Finished",
      tasks: columns.finished,
    },
  };

  const columnInfo = columnOrder.map((columnId) => columnData[columnId]);

  const expandedColumns = columnInfo.filter(
    (column) => !collapsedColumns[column.id]
  );

  const minimizedColumns = columnInfo.filter(
    (column) => collapsedColumns[column.id]
  );

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

          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToWindowEdges]}
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
                  <span>{activeTask.location}</span>
                </div>
              ) : null}
            </DragOverlay>
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