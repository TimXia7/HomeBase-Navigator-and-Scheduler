import { useNavigate } from "react-router-dom";

import "./BoardPage.css";

function BoardPage() {
  const navigate = useNavigate();
  return (
    <div className="appShell">
      <div className="boardPanel">
        <header className="topBar">
          <h1>HomeBase</h1>

          <div className="taskInput">
            <input placeholder="Add a new task..." />
            <button>Add</button>
          </div>
        </header>

        <main className="board">
          <section className="column">
            <h2>New Tasks</h2>

            <div className="taskCard">
              <p>Example task</p>
              <span>No location yet</span>
            </div>
          </section>

          <section className="column">
            <h2>In Progress</h2>
          </section>

          <section className="column">
            <h2>Finished</h2>
          </section>
        </main>
      </div>

      <aside className="mapPanel">
        <button className="mapButton" onClick={() => navigate("/map")}>To Map</button>
      </aside>
    </div>
  );
}

export default BoardPage;