// src/components/LoggedInLayout.jsx
import React, { useState } from "react";
import Navigation from "./navigation.jsx";
import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";

function LoggedInLayout({ iconcolor, themeIcon, color1, color2, handleThemeChange }) 
{
    const [sidebar, setSidebar] = useState(false);

    const toggleSidebar = () => setSidebar(!sidebar);
    const closeSidebar = () => setSidebar(false);

    return (
        <div className="logged-in-layout">
            {/* Header with card icon that toggles sidebar */}
            <Header 
                handleChange={handleThemeChange}
                icon={themeIcon}
                color1={color1}
                color2={color2}
                onCardClick={toggleSidebar}
                isLoggedIn={true}
            />
            
            {/* Navigation sidebar */}
            <Navigation 
                iconcolor={iconcolor}
                sidebar={sidebar}
                onClose={closeSidebar}
            />
            
            <main className="main-content">
                <Outlet /> 
            </main>
        </div>
    );
}

export default LoggedInLayout;