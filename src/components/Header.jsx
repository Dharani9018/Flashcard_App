import "../css/Header.css";
import logo from "../assets/images/card.png"; // This is your icon
import { Link } from "react-router-dom";

function Header() {
    return (
        <div className="header">
            <h1>
                {/* This Link component now wraps BOTH the
                  image and the text to make them one clickable unit.
                */}
                <Link className="logo-flash" to="/">
                    <img
                        className="logo"
                        src={logo}
                        alt="Flashcard Maker home"
                    />
                    {/* It's better to put the text in a <span>
                      so it's grouped with the image inside the link.
                    */}
                </Link>
                <span>FLASHCARD MAKER</span>
            </h1>
        </div>
    );
}

export default Header;