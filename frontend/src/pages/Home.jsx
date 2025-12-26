import "../css/Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NUM_CARDS = 50;

function Home() {
    const colors = [
        "rgba(255, 182, 193, 0.55)",
        "rgba(255, 205, 255, 0.55)",
        "rgba(200, 180, 255, 0.55)",
        "rgba(255, 220, 180, 0.55)",
        "rgba(180, 230, 255, 0.55)",
        "rgba(200, 255, 200, 0.55)",
        "rgba(255, 235, 195, 0.55)",
    ];

    const renderFlashcards = () =>
        Array.from({ length: NUM_CARDS }).map((_, i) => {
            const left = Math.random() * 100 + "%";
            const top = Math.random() * 100 + "%";
            const duration = 12 + Math.random() * 18 + "s";
            const delay = Math.random() * 5 + "s";
            const color = colors[Math.floor(Math.random() * colors.length)];

            return (
                <div
                    key={i}
                    className="home-float card-3d"
                    style={{
                        left,
                        top,
                        animationDuration: duration,
                        animationDelay: delay,
                        "--card-color": color,
                    }}
                >
                    <div className="home-card-face home-card-front">Q?</div>
                    <div className="home-card-face home-card-back">A.</div>
                </div>
            );
        });

    return (
        <div className="home-container">
            <div className="enhanced-bg">{renderFlashcards()}</div>

            <motion.h1
                className="home-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                WELCOME TO FLASHCARD MAKER
            </motion.h1>

            <p className="home-subtitle">your personalized study companion</p>

            <div className="home-buttons">
                <Link to="/login/home/my" className="home-btn">My Flashcards</Link>
                <Link to="/login/home/not_memorized" className="home-btn">Not Reviewed</Link>
                <Link to="/login/home/review" className="home-btn">Review Mode</Link>
                <Link to="/login/home/settings" className="home-btn">Settings</Link>
            </div>
        </div>
    );
}

export default Home;
