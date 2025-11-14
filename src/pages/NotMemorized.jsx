import React, { useState, useEffect } from "react";
import "../css/NotMemorized.css";
import { MdDelete } from "react-icons/md";

const API = "http://localhost:5000/api";

function NotMemorized() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notMemorizedCards, setNotMemorizedCards] = useState([]);

  //load cards

  useEffect(() => {
    async function loadWrongCards() {
      const res = await fetch(`${API}/flashcards/not-memorized/${user._id}`);
      const data = await res.json();
      setNotMemorizedCards(data);
    }
    loadWrongCards();
  }, [user._id]);


  const deleteCard = async (card, index) => {
    try {
      await fetch(`${API}/flashcards/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderId: card.folderId,
          index: card.index,
          status: "new",
        }),
      });

      const updated = [...notMemorizedCards];
      updated.splice(index, 1);
      setNotMemorizedCards(updated);
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  // delete
  const clearAllCards = async () => {
    if (!window.confirm("Clear ALL not memorized cards?")) return;

    try {
      for (let card of notMemorizedCards) {
        await fetch(`${API}/flashcards/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folderId: card.folderId,
            index: card.index,
            status: "new",
          }),
        });
      }

      setNotMemorizedCards([]);
    } catch (err) {
      console.error("Error clearing all", err);
    }
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
                        onClick={() => deleteCard(card, index)}
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
