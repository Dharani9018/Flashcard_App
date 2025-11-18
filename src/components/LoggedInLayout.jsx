// src/components/LoggedInLayout.jsx
import React, { useEffect } from "react";
import Navigation from "./navigation.jsx";
import Header from "./Header.jsx";
import { Outlet, useLocation } from "react-router-dom";

function LoggedInLayout({ iconcolor, themeIcon, color1, color2, handleThemeChange, sidebar: initialSidebar, pageTitle, setPageTitle, onCardClick }) {
    // compute fallback title based on current path if pageTitle isn't set by child
    const location = useLocation();

    useEffect(() => {
        // If a child component (like MyFlashcards) didn't set a title, set sensible defaults based on path
        if (!pageTitle || pageTitle.trim() === "") {
            const path = location.pathname;
            // map known nested routes to titles
            if (path.includes("/my")) setPageTitle("My Flashcards");
            else if (path.includes("/review")) setPageTitle("Review Mode");
            else if (path.includes("/not_memorized")) setPageTitle("Not Memorized");
            else if (path.includes("/settings")) setPageTitle("Settings");
            else setPageTitle("Home");
        }
    
    }, [location.pathname]);

    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="logged-in-layout">
            {/* Header with page title */}
            <Header
                handleChange={handleThemeChange}
                icon={themeIcon}
                color1={color1}
                color2={color2}
                onCardClick={toggleSidebar}
                isLoggedIn={true}
                title={pageTitle}
            />

            {/* Navigation sidebar */}
            <Navigation iconcolor={iconcolor} sidebar={sidebarOpen} onClose={closeSidebar} />

            <main className="main-content">
                {/* expose setPageTitle to nested routes via Outlet context */}
                <Outlet context={{ setPageTitle }} />
            </main>
        </div>
    );
}

export default LoggedInLayout;
