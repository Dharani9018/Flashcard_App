import React, { useState, useEffect } from "react";
import "../css/reviewMode.css";

function ReviewMode() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Load flashcards from localStorage
  useEffect(() => {
    const savedFlashcards = localStorage.getItem("flashcards");
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    }
  }, []);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (flashcards.length === 0) {
    return (
      <div className="review-container">
        <p>No flashcards available. Please create some flashcards first.</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="review-container">
      {/* Card counter at the top */}
      <div className="card-counter-top">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      {/* Flashcard in the middle */}
      <div className="review-card-wrapper">
        <div 
          className={`review-card ${isFlipped ? "flipped" : ""}`}
          onMouseEnter={toggleFlip}
          onMouseLeave={toggleFlip}
        >
          <div className="review-card-inner">
            <div className="review-card-front">
              <p>{currentCard.question}</p>
            </div>
            <div className="review-card-back">
              <p>{currentCard.answer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons at the bottom */}
      <div className="review-controls">
        <button onClick={prevCard} disabled={flashcards.length <= 1}>
          ⬅️ Previous
        </button>
        <button onClick={nextCard} disabled={flashcards.length <= 1}>
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default ReviewMode;