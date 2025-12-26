import React, { useEffect } from "react";
import Navigation from "./navigation.jsx";
import Header from "./Header.jsx";
import { Outlet, useLocation } from "react-router-dom";

function LoggedInLayout({ iconcolor, themeIcon, color1, color2, handleThemeChange, sidebar: initialSidebar, pageTitle, setPageTitle, onCardClick }) {
   
    const location = useLocation();

    useEffect(() => {
       
        if (!pageTitle || pageTitle.trim() === "") {
            const path = location.pathname;
     
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
           
            <Header
                handleChange={handleThemeChange}
                icon={themeIcon}
                color1={color1}
                color2={color2}
                onCardClick={toggleSidebar}
                isLoggedIn={true}
                title={pageTitle}
            />

            
            <Navigation iconcolor={iconcolor} sidebar={sidebarOpen} onClose={closeSidebar} />

            <main className="main-content">
                
                <Outlet context={{ setPageTitle }} />
            </main>
        </div>
    );
}

export default LoggedInLayout;
