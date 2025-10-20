import "../css/Home.css";
import { Link } from "react-router-dom";
import FlashcardDemo from "../components/FlashcardDemo.jsx";



function Home() {
    return (
        <div className="home">
            <p className="title">⚔️ The ultimate study weapon ⚔️</p>
            <p className="info">A better way to study with flashcards is here. Creating your own set of flashcards is simple with our free flashcard maker — just add a term and definition.</p>

        <div>
            <FlashcardDemo/>
            <br></br>
        </div>

            <div className="wrapper">
            <div className="btn">
                <p>Boost your learning efficiency⚡</p>
                <p>Sign up now to make your own 🗃️</p>
                <br></br>
            <div className="btn-container">
            <Link to='/register' className="btn-link">Get started</Link>
            <Link to='/login' className="btn-link">Login</Link>
            </div>
            </div>
            </div>

        </div>
    );
}

export default Home;
