import { useDraggable } from "@dnd-kit/core";

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

export default TaskCard;