import { MdDelete } from "react-icons/md";
import "../css/FolderItem.css";

function FolderItem({ folder, index, onOpen, onDelete }) {
  return (
    <div className="folder-card">
      <h3 onClick={() => onOpen(index)} className="folder-card-title">
        {folder.name}
      </h3>
      <button
        className="delete-folder"
        onClick={() => onDelete(index)}
        aria-label={`Delete ${folder.name}`}
      >
        <MdDelete size={20} />
      </button>
    </div>
  );
}

export default FolderItem;