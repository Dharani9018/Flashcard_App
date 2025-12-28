import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import "../css/FlashcardItem.css";

function FlashcardItem({ 
  card, 
  index, 
  isFlipped, 
  onFlip, 
  onEdit, 
  onDelete,
  isSelectionMode = false,
  isSelected = false,
  onSelect = () => {}
}) {
  const handleCardClick = (e) => {
    // If in selection mode, don't flip - just select
    if (isSelectionMode) {
      e.stopPropagation();
      onSelect(index);
    } else {
      onFlip(index);
    }
  };

  return (
    <div className={`flashcard-item ${isSelectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`}>
      {/* Selection checkbox - only shown in selection mode */}
      {isSelectionMode && (
        <input
          type="checkbox"
          className="select-checkbox"
          checked={isSelected}
          onChange={() => onSelect(index)}
        />
      )}
      
      <div
        className={`flip-card ${isFlipped ? "flipped" : ""}`}
        onClick={handleCardClick}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p>{card.question}</p>
          </div>
          <div className="flip-card-back">
            <p>{card.answer}</p>
          </div>
        </div>
      </div>

      {/* Buttons - hidden in selection mode */}
      {!isSelectionMode && (
        <div className="buttons-con">
          <button
            className="edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(index);
            }}
            aria-label="Edit flashcard"
          >
            <MdOutlineModeEdit size={20} />
          </button>
          <button
            className="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            aria-label="Delete flashcard"
          >
            <MdDelete size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default FlashcardItem;