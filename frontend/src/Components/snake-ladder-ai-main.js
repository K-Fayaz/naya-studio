import { useState , useEffect } from "react";

import { movePlayer , ladder_from , ladder_to , snake_from , snake_to } from "../Javascript/snake-ladder";

import SnakeBoard from "../Components/snake-board";
import SnakeUpdateWrap from "../Components/snake-update-wrap";

import { socket } from "../socket/snake-ladder-socket";

import axios from "axios";

import "../CSS/snake-ladder.css"

/**
 * The SnakeAiPlay function is a React component that handles the logic for a game where players take
 * turns rolling a dice and moving their position on a board, with the possibility of encountering
 * ladders or snakes.
 * @returns The `SnakeAiPlay` component is returning JSX elements. It conditionally renders a
 * `snake-ladder-container` div if the `startGame` state is true. Inside the `snake-ladder-container`,
 * it renders a `SnakeUpdateWrap` component and a `SnakeBoard` component.
 */
const SnakeAiPlay = ()=>{
    /* These lines of code are using the `useState` hook in React to declare and initialize multiple
    state variables. */
    const [value,setValue] = useState(0);
    const [opponentValue,setOpponentValue] = useState(0);
    const [rollUp,setrollUp] = useState(1);
    const [myState,setMyState] = useState(0);
    const [opponetState,setOpponentState] = useState(0);
    const [startGame,setStartGame] = useState(false);
    const [resume,setResume] = useState(false);
    const [score,setScore] = useState([]);
    const [board,setBoard] = useState([]);

    /* The `useEffect` hook is used to perform side effects in a functional component. In this code
    snippet, the `useEffect` hook is used to connect to a socket and fetch the snake-ladder state
    from a server. */
    useEffect(()=>{
        socket.connect();

        axios({
            method:"GET",
            url:`http://localhost:8080/fetch/snake-ladder-state?username=${sessionStorage.getItem('user')}`,
        })
        .then((data)=>{
            console.log(data.data);
            setScore(data.data.payload.score);
            checkBoardStatus(data.data.payload.state);
        })
        .catch((err)=>{
            console.log(err);
        })

    },[rollUp])

    /**
     * The function `aiPlay` is used to simulate the AI player's turn in a game, where it generates a
     * random number and updates the opponent's state accordingly.
     * @param turn - The "turn" parameter represents whose turn it is to play. If the value of "turn"
     * is 1, it means it's the player's turn to play. If the value of "turn" is 0, it means it's the
     * AI's turn to play.
     */
    function aiPlay(turn)
    {
        // alert(turn);
        let number = Math.floor(Math.random() * (7-1)+1);
        setOpponentValue(number);
        movePlayer(turn,number,opponetState);
            
        if(ladder_from.indexOf(opponetState+number) != -1)
        {
            setOpponentState(ladder_to[ladder_from.indexOf(opponetState+number)]);
            socket.emit("update-state",{ user: 0 , position: ladder_to[ladder_from.indexOf(opponetState+number)] })
        }else{
            if(snake_from.indexOf(opponetState+number) != -1)
            {
                setOpponentState(snake_to[snake_from.indexOf(opponetState+number)]);
                socket.emit("update-state",{ user: 0 , position: snake_to[snake_from.indexOf(opponetState+number)] })
            }
            else{
                if(number+opponetState <= 100)
                    setOpponentState(opponetState+number);
                    socket.emit("update-state",{ user: 0 , position: opponetState+number })
                }
            }
        console.log("My opponent state is ",number+opponetState);
        if(number+opponetState === 100)
        {
            // alert("AI Won the Game!!");
            socket.emit("ai-won",{ user: 0 });
            setTimeout(()=>{
                handleGameOver(0);
            },2000);
        }
        if(number+opponetState !== 100)
            setrollUp(1);
    }

    /**
     * The handleClick function handles the logic for a game where players take turns rolling a dice
     * and moving their position on a board, with the possibility of encountering ladders or snakes.
     */
    function handleClick()
    {
        let turn = 1;
        let number = Math.floor(Math.random() * (7-1)+1);
        if(turn == 1)
        {
            setValue(number);
            movePlayer(turn,number,myState);
            if(ladder_from.indexOf(myState+number) != -1)
            {
                setMyState(ladder_to[ladder_from.indexOf(myState+number)]);
                socket.emit("update-state",{ user: 1 , position: ladder_to[ladder_from.indexOf(myState+number)] });
            }else{
                if(snake_from.indexOf(myState+number) != -1)
                {
                    setMyState(snake_to[snake_from.indexOf(myState+number)]);
                    socket.emit("update-state",{ user: 1 , position: snake_to[snake_from.indexOf(myState+number)] });
                }else{
                    if(number+myState <= 100)
                    {
                        setMyState(myState+number);
                        socket.emit("update-state",{ user: 1 , position: myState+number });
                    }
                }
            }
            console.log("My State is ",number+myState);
            if(number+myState === 100)
            {
                // alert("You Won the game!!");
                socket.emit("ai-won",{ user: 1 });
                setTimeout(()=>{
                    handleGameOver(1);
                },2000);
            }
            let next = 0;
            setrollUp(next);

            let btn = document.getElementById("dice-btn");
            btn.disabled = true;
            btn.classList.add("disable");

            if(number+myState != 100)
            {
                let div = document.getElementById("animation-slider");
                div.style.visibility = "visible";
                div.classList.add("animate");
                setTimeout(()=>{
                    aiPlay(next);
                    div.classList.remove("animate");
                    div.style.visibility = "hidden";
                    btn.disabled = false;
                    btn.classList.remove("disable");
                },2000)
            }
        }
    }

   /**
    * The function "handleStartGame" hides an element with the id "id-3" and sets the value of
    * "startGame" to true.
    */
    function handleStartGame()
    {
        document.getElementById("id-3").style.display = "none";
        setStartGame(true);
    }

    /**
     * The function "handleGameOver" is used to handle the end of a game and display a message based on
     * whether the player or the AI won.
     * @param win - The "win" parameter is used to determine the outcome of the game. It can have three
     * possible values:
     */
    function handleGameOver(win)
    {
        setResume(false);
        setStartGame(false);
        document.getElementById("id-3").style.display = "grid";
        document.getElementById("id-4").style.display = "flex";
        if(win == 0)
        {
            document.getElementById("msg-h1").innerText = "AI won the Game!";
        }else if(win == 1)
        {
            document.getElementById("msg-h1").innerText = "You Won the Game !!";
        }else{
            document.getElementById("msg-h1").innerText = "";
        }
        setMyState(0);
        setOpponentState(0);
        setValue(0);
        setOpponentValue(0);
    }

    /**
     * The function checks if the values in the temp_board array are between 0 and 100 (exclusive) and
     * if at least one of them is greater than 0, and if so, it sets the resume variable to true and
     * updates the board with the values from temp_board.
     * @param temp_board - The parameter `temp_board` is an array that represents the current state of
     * the board. It contains two elements, `temp_board[0]` and `temp_board[1]`, which represent the
     * values of the first and second positions on the board, respectively.
     */
    function checkBoardStatus(temp_board){
        if((temp_board[0] < 100 && temp_board[1] < 100 ) && (temp_board[0] > 0 || temp_board[1] > 0))
        {
            setResume(true);
            setBoard(temp_board);
        }
    }

    /**
     * The function "handleResume" hides certain elements, sets the game state to start, moves the
     * players to their initial positions on the board, and triggers the AI's turn if applicable.
     */
    function handleResume()
    {
        document.getElementById("id-3").style.display = "none";
        document.getElementById("id-4").style.display = "none";
        setStartGame(true);
        setTimeout(()=>{
            let playerOne = document.getElementById("player-one");
            let playerTwo = document.getElementById("player-two");
            document.getElementById(`${board[0]}`).appendChild(playerTwo);
            document.getElementById(`${board[1]}`).appendChild(playerOne);

            if(board[2] == 0)
            {
                // Now it is AI's Turn
                aiPlay();
            }
        },2000);

        setValue(0);
        setOpponentValue(0);
        setMyState(board[1]);
        setOpponentState(board[0]);
    }

    return(
        <>
            {
                startGame && <div className="snake-ladder-container">
                                <SnakeUpdateWrap HandleClick={handleClick} rollUp={rollUp} value={value} opponentValue={opponentValue}/>
                                <SnakeBoard/>
                             </div> 
            }
            <div id="id-3" className="start-game-decisions">
                <div>
                    <div className="snake-ladder-start-btns">
                        {
                            resume && <button onClick={handleResume}>Resume Game</button>
                        }
                        <button onClick={handleStartGame} >Start Over</button>
                    </div>
                    <div id="id-4" className="snake-ladder-game-message">
                        <h1 id="msg-h1">Game Over!!</h1>
                    </div>
                </div>
            </div>
        </>
    )
};

export default SnakeAiPlay;