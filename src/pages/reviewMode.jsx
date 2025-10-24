import React, { useState, useEffect, useRef } from "react";
import "../css/reviewMode.css";

function ReviewMode() {
  /*const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showBin, setShowBin] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const timerRef = useRef(null);
  const cardRef = useRef(null);

  // Load flashcards from localStorage
  useEffect(() => {
    const savedFlashcards = localStorage.getItem("flashcards");
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    }
  }, []);

  // Load not memorized cards
  const getNotMemorizedCards = () => {
    const saved = localStorage.getItem("notMemorized");
    return saved ? JSON.parse(saved) : [];
  };

  // Save card to not memorized
  const saveToNotMemorized = (card) => {
    const notMemorized = getNotMemorizedCards();
    // Check if card already exists to avoid duplicates
    const cardExists = notMemorized.some(
      c => c.question === card.question && c.answer === card.answer
    );
    
    if (!cardExists) {
      const updatedNotMemorized = [...notMemorized, card];
      localStorage.setItem("notMemorized", JSON.stringify(updatedNotMemorized));
    }
  };

  // Start timer when card changes
  useEffect(() => {
    if (flashcards.length === 0) return;

    // Reset timer and show bin
    setTimeLeft(5);
    setShowBin(true);
    setIsAnimating(false);

    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-save current card to not memorized
          const currentCard = flashcards[currentIndex];
          saveToNotMemorized(currentCard);
          
          // Trigger animation
          setIsAnimating(true);
          
          // Move to next card after animation
          setTimeout(() => {
            setIsAnimating(false);
            setShowBin(false);
            nextCard();
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, flashcards]);

  const nextCard = () => {
    // Clear timer and reset
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsFlipped(false);
    setShowBin(false);
    setIsAnimating(false);
    
    setCurrentIndex((prevIndex) => 
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    // Clear timer and reset
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsFlipped(false);
    setShowBin(false);
    setIsAnimating(false);
    
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
      <div className="card-counter-top">
        <div>Card {currentIndex + 1} of {flashcards.length}</div>
        <div className="timer">Time left: {timeLeft}s</div>
      </div>


      <div className="review-card-wrapper">
        <div 
          ref={cardRef}
          className={`review-card ${isFlipped ? "flipped" : ""} ${isAnimating ? "slide-to-bin" : ""}`}
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
        

        {showBin && (
          <div className="bin-container">
            <div className="bin-icon">🗑️</div>
          </div>
        )}
      </div>


      <div className="review-controls">
        <button onClick={prevCard} disabled={flashcards.length <= 1}>
          ⬅️ Previous
        </button>
        <button onClick={nextCard} disabled={flashcards.length <= 1}>
          Next ➡️
        </button>
      </div>
    </div>
  );*/
}

export default ReviewMode;