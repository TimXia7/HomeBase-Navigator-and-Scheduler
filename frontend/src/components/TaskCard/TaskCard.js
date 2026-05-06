import { useDraggable } from "@dnd-kit/core";

function TaskCard({ task }) {

  // Make this task card draggable using its unique task id
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      // Tell dnd-kit which DOM element should be draggable
      ref={setNodeRef}

      // Add a dragging class while the task is being dragged
      className={`taskCard ${isDragging ? "taskCardDragging" : ""}`}

      // Add dnd-kit drag event handlers and accessibility attributes
      {...listeners}
      {...attributes}
    >
      <p>{task.title}</p>
      <span>{task.location}</span>
    </div>
  );
}

export default TaskCard;