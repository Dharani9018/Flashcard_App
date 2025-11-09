import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Header from "./components/Header.jsx";
import { Routes, Route } from "react-router-dom";
import Demo from "./pages/Demo.jsx";
import MyFlashcards from "./pages/MyFlashcards.jsx";
import ReviewMode from "./pages/reviewMode.jsx";
import NotMemorized from "./pages/NotMemorized.jsx";
import "../src/css/App.css"
import Footer from "./components/Footer.jsx";
import {useState} from "react";
import {FaSun,FaMoon}  from "react-icons/fa";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 
import LoggedInLayout from "./components/LoggedInLayout.jsx";
import Settings from "./pages/Settings.jsx";
//FaSun
//FaMoon

function App() {
    const [isDark, setIsDark] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div data-theme={isDark ? "dark" : "light"}>
            <Header 
                handleChange={() => setIsDark(!isDark)}
                icon={isDark ? FaSun : FaMoon}
                color1={isDark ? "#fffbc7" : "#283452"}
                color2={isDark ? "#8d00b1ff" : "black"}
            />
            <main className="app-container">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Demo />} />
                    <Route path="/login" element={
                        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
                    } />
                    <Route path="/register" element={<Register />} />
                    
                    
                    <Route path="/login/home" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <LoggedInLayout 
                                iconcolor={isDark ? "white" : "black"} 
                           />
                        </ProtectedRoute>
                    }>
                        
                        <Route index element={<Home />} />
                        <Route path="my" element={<MyFlashcards />} />
                        <Route path="review" element={<ReviewMode />} />
                        <Route path="not_memorized" element={<NotMemorized />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;