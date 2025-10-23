import React, { useState } from "react";
import "../css/ReviewCard.css";

function ReviewCard({ question = "is life worth living tho", answer = "nope not at all lorem" }) {
    const [flipped, setFlipped] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setFlipped(true);
    };

    const handleReset = () => {
        setFlipped(false);
        setUserAnswer("");
    };

    return (
        <div className="review-container">
            <div className={`Rev-card ${flipped ? "flipped" : ""}`}>
                
                <div className="inner">
                    {/* FRONT: Question with text area */}
                    <div className="front">
                        <div className="card-content">
                            <p className="question">{question}</p>
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    className="answer-input"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Type your answer..."
                                    rows="3"
                                />
                                <button type="submit" className="submit-btn">
                                    Submit Answer
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* BACK: Shows correct answer */}
                    <div className="back">
                        <div className="card-content">
                            <p className="answer-label">Your Answer:</p>
                            <p className="user-answer">"{userAnswer}"</p>
                            <p className="answer-label">Correct Answer:</p>
                            <p className="answer-text">{answer}</p>
                            <button onClick={handleReset} className="back-btn">
                                Try Another
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewCard;