import React, { useState, useEffect, useRef } from "react";
import "../css/reviewMode.css";
import { useOutletContext } from "react-router-dom";

const API = "http://localhost:5000/api";

function ReviewMode() {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showBin, setShowBin] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const timerRef = useRef(null);    
  const outletContext = useOutletContext();
  const setPageTitle = outletContext?.setPageTitle || (() => {});

  // Set page title
  useEffect(() => {
    setPageTitle("Review Mode"); // Changed from "Home" to "Review Mode"
  }, [setPageTitle]);

  // Load user safely
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  // Load flashcards when user is available
  useEffect(() => {
    if (!user?._id) return;

    async function loadCards() {
      try {
        const res = await fetch(`${API}/folders/${user._id}`);
        const data = await res.json();

        const merged = data.flatMap(folder =>
          folder.flashcards.map(card => ({
            ...card,
            folderId: folder._id,
            index: folder.flashcards.indexOf(card),
          }))
        );

        setFlashcards(merged);
      } catch (error) {
        console.error("Error loading flashcards:", error);
      }
    }

    loadCards();
  }, [user?._id]);

  // Timer logic
  useEffect(() => {
    if (flashcards.length === 0) return;

    setTimeLeft(5);
    setShowBin(true);
    setIsAnimating(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);

          markWrong(flashcards[currentIndex]); // AUTO MARK WRONG

          setIsAnimating(true);

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

    return () => clearInterval(timerRef.current);
  }, [currentIndex, flashcards]);

  // Mark card as wrong
  const markWrong = async (card) => {
    try {
      await fetch(`${API}/flashcards/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderId: card.folderId,
          index: card.index,
          status: "wrong",
        }),
      });
    } catch (error) {
      console.error("Error marking card as wrong:", error);
    }
  };

  const nextCard = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFlipped(false);
    setCurrentIndex((i) => (i + 1) % flashcards.length);
  };

  const prevCard = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFlipped(false);
    setCurrentIndex((i) =>
      i === 0 ? flashcards.length - 1 : i - 1
    );
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Show loading while user data is being fetched
  if (!user) {
    return (
      <div className="review-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Show message when no flashcards available
  if (flashcards.length === 0) {
    return (
      <div className="review-container">
        <p>No flashcards available.</p>
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
          className={`review-card ${isFlipped ? "flipped" : ""} ${
            isAnimating ? "slide-to-bin" : ""
          }`}
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
        <button onClick={prevCard}>⬅️ Previous</button>
        <button onClick={nextCard}>Next ➡️</button>
      </div>
    </div>
  );
}

export default ReviewMode;