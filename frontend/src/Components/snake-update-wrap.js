


/**
 * The SnakeUpdateWrap function returns a JSX component that displays a dice container with an opponent
 * move section and a player move section.
 * @param props - The "props" parameter is an object that contains the properties passed to the
 * SnakeUpdateWrap component. These properties can be accessed using dot notation, such as
 * props.opponentValue and props.value. The component uses these properties to display the opponent's
 * dice value and the player's dice value. It also
 * @returns The SnakeUpdateWrap component is returning a JSX element.
 */
const SnakeUpdateWrap = (props)=>{
    return(
        <>
                <div className="dice-container">
                    <div className="opponent-move">
                        <h1>Opponent</h1> 
                        <h1 className="dice-value">{props.opponentValue}</h1>
                        <div id="animation-slider" className="animation-slider"></div>
                    </div>
                    <div className="my-btn">
                        <h1>You</h1>
                        <h1 className="dice-value">{props.value}</h1>
                        <button id="dice-btn" onClick={props.HandleClick} className="dice-btn">Roll Dice</button>
                    </div>
                </div>
        </>
    )
};

export default SnakeUpdateWrap;