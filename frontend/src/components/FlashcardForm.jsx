import React from "react";
import "../css/FlashcardForm.css";

function FlashcardForm({ 
  question, 
  setQuestion, 
  answer, 
  setAnswer, 
  editIndex, 
  error, 
  onSave, 
  onCancel 
}) {
  return (
    <div className="add-card">
      <div className="form-container">
        <h3>{editIndex !== null ? "Edit Flashcard" : "Add Flashcard"}</h3>
        <textarea
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows="4"
        />
        <textarea
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows="4"
        />
        {error && <p className="error">{error}</p>}
        <div className="btns">
          <button className="save-btn" onClick={onSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardForm;