import { forwardRef } from "react";
import { motion } from "framer-motion";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TaskCard from "../TaskCard/TaskCard";
import { columnTransition } from "../../constants/boardAnimations";

const SortableColumn = forwardRef(function SortableColumn(
  { // destructured props 
    id,
    title,
    tasks,
    onToggleCollapse,
    onDeleteColumn,
    isColumnDragActive,
  },
  forwardedRef
) { // Sortable drag-and-drop helpers from dnd-kit
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

  // dnd styling  
  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  // Set refs for dnd
  function setRefs(node) {
    // save the actual ref of the column for the dnd kit
    setNodeRef(node);

    // pass the ref to parent as well
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  }

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

          {/* Button pannel for columns */}
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
              className="deleteColumnButton"
              type="button"
              onClick={() => onDeleteColumn(id)}
            >
              🗑️
            </button>

            <button
              className="collapseButton"
              type="button"
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

export default SortableColumn;