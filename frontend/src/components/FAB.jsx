import { IoIosArrowDropleft } from "react-icons/io";
import { CiImport } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import "../css/FAB.css";

function FAB({ 
  fabOpen, 
  onToggleFab, 
  onImportClick, 
  onAddClick 
}) {
  return (
    <div className={`fab-wrapper ${fabOpen ? "open" : ""}`}>
      <div className="fab-main" onClick={onToggleFab}>
        <IoIosArrowDropleft size={38} />
      </div>

      <div className="fab-menu">
        <div className="fab-icon" onClick={onImportClick}>
          <CiImport size={28} />
          <span className="fab-tooltip">Import CSV</span>
        </div>

        <div className="fab-icon" onClick={onAddClick}>
          <IoMdAddCircleOutline size={30} />
          <span className="fab-tooltip">Add</span>
        </div>
      </div>
    </div>
  );
}

export default FAB;