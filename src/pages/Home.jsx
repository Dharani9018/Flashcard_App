import "../css/Home.css";
import { Link } from "react-router-dom";
import FlashcardDemo from "../components/FlashcardDemo.jsx";



function Home() {
    return (
        <div className="home">

            <h1>Create flashcards⚡ Learn faster☄️</h1>
            <br></br>
            <h5>Make your own flashcards and boost your learning efficiency!</h5>
            <br></br>

        <div>
            <FlashcardDemo/>
            <br></br>
        </div>

            <div className="wrapper">
            <div className="btn">
                <p>Sign up now to make your own!!</p>
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
