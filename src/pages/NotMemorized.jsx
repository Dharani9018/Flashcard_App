import React, { useState, useEffect } from "react";
import "../css/NotMemorized.css";
import { MdDelete } from "react-icons/md";

const API = "http://localhost:5000/api";

function NotMemorized() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [wrongCards, setWrongCards] = useState([]);

  useEffect(() => {
    loadWrongCards();
  }, []);

  const loadWrongCards = async () => {
    const res = await fetch(`${API}/flashcards/not-memorized/${user._id}`);
    const data = await res.json();
    setWrongCards(data);
  };

  return (
      <div className="not-memorized-container">
        <h2>Not Memorized Cards</h2>

        {wrongCards.length === 0 ? (
            <p>No cards marked as wrong yet.</p>
        ) : (
            <div className="not-memorized-list">
              {wrongCards.map((card, index) => (
                  <div key={index} className="not-memorized-card">
                    <div className="card-content">
                      <p><strong>Q:</strong> {card.question}</p>
                      <p><strong>A:</strong> {card.answer}</p>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

export default NotMemorized;
