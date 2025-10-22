// components/LoggedInLayout.jsx
import Navigation from "./navigation.jsx";
import { Outlet } from "react-router-dom";

function LoggedInLayout() {
    return (
        <div className="logged-in-layout">
            <Navigation />
            <main className="main-content">
                <Outlet /> {/* This renders the nested routes */}
            </main>
        </div>
    );
}

export default LoggedInLayout;