import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <>
      <header className="globalHeader">
        <h1>HomeBase</h1>
        <button className="helpButton">?</button>
      </header>

      <main className="navBarContent">
        <AnimatePresence initial={false}>
          <div key={location.pathname} className="routePage">
            {outlet}
          </div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default NavBar;