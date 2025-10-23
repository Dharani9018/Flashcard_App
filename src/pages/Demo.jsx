import "../css/Demo.css";
import { Link } from "react-router-dom";
import FlashcardDemo from "../components/FlashcardDemo.jsx";

function Demo() {
    return (
        <div className="demo-container">
            <h2>flashcard maker</h2>
            <p className="title">⚔️ The ultimate study weapon ⚔️</p>
            <p className="info">A better way to study with flashcards is here. Creating your own set of flashcards is simple with our free flashcard maker.</p>
            
            <div className="demo">
                <div className="demo-bg">
                    <FlashcardDemo/>
                    <br></br>
                </div>

                <div className="wrapper">
                    <div className="btn">
                        <p>Boost your learning efficiency⚡</p>
                        <p>Sign up now to make your own 🗃️</p>
                        <br></br>
                        <div className="btn-container">
                            <Link to='/register' className="btn-link primary">Get started</Link>
                            <Link to='/login' className="btn-link secondary">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Demo;