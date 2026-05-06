import { motion } from "framer-motion";

import { columnTransition } from "../../constants/boardAnimations";

function CollapsedColumn({ id, title, onToggleCollapse, onDeleteColumn }) {
  return (
    // Render the minimized version of a task column
    <motion.section
      layout
      className="column columnCollapsed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={columnTransition}
    >
      <div className="collapsedColumnContent">
        {/* Restore the collapsed column when clicked */}
        <button
          className="collapsedColumnButton"
          type="button"
          onClick={() => onToggleCollapse(id)}
        >
          + {title}
        </button>

        {/* Delete the column without also triggering the restore button */}
        <button
          className="deleteCollapsedColumnButton"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteColumn(id);
          }}
        >
          🗑
        </button>
      </div>
    </motion.section>
  );
}

export default CollapsedColumn;