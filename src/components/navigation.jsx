// src/components/Navigation.jsx
import { Link } from "react-router-dom";
import "../css/nav.css"

function Navigation() {
    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/create" className="nav-link">Create Flashcard</Link>
                <Link to="/my" className="nav-link">My Flashcards</Link>
                <Link to="/review" className="nav-link">Review Mode</Link>
                <Link to="/not_memorized" className="nav-link">Not Memorized</Link>
                <Link to="/about" className="nav-link">About</Link>
            </div>
        </nav>
    );
}

export default Navigation;
