import { MdOutlineModeEdit } from "react-icons/md";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import "../css/FlashcardItem.css";

function FlashcardItem({ 
  card, 
  index, 
  isFlipped, 
  onFlip, 
  onEdit, 
  onSelect,
  isSelected,
  selectionMode
}) {
  return (
    <div className="flashcard-item">
      <div
        className={`flip-card ${isFlipped ? "flipped" : ""}`}
        onClick={(e) => {
          // Only flip if not clicking on checkbox or edit button
          if (!e.target.closest('.checkbox-container') && 
              !e.target.closest('.edit-button-container')) {
            onFlip(index);
          }
        }}
      >
        <div className="flip-card-inner">
          {/* Front side */}
          <div className="flip-card-front">
            {selectionMode && (
              <div 
                className="checkbox-container"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(index);
                }}
              >
                {isSelected ? (
                  <BsCheckSquare className="checkbox checked" />
                ) : (
                  <BsSquare className="checkbox" />
                )}
              </div>
            )}
            
            {/* Edit button on front side */}
            {!selectionMode && (
              <button
                className="edit-button-container"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(index);
                }}
                aria-label="Edit flashcard"
              >
                <MdOutlineModeEdit className="edit-icon" />
              </button>
            )}
            
            <p>{card.question}</p>
          </div>
          
          {/* Back side */}
          <div className="flip-card-back">
            {selectionMode && (
              <div 
                className="checkbox-container"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(index);
                }}
              >
                {isSelected ? (
                  <BsCheckSquare className="checkbox checked" />
                ) : (
                  <BsSquare className="checkbox" />
                )}
              </div>
            )}
            
            {/* Edit button on back side */}
            {!selectionMode && (
              <button
                className="edit-button-container"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(index);
                }}
                aria-label="Edit flashcard"
              >
                <MdOutlineModeEdit className="edit-icon" />
              </button>
            )}
            
            <p>{card.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashcardItem;