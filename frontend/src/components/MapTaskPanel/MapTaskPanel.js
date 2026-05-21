
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
                <div key={task.id} className="mapMiniTaskCard">
                  <strong>{task.title}</strong>
                  <span>{task.location || "No location yet"}</span>
                </div>
              ))
            )}
          </div>
        </section>
      ))}
    </aside>
  );
}

export default MapTaskPanel;