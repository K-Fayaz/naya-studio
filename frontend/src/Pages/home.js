import Navbar from "../Components/navbar";

import "../CSS/hero.css";

const Home = ()=>{    
    return(
        <>
            <Navbar/>
            <div className="hero">
                <div>
                    <h1>Welcome to Naya Games</h1>
                    <h1>{sessionStorage.getItem("user")}!</h1>
                </div>
            </div>
            <div className="details">
                <h1>Available Games</h1>
                <div className="tik-tak-toe-details">
                    <img src={require("../Assets/Images/tic-tac.jpg")}/>
                    <div>
                        <h1>Tic Tac Toe</h1>
                        <div>
                            <h1>Playing With AI</h1>
                            <p>Play against our challenging AI opponent that uses the powerful Minimax algorithm to make strategic moves. Minimax is a decision-making algorithm that ensures the AI makes the best possible move in every situation. Can you outsmart the AI and claim victory, or will it prove to be a formidable adversary?</p>
                        </div>
                        <div>
                            <h1>Play Online With Opponents</h1>
                            <p>Challenge other players online in exciting head-to-head matches of Tic-Tac-Toe! Test your skills and strategy against real opponents from around the world.
                               our online multiplayer option allows you to enjoy the classic game of Tic-Tac-Toe in a fun and interactive way. Play and prove who the ultimate Tic-Tac-Toe master is!</p>
                        </div>
                    </div>
                </div>
                <div className="tik-tak-toe-details">
                    <img src={require("../Assets/Images/snake_ladder.jpg")}/>
                    <div>
                        <h1>Snake And Ladder</h1>
                        <div>
                            <h1>Playing With AI</h1>
                            <p>Experience the classic board game of Snake and Ladder in a whole new way! Take on our AI opponent, which is designed to provide a challenging and unpredictable gaming experience. Climb ladders, watch out for snakes, and strategize your moves as you compete against the AI. Can you outmaneuver the AI and reach the finish line first, or will the game throw unexpected twists and turns your way?</p>
                        </div>
                        <div>
                            <h1>Play Online With Opponents</h1>
                            <p>Gather your friends and family for an exciting multiplayer adventure in Snake and Ladder! Challenge each other in real-time matches, roll the dice, and race to the top of the board. Whether you're looking for a casual game night or a competitive showdown, our multiplayer mode lets you connect with players worldwide. Enjoy the thrill of victory and the suspense of those slippery snakes with friends or players from across the globe!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                Designed and Developed By @Fayaz
            </div>
        </>
    )
}

export default Home;