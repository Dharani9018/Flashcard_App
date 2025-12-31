import "../css/Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
    return (
        <div className="home-container">
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