import React, { useState, useEffect } from "react";
import "../css/reviewMode.css"; // You can create this CSS file

function ReviewMode() {
 /* const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load flashcards from localStorage
  useEffect(() => {
    const savedFlashcards = localStorage.getItem("flashcards");
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    }
  }, []);

  const nextCard = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  if (flashcards.length === 0) {
    return (
      <div className="review-container">
        <h2>Review Flashcards</h2>
        <p>No flashcards available. Please create some flashcards first.</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="review-container">
      <div className="progress">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      <div 
        className={`review-card ${isFlipped ? "flipped" : ""}`}
        onClick={toggleFlip}
      >
        <div className="review-card-inner">
          <div className="review-card-front">
            <h3>Question</h3>
            <p>{currentCard.question}</p>
            <div className="hint">Click to see answer</div>
          </div>
          <div className="review-card-back">
            <h3>Answer</h3>
            <p>{currentCard.answer}</p>
            <div className="hint">Click to see question</div>
          </div>
        </div>
      </div>

      <div className="review-controls">
        <button onClick={prevCard} disabled={flashcards.length <= 1}>
          ⬅️ Previous
        </button>
        
        <button onClick={toggleFlip}>
          {showAnswer ? "Show Question" : "Show Answer"}
        </button>
        
        <button onClick={nextCard} disabled={flashcards.length <= 1}>
          Next ➡️
        </button>
      </div>

      <div className="card-counter">
        <span>{currentIndex + 1} / {flashcards.length}</span>
      </div>
    </div>
  );
  */
  
}

export default ReviewMode;