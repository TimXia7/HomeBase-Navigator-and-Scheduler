import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task, isDeleting = false, onDeleteTask, compact = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`taskCard ${compact ? "taskCardCompact" : ""} ${
        isDragging ? "taskCardDragging" : ""
      } ${isDeleting ? "taskCardDeleting" : ""}`}
      {...listeners}
      {...attributes}
    >
      <div className="taskCardHeader">
        <p>{task.title}</p>

        {onDeleteTask && (
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
        )}
      </div>

      <span>{task.location || "No location yet"}</span>
    </div>
  );
}

export default TaskCard;