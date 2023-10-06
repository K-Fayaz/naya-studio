// React Components
import { useState , useEffect } from "react";

// Components
import Navbar from "../Components/navbar";
import TikTakToeAi from "../Components/Tik-Tak-Toe/tik-tak-toe-ai-main";
import TikTakToeOnline from "../Components/Tik-Tak-Toe/tik-tak-toe-online-main";

// CSS
import "../CSS/tik-tak-toe-main.css";

const Tiktactoe = ()=>{
    const [ai,setAI]         = useState(false);
    const [online,setOnline] = useState(false);
    
    /**
     * The handleClick function toggles between setting AI and online modes and hides the main button
     * container.
     * @param event - The event parameter represents the event object that is passed to the function
     * when the click event occurs. It contains information about the event, such as the target element
     * that was clicked.
     */
    function handleClick(event)
    {
        if(event.target.id === "ai-btn")
        {
            setAI(true);
            setOnline(false);
        }else{
            setAI(false);
            setOnline(true);
        }

        document.getElementById("main-btn-container").style.display = "none";
    }

    return(
        <>
            <Navbar/>
            <div id="main-btn-container" className="main-btn-container">
                <button onClick={handleClick} id="ai-btn" >Play With AI</button>
                <button onClick={handleClick} id="player-btn">Play Online</button>
            </div>

            {
                ai ? <TikTakToeAi/> : console.log("Click on AI btn")
            }

            {
                online ? <TikTakToeOnline/> : console.log("Click on Online Btn")
            }

        </>
    )
}

export default Tiktactoe;