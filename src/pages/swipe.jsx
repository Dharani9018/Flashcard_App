import React, { useState, useEffect, useRef } from "react";
import "../css/swipe.css";
import { useOutletContext } from "react-router-dom";

const API = "http://localhost:5000/api";

function Swipe() {
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [swipeClass, setSwipeClass] = useState("");
  const [chaos, setChaos] = useState(null);

  const timerRef = useRef(null);
  const outletContext = useOutletContext();
  const setPageTitle = outletContext?.setPageTitle || (() => {});

  // Set page title
  useEffect(() => {
    setPageTitle("Review Mode");
  }, [setPageTitle]);

  // Load user safely
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setXp(parsed.xp || 0);
        setLevel(parsed.level || 1);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  // Load flashcards from selected folders only
  useEffect(() => {
    if (!user?._id) return;

    const selectedFolderIds = (() => {
      try {
        const val = sessionStorage.getItem("reviewFolders");
        return val ? JSON.parse(val) : [];
      } catch {
        return [];
      }
    })();

    async function loadCards() {
      try {
        const res = await fetch(`${API}/folders/${user._id}`);
        const data = await res.json();

        // Only include flashcards from selected folders (robust ID comparison)
        const filtered = data.filter(folder =>
          selectedFolderIds.some(selId => String(selId) === String(folder._id))
        );
        const merged = filtered.flatMap((folder) =>
          folder.flashcards.map((card, idx) => ({
            ...card,
            folderId: folder._id,
            index: idx,
          }))
        );

        setFlashcards(merged || []);
      } catch (error) {
        console.error("Error loading flashcards:", error);
      }
    }

    loadCards();
  }, [user?._id]);

  // timer for each card
  useEffect(() => {
    if (flashcards.length === 0) return;

    setTimeLeft(5);
    setSwipeClass("");

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // auto wrong on timeout
          handleWrong(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, flashcards]);

  // mark card as wrong on backend
  const markWrong = async (card) => {
    if (!card) return;
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

  // award xp to user (calls backend)
  const awardXp = async (amount) => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${API}/users/xp`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, xpGain: amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'XP update failed');

      // update local state and localStorage
      setXp(data.xp);
      setLevel(data.level);
      const updatedUser = { ...user, xp: data.xp, level: data.level };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error awarding XP:", err);
    }
  };

  const nextCard = (skipTimerClear = true) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFlipped(false);
    setSwipeClass("");
    setCurrentIndex((i) => (i + 1) % flashcards.length);
  };

  const handleWrong = async (isAuto = false) => {
    const card = flashcards[currentIndex];
    if (!card) return;
    // animate left
    setSwipeClass("out-left");
    if (timerRef.current) clearInterval(timerRef.current);

    // if not already marked wrong (or even if auto), mark backend
    await markWrong(card);

    // small delay for animation
    setTimeout(() => {
      nextCard();
    }, 420);
  };

  const handleRight = async () => {
    const card = flashcards[currentIndex];
    if (!card) return;
    // animate right
    setSwipeClass("out-right");
    if (timerRef.current) clearInterval(timerRef.current);

    // award base XP
    let gain = 10;

    // small chaos chance: 15% chance for bonus XP and visual
    if (Math.random() < 0.15) {
      const bonus = 20 + Math.floor(Math.random() * 31); // 20-50 bonus
      gain += bonus;
      setChaos({ type: "bonus", amount: bonus });
      // clear chaos tag after 2s
      setTimeout(() => setChaos(null), 2000);
    }

    await awardXp(gain);

    setTimeout(() => nextCard(), 420);
  };

  const toggleFlip = () => {
    setIsFlipped((s) => !s);
  };

  // keyboard handlers for J (left/wrong) and L (right/memorized)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "j" || e.key === "J") {
        handleWrong(false);
      } else if (e.key === "l" || e.key === "L") {
        handleRight();
      } else if (e.key === " ") {
        // space to flip
        e.preventDefault();
        toggleFlip();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcards, currentIndex, user, xp, level]);

  if (!user) {
    return (
      <div className="review-container">
        <p>Loading...</p>
      </div>
    );
  }

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
        <div className="card-count">Card {currentIndex + 1} of {flashcards.length}</div>
        <div className="timer">{timeLeft}s left</div>
      </div>

      <div className="review-card-wrapper">
        <div
          role="button"
          tabIndex={0}
          className={`review-card modern ${isFlipped ? "flipped" : ""} ${swipeClass}`}
          onClick={toggleFlip}
        >
          <div className="review-card-inner">
            <div className="review-card-front">
              <p className="card-question">{currentCard.question}</p>
            </div>
            <div className="review-card-back">
              <p className="card-answer">{currentCard.answer}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="review-controls modern-controls">
        <button className="control-btn" onClick={() => { setCurrentIndex((i) => i === 0 ? flashcards.length - 1 : i - 1); }}>⬅️ Prev</button>
        <button className="control-btn wrong" onClick={() => handleWrong(false)}><span></span> Wrong (J)</button>
        <button className="control-btn right" onClick={() => handleRight()}><span></span> Memorized (L)</button>
        <button className="control-btn" onClick={() => { setCurrentIndex((i) => (i + 1) % flashcards.length); }}>Next ➡️</button>
      </div>

      <div className="hint modern-hint">
        <span>Tip:</span> Tap card to flip. J = wrong, L = memorized, Space = flip.
      </div>
    </div>
  );
}

export default Swipe;