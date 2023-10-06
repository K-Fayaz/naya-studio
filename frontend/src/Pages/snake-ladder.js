import { useState } from "react";
import Navbar from "../Components/navbar";

import SnakeAiPlay from "../Components/snake-ladder-ai-main";
import SnakeOnlinePlay from "../Components/snake-ladder-online-main";

import "../CSS/snake-ladder.css";

const Snake = ()=>{

    const [showAi,setShowAi] = useState(false);
    const [showOnline,setShowOnline] = useState(false);

    /**
     * The handleClick function is triggered when a button is clicked and it determines whether the
     * "ai" button or another button was clicked and sets the corresponding state variables.
     * @param event - The event parameter is an object that represents the event that triggered the
     * function. It contains information about the event, such as the target element that was clicked.
     */
    function handleClick(event)
    {
        if(event.target.id == "ai")
        {
            document.getElementById("player-decide-btns").style.display = "none";
            setShowAi(true);
        }else{
            document.getElementById("player-decide-btns").style.display = "none";  
            setShowOnline(true);          
        }
    }

    return(
        <>
            <Navbar/>
            <div id="player-decide-btns" className="player-decide-btns">
                <div className="btn-group">
                    <button id="ai" onClick={handleClick}>Play With AI</button>
                    <button id="Multiplayer" onClick={handleClick}>Play Online</button>
                </div>
            </div>
            <div id="start-time-display" className="start-time-display">
                <h1>The Game Begins in ...<span id="span-timer"></span></h1>
            </div>
            {
                showAi === true ? <SnakeAiPlay/> : console.log("Hi")
            }
            {
                showOnline === true ? <SnakeOnlinePlay/> : console.log("online")
            }
        </>
    )
};


export default Snake;