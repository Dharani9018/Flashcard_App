import "../css/Home.css";
import {Link, useOutletContext} from "react-router-dom"; // Add useOutletContext import
import { useEffect } from "react";

function Home()
{
    const outletContext = useOutletContext();
    const setPageTitle = outletContext?.setPageTitle || (() => {});

    useEffect(() => {
        setPageTitle("Home");
    }, [setPageTitle]);
    
    return(
        <div className="home"> 
            <p>This is home</p>
        </div>
    )
}

export default Home;