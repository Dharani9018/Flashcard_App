// src/App.jsx - UPDATED
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Header from "./components/Header.jsx";
import { Routes, Route } from "react-router-dom";
import Demo from "./pages/Demo.jsx";
import MyFlashcards from "./pages/MyFlashcards.jsx";
import ReviewMode from "./pages/reviewMode.jsx";
import NotMemorized from "./pages/NotMemorized.jsx";
import "../src/css/App.css";
import Footer from "./components/Footer.jsx";
import { FaSun, FaMoon } from "react-icons/fa";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoggedInLayout from "./components/LoggedInLayout.jsx";
import Settings from "./pages/Settings.jsx";
import { useState, useEffect } from "react";
import About from "./pages/about.jsx"

function App() {
    const [isDark, setIsDark] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    }

    return (
        <div data-theme={isDark ? "dark" : "light"}>
            <Routes> 
                <Route path="/login" element={null} />
                <Route path="/register" element={null} />
                <Route path="/login/*" element={null} />

                <Route path="*" element={
                    <Header 
                        handleChange={() => setIsDark(!isDark)}
                        icon={isDark ? FaSun : FaMoon}
                        color1={isDark ? "#fffbc7" : "#283452"}
                        color2={isDark ? "#8d00b1ff" : "black"}
                        isLoggedIn={false}
                        onCardClick={() => {}} // Add empty function for public routes
                    />
                } />
            </Routes>

            <main className="app-container">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Demo />} />

                    {/* Login Page */}
                    <Route
                        path="/login"
                        element={<Login onLoginSuccess={handleLoginSuccess} />}
                    />

                    {/* Register Page */}
                    <Route path="/register" element={<Register />} />

                    {/* PROTECTED ROUTES */}
                    <Route
                        path="/login/home"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <LoggedInLayout
                                    iconcolor={isDark ? "white" : "black"}
                                    themeIcon={isDark ? FaSun : FaMoon} 
                                    color1={isDark ? "#fffbc7" : "#283452"} 
                                    color2={isDark ? "#8d00b1ff" : "black"} 
                                    handleThemeChange={() => setIsDark(!isDark)} 
                                />
                            </ProtectedRoute>
                        }
                    >
                        {/* Nested routes accessible only after login */}
                        <Route index element={<Home />} />
                        <Route path="my" element={<MyFlashcards />} />
                        <Route path="review" element={<ReviewMode />} />
                        <Route path="not_memorized" element={<NotMemorized />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="about" element={<About />} />
                    </Route>
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;