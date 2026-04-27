import './App.css';

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
                    <button className="inProgressButton">🟡</button>
                    <button className="doneButton">✅</button>
                  </div>
                </div>
              </div>
            </section>

            {/* <section>
              <h2>Map</h2>
              <div style={{ height: "300px", background: "#eee" }}>
                Map placeholder
              </div>
            </section> */}
          </main>
        </div>
    </div>
  );
}

export default App;
