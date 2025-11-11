import React, { useState, useEffect } from "react";
import "../css/NotMemorized.css";
import { MdDelete } from "react-icons/md";

function NotMemorized() {
  const [notMemorizedCards, setNotMemorizedCards] = useState([]);

  useEffect(() => {
    const savedCards = localStorage.getItem("notMemorized");
    if (savedCards) {
      setNotMemorizedCards(JSON.parse(savedCards));
    }
  }, []);

  const clearAllCards = () => {
    localStorage.removeItem("notMemorized");
    setNotMemorizedCards([]);
  };

  const deleteCard = (index) => {
    const updatedCards = notMemorizedCards.filter((_, i) => i !== index);
    setNotMemorizedCards(updatedCards);
    localStorage.setItem("notMemorized", JSON.stringify(updatedCards));
  };

  return (
    <div className="not-memorized-container">
      <div className="not-memorized-header">
        <h2>Not Memorized Cards</h2>
        {notMemorizedCards.length > 0 && (
          <button className="clear-all-btn" onClick={clearAllCards}>
            Clear All
          </button>
        )}
      </div>

      {notMemorizedCards.length === 0 ? (
        <p>No cards marked as not memorized yet.</p>
      ) : (
        <div className="not-memorized-list">
          {notMemorizedCards.map((card, index) => (
            <div key={index} className="not-memorized-card">
              <div className="card-content">
                <div className="card-question">
                  <strong>Q:</strong> {card.question}
                </div>
                <div className="card-answer">
                  <strong>A:</strong> {card.answer}
                </div>
              </div>
              <button 
                className="delete-card-btn"
                onClick={() => deleteCard(index)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotMemorized;