import { useDraggable } from "@dnd-kit/core";

function TaskCard({ task, isDeleting, onDeleteTask }) {
  // Make this task card draggable using its unique task id
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`taskCard ${isDragging ? "taskCardDragging" : ""} ${
        isDeleting ? "taskCardDeleting" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="taskCardHeader">
        <p>{task.title}</p>

        <button
          className="deleteTaskButton"
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onDeleteTask(task.id);
          }}
        >
          ×
        </button>
      </div>

      <span>{task.location || "No location yet"}</span>
    </div>
  );
}

export default TaskCard;