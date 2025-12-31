import { IoIosArrowDropleft } from "react-icons/io";
import { CiImport } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdSelectAll } from "react-icons/md";
import "../css/FAB.css";
import { IoArrowBack } from "react-icons/io5";

function FAB({ 
  fabOpen, 
  onToggleFab, 
  onImportClick, 
  onAddClick,
  onBackClick,
  onSelectClick
}) {
  return (
    <>
      <div className="fab-back" onClick={onBackClick}>
        <IoArrowBack size={30} />
      </div>
      
      <div className={`fab-wrapper ${fabOpen ? "open" : ""}`}>
        <div className="fab-main" onClick={onToggleFab}>
          <IoIosArrowDropleft size={35} />
        </div>
        <div className="fab-menu">
          <div className="fab-icon" onClick={onSelectClick}>
            <MdSelectAll size={28} />
            <span className="fab-tooltip">Select Cards</span>
          </div>
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
    </>
  );
}

export default FAB;