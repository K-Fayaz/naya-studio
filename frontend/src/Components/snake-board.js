
import { ids } from '../Javascript/snake-ladder';

/**
 * The SnakeBoard component renders a game board with snake and ladder images, as well as two player
 * markers.
 * @param props - The `props` parameter in the `SnakeBoard` component is an object that contains any
 * properties passed to the component when it is used. These properties can be accessed using dot
 * notation, such as `props.propertyName`.
 * returns The SnakeBoard component is returning a JSX element. It consists of a div with the
 * className "img-container" which contains multiple div elements with the className "demo" and unique
 * ids. It also includes an img element with the className "snake-ladder-image" and a src attribute
 * pointing to an image file. Lastly, it has two div elements with the ids "player-one" and "player-two
 */
const SnakeBoard = (props)=>{
    return(
        <>
            <div className="img-container">
                    {
                        ids.map((number)=>{
                            return(
                                <div className="demo" id={number} key={number}></div>
                            )
                        })
                    }
                    <img className="snake-ladder-image" src={require('../Assets/Images/snake_ladder.jpg')} alt="snake-ladder"/>
                    <div id="player-one" className="player-one"></div>
                    <div id="player-two" className="player-two"></div>
                </div>
        </>
    )
}

export default SnakeBoard;