import "./App.css";
import checkMark from "./assets/checkMark.png"
import inProgress from "./assets/inProgress.png"
import xMark from "./assets/xMark.png"

function App() {
  return (
    <div className = "main">
        <div className = "mainContainer">
          <header>
            <h1> </h1> {/* <h1>HomeBase</h1> */}
          </header>

          <main>
            <section>
              <h2>Tasks</h2>

              <div className="inputRow">
                <input className="entryBox" placeholder="Enter a task..." />
                <button className="addButton">Add</button>
              </div>

              <div className="taskContainer">
                <div className="taskItem">
                  <span>Example Task</span>

                  <div className="taskButtons">
                    <button className="inProgressButton">  
                      <svg className="icon icon-progress" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </button>

                    <button className="doneButton">
                      <svg className="icon icon-done" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12l3 3 5-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
    </div>
  );
}

export default App;
