// src/components/Header.jsx
import "../css/Header.css";
import { TbCards } from "react-icons/tb";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import React from "react";

function Header({ handleChange, icon: Icon, color1, color2, onCardClick, isLoggedIn, title }) {
    return (
        <div className="header">
            <div className="header-left">
                <h1 className="header-logo">
                    {isLoggedIn ? (
                        <div className="logo-flash" onClick={onCardClick} style={{ cursor: "pointer" }}>
                            <IconContext.Provider value={{ color: color2 }}>
                                <TbCards />
                            </IconContext.Provider>
                        </div>
                    ) : (
                        <Link className="logo-flash" to="/">
                            <IconContext.Provider value={{ color: color2 }}>
                                <TbCards />
                            </IconContext.Provider>
                        </Link>
                    )}
                </h1>
            </div>

            {/* CENTER TITLE */}
            <div className="header-center" style={{ flex: 1, textAlign: "center" }}>
                <div className="page-title" aria-live="polite" style={{ fontSize: 18, fontWeight: 600 }}>
                    {title || ""}
                </div>
            </div>

            <div className="toggle-container" style={{ display: "flex", alignItems: "center" }}>
                <IconContext.Provider value={{ color: color1 }}>
                    <Icon className="theme-icon" onClick={handleChange} style={{ cursor: "pointer" }} />
                </IconContext.Provider>
            </div>
        </div>
    );
}
export default Header;
