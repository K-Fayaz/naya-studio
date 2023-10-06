
import { useState ,useEffect } from "react";
import TiktactoeBoard from "./tikt-tak-toe-board";
import { checkWinner ,checkGameTie } from "../../Javascript/tik-tak-toe";
import { findBestMove } from "../../Javascript/tik-tak-toe-minimax-algo";

import { tiktaktoeSocket as socket } from "../../socket/snake-ladder-socket";

import axios from "axios";

const TikTakToeAi = ()=>{
    // Turn 1 -> Player
    // Turn 0 -> AI


   /* These lines of code are using the `useState` hook from React to declare and initialize multiple
   state variables in a functional component. */
    const [turn,setTurn] = useState(1);
    const [playerTurn,setPlayerTurn] = useState("You");
    const [gameOver,setGameOver] = useState(false);
    const [resume,setResume] = useState(false);
    const [startGame,setStartGame] = useState(false)

    /* The line `const [board,setBoard] = useState(['','','','','','','','','']);` is using the
    `useState` hook from React to declare and initialize a state variable called `board`. The
    initial value of `board` is an array with 9 empty strings, representing the tic-tac-toe board.
    The `setBoard` function is used to update the value of the `board` state variable. */
    
    const [board,setBoard] = useState(['','','','','','','','','']);
    const [winner,setWinner] = useState(-1);
    
    const mySymbol = "X";
    const AiSymbol = "O";

    /* The `useEffect` hook is used to perform side effects in functional components. In this code
    snippet, the `useEffect` hook is used to fetch the state of the TikTakToe game from the server
    when the component mounts. */
    useEffect(()=>{
        if(sessionStorage.getItem("user"))
        {
            socket.connect();
            console.log("user logged in is " + sessionStorage.getItem("user"));
            let data = {
                username: sessionStorage.getItem("user"),
            }
            console.log(data);
            axios({
                method:"GET",
                url:`http://localhost:8080/fetch/tik-tak-toe/state?username=${data.username}`,
                withCredentials: true,
                headers:{
                    'Content-Type':'application/json',
                }
            })
            .then((data)=>{
                console.log(data.data);
                checkBoardStatus(data.data.board);
            })
            .catch((err)=>{
                console.log("Something Went Wrong!",err.data);
            })
        }
    },[]);

    /**
     * The function "checkBoardStatus" checks the status of a tic-tac-toe board and determines if the
     * game can be resumed or if it needs to be restarted.
     * @param temp_board - The `temp_board` parameter is an array representing the current state of the
     * tic-tac-toe board. Each element of the array represents a position on the board, and can have
     * one of three values: 'X' for the human player's move, 'O' for the AI player's
     */
    function checkBoardStatus(temp_board)
    {
        // check if all the places are empty ?
        let status = true;
        for(let i = 0; i < 9; i++)
        {
            if(temp_board[i])
            {
                status = false;
                break;
            }
        }

        // If the board has atleast one place with one of the symbols 'X' or 'O'
        // than we can resume the game
        // else we can just restart the game

        let ai = 0 , human = 0;

        if(!status)
        {
            for(let i = 0; i < 9; i++)
            {
                if(temp_board[i] == 'O')
                    ai += 1;
                else if(temp_board[i] == 'X')
                    human += 1;
                else{
                    setBoard(temp_board);
                    setResume(true);
                }
            }

            console.log("AI : ",ai);
            console.log("Human : ",human);

            // Calculating whose turn it was last time when user quit the game
            if(ai < human)
            {
                setTurn(0);
                setPlayerTurn("AI");
            }else{
                setTurn(1);
                setPlayerTurn("You");
            }

        }
    }


    /**
     * The function `AiTurn()` is responsible for making the AI's move in a game and updating the game
     * board accordingly.
     */
    function AiTurn()
    {
        console.log(board);
        if(!gameOver)
        {
            const bestMove = findBestMove(board);
            let temp = board;
            temp[bestMove] = AiSymbol;
            setBoard(temp);
            console.log("Best Move According to AI is ",bestMove);
            let div = document.getElementById(`${bestMove+1}`);
            if(div && !div.innerText)
            {
                div.innerText = AiSymbol;
                socket.emit("update-board",{ user: sessionStorage.getItem("user"),board: temp })
            }
        }

        let slider = document.getElementById("animation-slider");
        slider.style.display = "none";
        slider.classList.remove("animate");
        if(checkWinner(AiSymbol))
        {
            socket.emit("ai-won",1);
            setGameOver(true);
            setResume(false);
            handleGameOver(0);
        }else{
            setPlayerTurn("You");
            setTurn(1);
        }
    }

    /**
     * The handleClick function handles the click event on a div element and updates the game board
     * accordingly.
     */
    function handleClick(event)
    {
        let id = Number(event.target.id)
        let div = document.getElementById(event.target.id);
        if(turn == 1 && !div.innerText && !gameOver)
        {
            div.innerText = mySymbol;
            let temp_board = board;
            temp_board[id-1] = mySymbol;
            setBoard(board);
            setTurn(0);
            setPlayerTurn("AI");

            socket.emit('update-board',{ user: sessionStorage.getItem("user") , board: temp_board });

            if(checkWinner(mySymbol))
            {
                socket.emit("ai-won",0);
                setGameOver(true);
                setResume(false);
                handleGameOver(1);
            }else{
                console.log("False You");
            }

            if(checkGameTie(board))
            {
                socket.emit("ai-won",2);
                setGameOver(true);
                setResume(false);
                handleGameOver(2);
            }else{
                let slider = document.getElementById("animation-slider");
                slider.style.display = "block";
                slider.classList.add("animate");
                setTimeout(()=>{
                    AiTurn();
                },2500);
            }
        }
    }

    /**
     * The function "handleGameOver" is used to handle the end of a game, displaying the appropriate
     * message based on the outcome and resetting the game board and turn variables.
     * @param win - The `win` parameter is a number that represents the outcome of the game.
     */
    function handleGameOver(win)
    {
        setStartGame(false);
        document.getElementById("id-1").style.display = "flex";
        if(win >= 0)
        {
            let text = "";
            win > 0 ? (win == 1 ? text = "You Win !" : text = "Game Tied !") : text = "AI won !";
            document.getElementById("id-2").style.display = "flex";
            document.getElementById("display-msg").innerText = text;
        }
        setBoard(['','','','','','','','','']);
        setTurn(1);
        setPlayerTurn("");
    }

    /**
     * The function "handleResume" hides an element with the id "id-1", sets the "startGame" variable
     * to true, logs the "board" variable to the console, updates the text of certain elements on the
     * page with values from the "temp" array, and then calls the "AiTurn" function if the "turn"
     * variable is equal to 0.
     */
    function handleResume()
    {
        document.getElementById("id-1").style.display = "none";
        setStartGame(true);
        let temp = board;
        console.log(temp);
        setTimeout(()=>{
            temp.forEach((value,index)=>{
                document.getElementById(`${index+1}`).innerText = value;
            });
        },2000);

        setTimeout(()=>{
            if(turn == 0)
                AiTurn();
        },4000)
    }

    /**
     * The function `handleStartGame` sets the game state to start a new game, resets the board, and
     * hides a specific element on the page.
     */
    function handleStartGame()
    {
        setStartGame(true);
        setTurn(1);
        setPlayerTurn("You");
        setBoard(['','','','','','','','','']);
        setTimeout(()=>{
            if(gameOver)
            {
                for(let i = 0; i < 9; i++)
                {
                    document.getElementById(`${i+1}`).innerText = "";
                }
                setPlayerTurn("You");
                setGameOver(false);
            }
        },1000)
        document.getElementById("id-1").style.display = "none";
    }

    return(
        <>
            {
                startGame && <div className="tik-tak-toe-board-wrap">
                                <div className="turn-display-borad">
                                    <h1>Turn: <span id="turn-display">{playerTurn}</span> </h1>
                                    <div id="animation-slider" className="tik-tak-toe-slider"></div>
                                    <TiktactoeBoard clickEvent={handleClick} />
                                </div>
                            </div>
            }
            <div id="id-1" className="message-pop-board-tik-tak">
                <div className="message-ai">
                    <div className="game-start-btns">
                        {
                            resume && <button onClick={handleResume} className="resume">Resume Game</button>
                        }
                        <button id="start-over" onClick={handleStartGame} className="start-over">Start New Game</button>
                    </div>
                    <div id="id-2" className="game-begins-timer">
                        <h1 id="display-msg">Game begins in...</h1>
                        {/* <h1 id="ai-timer">5</h1> */}
                    </div>
                </div>
            </div>
        </>
    )
};

export default TikTakToeAi;