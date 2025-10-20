import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Header from "./components/Header.jsx";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/navigation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateFlashcards from "./pages/CreateFlashcards.jsx";
import MyFlashcards from "./pages/MyFlashcards.jsx";
import ReviewMode from "./pages/reviewMode.jsx";
import NotMemorized from "./pages/NotMemorized.jsx";
import About from "./pages/About.jsx";
import "../src/css/App.css"



function App() {
    return (
        <>
            <Header /> {/* Header visible on all pages */}
            <Navigation /> {/* Navigation links visible on all pages */}
            <main className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/create" element={<CreateFlashcards />} /> {/*element is function name*/}
                    <Route path="/my" element={<MyFlashcards/>} />
                    <Route path="/review" element={<ReviewMode/>} />
                    <Route path="/not_memorized" element={<NotMemorized/>} />
                    <Route path="/about" element={<About/>} />
                </Routes>
            </main>
        </>
    );
}

export default App;
