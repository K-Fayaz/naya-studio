import { useState,useEffect } from "react";

// Import Socket connection 
import { tiktaktoeSocket as socket } from "../../socket/snake-ladder-socket";

import TiktactoeBoard from "./tikt-tak-toe-board";

import { checkWinner , checkGameTie } from "../../Javascript/tik-tak-toe";

const TikTakToeOnline = ()=>{

    /* These lines of code are using the `useState` hook from React to declare and initialize multiple
    state variables in a functional component. */
    const [user,setUser] = useState("");
    const [playerTurn,setPlayerTurn] = useState("");
    const [turn,setTurn] = useState(0);
    const [myPlayer,setMyPlayer] = useState("");
    const [opponentPlayer,setOpponentPlayer] = useState("");
    const [opponent,setOpponent] = useState("");
    const [show,setShow] = useState(false);
    const [gameOver,setGameOver] = useState(false);
    const [board,setBoard] = useState(['','','','','','','','','']);

    /* The `useEffect` hook is used to perform side effects in functional components. In this case, the
    `useEffect` hook is used to connect the socket and set the user state variable when the
    component mounts. */
    useEffect(()=>{
        if(sessionStorage.getItem("user"))
        {
            setUser(sessionStorage.getItem("user"))
            socket.connect();
        }
    },[])

    /**
     * The handleClick function hides the "find-opponent-btn" element, displays the
     * "message-display-banner" element, sets the text of the "message" element to "Finding Opponent",
     * and emits a "find-opponent" event with the user and socket id as data.
     */
    function handleClick()
    {
        document.getElementById("find-opponent-btn").style.display = "none";
        document.getElementById("message-display-banner").style.display = "grid";
        document.getElementById("message").innerText = "Finding Opponent";
        socket.emit("find-opponent",{ user: user , id: socket.id }); 
    }

    /**
     * The function handles a click event on a game board and updates the board state accordingly,
     * checking for a winner or a tie and notifying the opponent if necessary.
     * @param event - The event parameter is the event object that is passed when the board is clicked.
     * It contains information about the click event, such as the target element that was clicked.
     */
    function handleBoardClick(event)
    {
        let div = document.getElementById(event.target.id);
        if(!div.innerText && !gameOver && turn === 1)
        {
            div.innerText = myPlayer;
            const temp = board;
            temp[Number(event.target.id)-1] = myPlayer;
            setBoard(temp);
            
            if(checkWinner(myPlayer))
            {
                // alert("You Won the Game!!");
                displayMessage(1);
                setGameOver(true);
                socket.emit("game-over",{ opponent });
            }else{
                if(checkGameTie(temp))
                {
                    // alert("Game Tied!!");
                    displayMessage(2);
                    socket.emit("game-tie",opponent);
                }else{
                    setTurn(0);
                    setPlayerTurn("Opponent");
                    // Notifying Opponent regarding move
                    socket.emit("opponent-move",{ block: event.target.id , opponent: opponent });
                }
            }

        }   
    }

    // When the Opponent is found
    /* The `socket.on("opponent-found", (data) => { ... })` function is an event listener that listens
    for the "opponent-found" event emitted by the server. */
    socket.on("opponent-found",(data)=>{
        document.getElementById("message").innerText = "Opponent Found!!";
        setOpponent(data.opponent);
        if(data.toss === user)
        {
            setMyPlayer("X");
            setOpponentPlayer("O");
            setPlayerTurn("You");
            setTurn(1);
        }else{
            setMyPlayer("O");
            setOpponentPlayer("X");
            setPlayerTurn("Opponent")
            setTurn(0);
        }
        let timer = 5;
        let interval = setInterval(()=>{
            document.getElementById("timer").innerText = timer;
            timer -= 1;
        },1000);

        setTimeout(()=>{
            clearInterval(interval);
            timer = 5;
            document.getElementById("message-display-banner").style.display = "none";
            setShow(true);
        },5000);
    })

    // When the opponent makes move
    /* The code `socket.on("opponent-move",(data)=>{ ... })` is an event listener that listens for the
    "opponent-move" event emitted by the server. */
    socket.on("opponent-move",(data)=>{
        setTurn(1);
        setPlayerTurn("You");
        let temp = board;
        temp[Number(data.block)-1] = opponentPlayer;
        setBoard(temp);
        // Update the opponent's entry into the game board
        let div = document.getElementById(data.block);
        div.innerText = opponentPlayer;
    })
    
    
    // When Opponent Won the game
    /* The code `socket.on("game-over",()=>{ ... })` is an event listener that listens for the
    "game-over" event emitted by the server. When this event is received, it triggers the callback
    function. In this case, the callback function displays a message to indicate that the opponent
    has won the game, sets the game over state to true, and performs any other necessary actions
    related to the game over event. */
    socket.on("game-over",()=>{
        // alert("Opponent Won You lose!!");
        displayMessage(0);
        setGameOver(true);
    })
    
    // When Game is Tied Up
    /* The code `socket.on("game-tie",()=>{ ... })` is an event listener that listens for the
    "game-tie" event emitted by the server. When this event is received, it triggers the callback
    function. In this case, the callback function displays a message to indicate that the game has
    ended in a tie, sets the game over state to true, and performs any other necessary actions
    related to the game tie event. */
    socket.on("game-tie",()=>{
        // alert("Game Tied Up!!");
        displayMessage(2);
        setGameOver(true);
    })


    /* The code `socket.on("opponent-left",()=>{ ... })` is an event listener that listens for the
    "opponent-left" event emitted by the server. When this event is received, it triggers the
    callback function. */
    socket.on("opponent-left",()=>{
        document.getElementById("message-display-banner").style.display = "grid";
        document.getElementById("message").innerText = "Opponent Left";
        document.getElementById("timer").innerText = "";
        setTimeout(()=>{
            document.getElementById("message-display-banner").style.display = "none";
            document.getElementById("find-opponent-btn").style.display = "grid";
        },2000);
        setOpponent("");
        setOpponentPlayer("");
        setMyPlayer("");
        setBoard(['','','','','','','','',''])
        setShow(false);
        setTurn(0);
        setPlayerTurn("");
    })

    /**
     * The function "displayMessage" is used to display a message on the webpage based on the state of
     * the game.
     * @param state - The state parameter is used to determine the outcome of the game. It can have
     * three possible values:
     */
    function displayMessage(state)
    {
        let text = "";
        if(state == 1)
            text = "You WIN";
        else if(state == 0)
            text = "You Loose";
        else
            text = "Game Tied";
        
        document.getElementById("message-display-banner").style.display = "grid";
        document.getElementById("message").innerText = text;
        document.getElementById("timer").innerText = "";
        setShow(false);

        setTimeout(()=>{
            document.getElementById("message").innerText = "";
            document.getElementById("message-display-banner").style.display = "none";
            document.getElementById("find-opponent-btn").style.display = "grid";
        },2000);

    } 

    return(
        <>
            <div id="find-opponent-btn" className="find-opponent-btn">
                <button onClick={handleClick} >Find Opponent</button>
            </div>
            <div id="message-display-banner" className="message-display-banner">
                <div className="message-board">
                    <h1 id="message">Finding Opponent...</h1>
                    <h1 id="timer"></h1>
                </div>
            </div>
            {
                show && <div className="tik-tak-toe-board-wrap">
                            <div className="turn-display-borad">
                                <h1>Turn: <span id="turn-display">{playerTurn}</span></h1>
                                <TiktactoeBoard clickEvent={handleBoardClick} />
                            </div>
                        </div> 
            }
        </>
    )
};

export default TikTakToeOnline;