import { motion } from 'framer-motion'
import { useNavigate } from "react-router-dom";

import "./BoardPage.css";

function BoardPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      className="pageSlide"
      initial={{ x: "-100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "-100vw" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <div className="appShell boardLayout">
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
      </motion.div>
  );
}

export default BoardPage;