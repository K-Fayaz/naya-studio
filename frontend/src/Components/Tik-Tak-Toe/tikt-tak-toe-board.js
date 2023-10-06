


/**
 * The TiktactoeBoard function returns a JSX element representing a tic-tac-toe board with 9 cells.
 * @param props - props is an object that contains the properties passed to the TiktactoeBoard
 * component.
 * @returns The TiktactoeBoard component is being returned.
 */
const TiktactoeBoard = (props)=>{
    return(
        <>
            <div className="tik-taoe-board">
                <div onClick={props.clickEvent} className="cell" id="1"></div>
                <div onClick={props.clickEvent} className="cell" id="2"></div>
                <div onClick={props.clickEvent} className="cell" id="3"></div>
                <div onClick={props.clickEvent} className="cell" id="4"></div>
                <div onClick={props.clickEvent} className="cell" id="5"></div>
                <div onClick={props.clickEvent} className="cell" id="6"></div>
                <div onClick={props.clickEvent} className="cell" id="7"></div>
                <div onClick={props.clickEvent} className="cell" id="8"></div>
                <div onClick={props.clickEvent} className="cell" id="9"></div>
            </div>
        </>
    )
};

export default TiktactoeBoard;