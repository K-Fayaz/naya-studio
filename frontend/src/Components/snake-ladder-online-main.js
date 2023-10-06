// Hooks
import { useState,useEffect } from "react";

// import components
import SnakeBoard from "./snake-board";
import SnakeUpdateWrap from "./snake-update-wrap";

// importing functions 
import {ladder_from,ladder_to,snake_from,snake_to,enable , disable , move_online_player } from "../Javascript/snake-ladder";

// importing socket connection
import { socket } from "../socket/snake-ladder-socket";

// Import CSS files
import "../CSS/snake-online-main.css";
import "../CSS/loading.css"

const SnakeOnlinePlay = ()=>{

    const [user,setUser] = useState("");
    const [firstUser,setFirstUser] = useState(-1);
    const [opponent,setOpponent] = useState(undefined);
    const [value,setValue] = useState(0);
    const [opponentValue,setOpponentValue] = useState(0);
    const [turn,setTurn] = useState(false);

    /* The `useEffect` hook is used to perform side effects in functional components. In this case, the
    `useEffect` hook is being used to connect the socket and set the user state variable when the
    component mounts. */
    useEffect(()=>{
        if(sessionStorage.getItem("user") != undefined)
        {
            socket.connect();
            setUser(sessionStorage.getItem("user"));
        }

    });

    /**
     * The handleClick function generates a random number, updates the player's state and symbol, and
     * emits various socket events to update the opponent's number and state.
     */
    function handleClick()
    {
        // generate number
        let number = Math.floor(Math.random() * (7-1)+1);
        setValue(number);
        socket.emit("opponent-number",{ to: opponent,number: number });
        let mySymbol = sessionStorage.getItem("my-symbol");
        let myState  = Number(sessionStorage.getItem("my-state"));
        move_online_player(number,myState,mySymbol);
        socket.emit("move-opponent",{ to: opponent , number: number });
        
        let index = ladder_from.indexOf(myState+number);
        if(index != -1)
        {
            sessionStorage.setItem("my-state",ladder_to[index]);
        }else{
            index = snake_from.indexOf(myState+number);
            if(index != -1)
            {
                sessionStorage.setItem("my-state",snake_to[index]);
            }else{
                if(number+myState <= 100)
                    sessionStorage.setItem("my-state",number+myState);
            }
        }

        
        socket.emit("opponent-state",{ to: opponent , number: sessionStorage.getItem("my-state") });
        disable();
        socket.emit("your-move",opponent);
    }


    /**
     * The function "findOpponent" emits a "find-opponent" event to the server using a socket, hides
     * the "find-btn" element, and displays the "message-modal" element.
     */
    function findOpponent()
    {
        socket.emit("find-opponent",{ user , id:socket.id });
        document.getElementById("find-btn").style.display = "none";
        document.getElementById("message-modal").style.display = "grid";
    }

    /* The code `socket.on("your-move",()=>{ enable(); });` is setting up a socket event listener for
    the "your-move" event. When this event is emitted from the server, the callback function `()=>{
    enable(); }` will be executed. In this case, the `enable()` function is being called, which
    likely enables the player to make a move in the game. */
    socket.on("your-move",()=>{
        enable();
    });

    /* The code `socket.on("move-opponent",(number)=>{...})` is setting up a socket event listener for
    the "move-opponent" event. When this event is emitted from the server, the callback function
    `(number)=>{...}` will be executed. */
    socket.on("move-opponent",(number)=>{
        let opponentSymbol = sessionStorage.getItem("opponent-symbol");
        let opponentState = sessionStorage.getItem("opponent-state");
        move_online_player(number,Number(opponentState),opponentSymbol);
    })

    /* The code `socket.on("opponent-number",(number)=>{ setOpponentValue(number); });` is setting up a
    socket event listener for the "opponent-number" event. When this event is emitted from the
    server, the callback function `(number)=>{ setOpponentValue(number); }` will be executed. */
    socket.on("opponent-number",(number)=>{
        setOpponentValue(number);
    });

    /* The code `socket.on("opponent-state",(number)=>{
    sessionStorage.setItem("opponent-state",number); });` is setting up a socket event listener for
    the "opponent-state" event. When this event is emitted from the server, the callback function
    `(number)=>{ sessionStorage.setItem("opponent-state",number); }` will be executed. */
    socket.on("opponent-state",(number)=>{
        sessionStorage.setItem("opponent-state",number);
    });

    /* The code `socket.on("opponent-left",()=>{...})` is setting up a socket event listener for the
    "opponent-left" event. When this event is emitted from the server, the callback function
    `()=>{...}` will be executed. */
    socket.on("opponent-left",()=>{
        setOpponent(undefined);
        document.getElementById("lines").style.display = "none";
        document.getElementById("message-modal").style.display = "grid";
        document.getElementById("client-message").innerText = "Opponent Left";
        document.getElementById("timer").innerText = "";

        setTimeout(()=>{
            document.getElementById("find-btn").style.display = "grid";
            document.getElementById("lines").style.display = "block";
            document.getElementById("message-modal").style.display = "none";
            document.getElementById("client-message").innerText = "Finding Opponent!!";
        },2000);

    })


    // recieve Events
    /* The code `socket.on('opponent-found',(data)=>{...})` is setting up a socket event listener for
    the "opponent-found" event. When this event is emitted from the server, the callback function
    `(data)=>{...}` will be executed. */
    socket.on('opponent-found',(data)=>{
        document.getElementById("client-message").innerText = "Opponent Found!";
        sessionStorage.setItem("my-state",0);
        sessionStorage.setItem("opponent-state",0);
        let timer = 5;

        // alert(data.opponent);
        
        let span = document.getElementById("timer");
        let interval = setInterval(()=>{
            span.innerText = timer;
            timer -= 1;
        },1000);

        if(data.toss == user)
        {
            sessionStorage.setItem('my-symbol','player-one');
            sessionStorage.setItem('opponent-symbol','player-two');
        }else{
            sessionStorage.setItem('opponent-symbol','player-one');
            sessionStorage.setItem('my-symbol','player-two');
        }
        setTimeout(()=>{
            clearInterval(interval);
            timer = 5;
            document.getElementById("message-modal").style.display = "none";
            setOpponent(data.opponent);
            setTimeout(()=>{
                if(data.toss === user)
                {
                    enable();
                    setFirstUser(1);
                }else{
                    disable();
                    setFirstUser(0);
                }    
            },2000)
        },6000)

        console.log(data);
        // alert(mySymbol,opponentSymbol);
        // if toss is similar to user name than it is my turn to make the first move
    })

    return (
        <>
            <div id="find-btn" className="find-opponent-btn">
                <button onClick={findOpponent}>Find Opponent</button>
            </div>
            <div id="message-modal" className="message-modal">
                <div className="load-3">
                    <div id="lines">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                    <h1 id="client-message">Finding Opponent...</h1>
                    <h1 id="timer"></h1>
                </div>
            </div>
            {
                opponent != undefined ? 
                <div className="snake-ladder-container">
                    <SnakeUpdateWrap HandleClick={handleClick} value={value} opponentValue={opponentValue}/>
                    <SnakeBoard/>
                </div> : console.log("Opoonent Not Found")
            }
        </>
    )
}

export default SnakeOnlinePlay;