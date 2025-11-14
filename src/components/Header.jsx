import "../css/Header.css";
import { TbCards } from "react-icons/tb";
import { Link } from "react-router-dom";
import { IconContext } from 'react-icons';
function Header({ handleChange,icon: Icon,color1,color2, onCardClick, isLoggedIn }) {
    return (
        <div className="header">
            <h1>
                {isLoggedIn? (
                    <div className="logo-flash" onClick={onCardClick} style={{cursor: 'pointer'}}> 
                        <IconContext.Provider value={{color:color2}}>
                            <TbCards />
                        </IconContext.Provider>
                    </div>
                ) : (
                    <Link className="logo-flash" to="/">
                        <IconContext.Provider value={{color:color2}}>
                            <TbCards />
                        </IconContext.Provider>
                    </Link>
                )}
            </h1>
            <div className="toggle-container">
                <IconContext.Provider value={{color: color1}}> 
                    <Icon className="theme-icon" onClick={handleChange}/>
                </IconContext.Provider>
            </div>
        </div>
    );
}
export default Header;