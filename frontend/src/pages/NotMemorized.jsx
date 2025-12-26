import { useState, useEffect } from "react";
import "../css/NotMemorized.css";
import { MdDelete } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

const API = "http://localhost:5000/api";

function NotMemorized() {
    const outletContext = useOutletContext();
    const setPageTitle = outletContext?.setPageTitle || (() => {});

    useEffect(() => {
        setPageTitle("Not memorized");
    }, [setPageTitle]);

    const [user, setUser] = useState(null);
    const [notMemorizedCards, setNotMemorizedCards] = useState([]);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        if (!user?._id) return;
        
        async function loadNotMemorizedCards() {
            try {
                const res = await fetch(`${API}/flashcards/not-memorized/${user._id}`);
                if (!res.ok) throw new Error('Failed to fetch cards');
                const data = await res.json();
                setNotMemorizedCards(data);
            } catch (err) {
                console.error("Error loading not memorized cards:", err);
            }
        }
        loadNotMemorizedCards();
    }, [user?._id]);

    const deleteCard = async (card, index) => {
        try {
            const response = await fetch(`${API}/flashcards/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id, // NEW
                    folderIndex: card.folderIndex, // CHANGED from folderId
                    cardIndex: card.cardIndex, // CHANGED from index
                    status: "new",
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update card status');
            }

            const updated = [...notMemorizedCards];
            updated.splice(index, 1);
            setNotMemorizedCards(updated);
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    const clearAllCards = async () => {
        if (!window.confirm("Clear ALL not memorized cards?")) return;

        try {
            const updatePromises = notMemorizedCards.map(card => 
                fetch(`${API}/flashcards/status`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user._id, // NEW
                        folderIndex: card.folderIndex, // CHANGED
                        cardIndex: card.cardIndex, // CHANGED
                        status: "new",
                    }),
                })
            );

            await Promise.all(updatePromises);
            setNotMemorizedCards([]);
        } catch (err) {
            console.error("Error clearing all", err);
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="not-memorized-container">
            <div className="not-memorized-header">
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
                        <div key={`${card.folderIndex}-${card.cardIndex}`} className="not-memorized-card">
                            <div className="card-content">
                                <div className="card-folder">
                                    <strong>Folder:</strong> {card.folderName}
                                </div>
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