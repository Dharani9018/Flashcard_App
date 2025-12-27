import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import "../css/FlashcardItem.css";

function FlashcardItem({ 
  card, 
  index, 
  isFlipped, 
  onFlip, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="flashcard-item">
      <div
        className={`flip-card ${isFlipped ? "flipped" : ""}`}
        onClick={() => onFlip(index)}
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

      <div className="buttons-con">
        <button
          className="edit"
          onClick={() => onEdit(index)}
          aria-label="Edit flashcard"
        >
          <MdOutlineModeEdit size={20} />
        </button>
        <button
          className="delete"
          onClick={() => onDelete(index)}
          aria-label="Delete flashcard"
        >
          <MdDelete size={20} />
        </button>
      </div>
    </div>
  );
}

export default FlashcardItem;