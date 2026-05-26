import TaskCard from "../TaskCard/TaskCard";

function MapTaskPanel({ columns, columnTitles }) {
  const columnEntries = Object.entries(columns);

  return (
    <aside className="mapTaskPanel">
      {columnEntries.map(([columnId, tasks]) => (
        <section key={columnId} className="mapTaskGroup">
          <h3>{columnTitles[columnId] || "Untitled Column"}</h3>

          <div className="mapMiniTaskList">
            {tasks.length === 0 ? (
              <p className="emptyMapTaskMessage">No tasks</p>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} compact />
              ))
            )}
          </div>
        </section>
      ))}
    </aside>
  );
}

export default MapTaskPanel;