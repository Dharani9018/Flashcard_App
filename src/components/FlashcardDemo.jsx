import React, { useState } from "react";
import "../css/FlashcardDemo.css"; // link to the CSS below
import "./ReviewCard.jsx"
import ReviewCard from "./ReviewCard.jsx";
function FlashcardDemo({ question = "How does this site help?", answer = "A web-based Flashcard Maker where users can create, organize, and review flashcards." }) {
    const [flipped, setFlipped] = useState(false);


    const handleClick = () => {
        setFlipped(!flipped);
    };

    return (
        <div className="idk">
        <div className="flashcard-demo">
            <h2>Check out how it looks!!</h2>
        <div className="flashcard-container">
        <div className={`card ${flipped ? "flipped" : ""}`} onClick={handleClick}>
            <h4>Click on the card🧾</h4>
            <div className="card-inner">
                <div className="card-front">
                    <p>{question}</p>
                </div>
                <div className="card-back">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
            <ReviewCard/>
        </div>
            </div>
            </div>
    );
}

export default FlashcardDemo;
