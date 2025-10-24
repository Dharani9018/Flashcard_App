// components/LoggedInLayout.jsx
import Navigation from "./navigation.jsx";
import { Outlet } from "react-router-dom";

function LoggedInLayout({iconcolor}) {
    return (
        <div className="logged-in-layout">
            <Navigation iconcolor={iconcolor} />
            <main className="main-content">
                <Outlet /> 
            </main>
        </div>
    );
}

export default LoggedInLayout;