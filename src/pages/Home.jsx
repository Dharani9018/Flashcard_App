import "../css/Home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home">

            <p>Create flashcards⚡ Learn faster☄️</p>
            <p>Make your own flashcards and boost your learning efficiency!</p>
            <p>Sign up now to get started!</p>

            <Link to='/register' className="btn-link">Get started</Link>
            <Link to='/login' className="btn-link">Login</Link>

        </div>
    );
}

export default Home;
