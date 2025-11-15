import React, { useState, useEffect, useRef } from "react";
import "../css/reviewMode.css";
import { useOutletContext } from "react-router-dom";

const API = "http://localhost:5000/api";

function ReviewMode() {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null); // correct | wrong | timeout
  const [timeLeft, setTimeLeft] = useState(15);

  const timerRef = useRef(null);
  const outletContext = useOutletContext();
  const setPageTitle = outletContext?.setPageTitle || (() => {});

  useEffect(() => {
    setPageTitle("Review Mode");
  }, [setPageTitle]);

  // Load user
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) setUser(JSON.parse(data));
  }, []);

  // Load flashcards
  useEffect(() => {
    if (!user?._id) return;

    async function loadCards() {
      try {
        const res = await fetch(`${API}/folders/${user._id}`);
        const data = await res.json();

        const merged = data.flatMap(folder =>
            folder.flashcards.map((card, idx) => ({
              ...card,
              folderId: folder._id,
              index: idx,
            }))
        );

        setFlashcards(merged);
      } catch (err) {
        console.error(err);
      }
    }

    loadCards();
  }, [user?._id]);

  // Timer logic
  useEffect(() => {
    if (!flashcards.length) return;

    setIsFlipped(false);
    setFeedback(null);
    setUserAnswer("");
    setTimeLeft(15);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(sec => {
        if (sec <= 1) {
          clearInterval(timerRef.current);
          markWrong(flashcards[currentIndex]);
          setFeedback("timeout");
          setIsFlipped(true);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  const markWrong = async (card) => {
    try {
      await fetch(`${API}/flashcards/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderId: card.folderId,
          index: card.index,
          status: "not-memorized",
        }),
      });
    } catch (err) {
      console.error("Error marking wrong", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearInterval(timerRef.current);

    const card = flashcards[currentIndex];
    const correct = card.answer.trim().toLowerCase();
    const typed = userAnswer.trim().toLowerCase();

    if (typed === correct) {
      setFeedback("correct");
    } else {
      setFeedback("wrong");
      await markWrong(card);
    }

    setIsFlipped(true);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setFeedback(null);
    setUserAnswer("");
    setCurrentIndex(i => (i + 1 < flashcards.length ? i + 1 : 0));
  };

  if (!user) return <p>Loading...</p>;
  if (!flashcards.length) return <p>No flashcards found.</p>;

  const card = flashcards[currentIndex];

  return (
      <div className="review-container">

        <div className="card-counter-top">
          <div>Card {currentIndex + 1} of {flashcards.length}</div>
          <div className="timer">Time left: {timeLeft}s</div>
        </div>

        {/* YOUR EXACT CARD UI */}
        <div className={`Rev-card ${isFlipped ? "flipped" : ""}`}>
          <div className="inner">

            {/* FRONT SIDE */}
            <div className="front">
              <div className="card-content">
                <p className="question">{card.question}</p>

                <form onSubmit={handleSubmit}>
                <textarea
                    className="answer-input"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    rows="3"
                    disabled={feedback}
                />

                  {!feedback && (
                      <button type="submit" className="submit-btn">
                        Submit Answer
                      </button>
                  )}
                </form>
              </div>
            </div>

            {/* BACK SIDE */}
            <div className="back">
              <div className="card-content">

                <p className="answer-label">Your Answer:</p>
                <p className="user-answer">"{userAnswer || "—"}"</p>

                <p className="answer-label">Correct Answer:</p>
                <p className="answer-text">{card.answer}</p>

                {feedback === "correct" && (
                    <p className="feedback-correct">✔ Correct!</p>
                )}
                {feedback === "wrong" && (
                    <p className="feedback-wrong">✖ Wrong</p>
                )}
                {feedback === "timeout" && (
                    <p className="feedback-timeout">⏱ Time’s Up</p>
                )}

                <button onClick={nextCard} className="back-btn">
                  Next →
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>
  );
}

export default ReviewMode;
