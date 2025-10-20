import React, { useState } from "react";
import "../css/myFlashcards.css";

function MyFlashcards() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null);

  // Open form
  const handleAddClick = () => {
    setShowForm(true);
    setQuestion("");
    setAnswer("");
    setEditIndex(null);
    setError("");
  };

  // Close form
  const handleClose = () => {
    setShowForm(false);
    setError("");
  };

  // Save flashcard
  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      setError("Please fill out both fields!");
      return;
    }

    const newCard = { question, answer };

    if (editIndex !== null) {
      const updatedCards = [...flashcards];
      updatedCards[editIndex] = newCard;
      setFlashcards(updatedCards);
    } else {
      setFlashcards([...flashcards, newCard]);
    }

    setShowForm(false);
    setQuestion("");
    setAnswer("");
    setError("");
  };

  // Edit existing card
  const handleEdit = (index) => {
    const card = flashcards[index];
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditIndex(index);
    setShowForm(true);
  };

  // Delete card
  const handleDelete = (index) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  // Flip card
  const toggleFlip = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
      <div className="container">
        {!showForm ? (
            <>
              <button className="add-flashcard" onClick={handleAddClick}>
                ➕ Add Flashcard
              </button>

              <div className="card-list-container">
                {flashcards.length === 0 && <p>No flashcards yet.</p>}

                {flashcards.map((card, index) => (
                    <div key={index} className="flashcard-item">
                      <div
                          className={`flip-card ${
                              flippedIndex === index ? "flipped" : ""
                          }`}
                          onClick={() => toggleFlip(index)}
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
                        <button className="edit" onClick={() => handleEdit(index)}>
                          ✏️ Edit
                        </button>
                        <button className="delete" onClick={() => handleDelete(index)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </>
        ) : (
            <div className="add-card">
            <div className="form-container">
              <h3>{editIndex !== null ? "Edit Flashcard" : "Add Flashcard"}</h3>
              <textarea
                  placeholder="Enter question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows="4"
                  cols="40"
              ></textarea>

              <textarea
                  placeholder="Enter answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows="4"
                  cols="40"
              ></textarea>

              {error && <p className="error">{error}</p>}
              <div className="btns">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleClose}>
                  Cancel
                </button>
              </div>
            </div>
            </div>
        )}
      </div>
  );
}

export default MyFlashcards;
