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
                    <button className="inProgressButton"><img src={inProgress}/></button>
                    <button className="doneButton"><img src={checkMark}/></button>
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
