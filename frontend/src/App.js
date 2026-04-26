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
                <input style={{outline: "1px solid #4f4d61"}} placeholder="Enter a task..." />
                <button style={{outline: "1px solid #4f4d61"}}>Add</button>
              </div>

              <div className="taskContainer">
                <div className="taskItem">
                  <span>Example Task</span>

                  <div className="taskButtons">
                    <button style={{outline: "1px solid #4f4d61"}} className="taskBtn"></button>
                    <button style={{outline: "1px solid #4f4d61"}} className="taskBtn"></button>
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
