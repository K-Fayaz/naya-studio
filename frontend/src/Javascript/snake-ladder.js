
/* The `ids` array is storing the IDs of the game board cells in a specific order. Each element in the
array represents the ID of a cell on the game board. The cells are arranged in a specific pattern,
starting from 1 and going up to 100. The array is organized in a way that the cells are ordered from
left to right and top to bottom, similar to a grid. */
let ids = [
    "100","99","98","97","96","95","94","93","92","91",
    "81","82","83","84","85","86","87","88","89","90",
    "80","79","78","77","76","75","74","73","72","71",
    "61","62","63","64","65","66","67","68","69","70",
    "60","59","58","57","56","55","54","53","52","51",
    "41","42","43","44","45","46","47","48","49","50",
    "40","39","38","37","36","35","34","33","32","31",
    "21","22","23","24","25","26","27","28","29","30",
    "20","19","18","17","16","15","14","13","12","11",
    "1","2","3","4","5","6","7","8","9","10",
]

/* The `ladder_from` array stores the starting positions of the ladders on the game board. Each element
in the array represents the cell number where a ladder starts. */
let ladder_from = [1,4,9,21,28,51,72,80];


/* The `ladder_to` array is storing the ending positions of the ladders on the game board. Each element
in the array represents the cell number where a ladder ends. The elements in the `ladder_to` array
correspond to the starting positions of the ladders in the `ladder_from` array. For example, the
ladder starting at position 1 ends at position 38, the ladder starting at position 4 ends at
position 14, and so on. */
let ladder_to   = [38,14,31,42,84,67,91,99];



/* The line `let snake_from = [17,54,62,64,87,93,95,98];` is declaring a variable named `snake_from`
and assigning it an array of numbers. These numbers represent the starting positions of the snakes
on the game board. Each element in the array corresponds to a cell number where a snake starts. */

let snake_from = [17,54,62,64,87,93,95,98];


/* The line `let snake_to = [7,34,19,60,36,73,75,79];` is declaring a variable named `snake_to` and
assigning it an array of numbers. These numbers represent the ending positions of the snakes on the
game board. Each element in the array corresponds to a cell number where a snake ends. For example,
the snake starting at position 17 ends at position 7, the snake starting at position 54 ends at
position 34, and so on. */
let snake_to   = [7,34,19,60,36,73,75,79];



/**
 * The function moves the player's position on a game board based on the turn, number rolled, and
 * current state.
 * @param turn - The turn parameter represents whose turn it is to move the player. If turn is 1, it
 * means it is the first player's turn. If turn is 0, it means it is the second player's turn.
 * @param number - The number parameter represents the number rolled on the dice. It indicates how many
 * steps the player should move on the game board.
 * @param state - The current position of the player on the game board.
 */
function movePlayer(turn,number,state)
{
    if(turn == 1 && (number+state) <= 100)
    {
        // Now it is my turn
        let player = document.getElementById("player-one");
        let div = document.getElementById(`${state+number}`);
        div.appendChild(player);

        if(ladder_from.indexOf(state+number) != -1)
        {
                let index = ladder_from.indexOf(state+number);
                div = document.getElementById(`${ladder_to[index]}`);
                div.appendChild(player);
        }
        if(snake_from.indexOf(state+number) != -1)
        {
            let index = snake_from.indexOf(state+number);
            div = document.getElementById(`${snake_to[index]}`);
            div.appendChild(player);
        }

    }
    else if(turn  == 0 && (number + state) <= 100){
        // opponent players turn
        let player = document.getElementById("player-two");
        let div = document.getElementById(`${state+number}`);
        div.appendChild(player);

        if(ladder_from.indexOf(state+number) != -1)
        {
                let index = ladder_from.indexOf(state+number);
                div = document.getElementById(`${ladder_to[index]}`);
                div.appendChild(player);
        }
        if(snake_from.indexOf(state+number) != -1)
        {
            let index = snake_from.indexOf(state+number);
            div = document.getElementById(`${snake_to[index]}`);
            div.appendChild(player);
        }

    }
}



// These functions are used only in snake-ladder-online-main.js file
/**
 * The function "enable" removes the "disable" class from the element with the id "dice-btn" and
 * enables the button.
 */
function enable()
{
    let btn = document.getElementById("dice-btn");
    btn.classList.remove("disable");
    btn.disabled = false;
}

/**
 * The function "disable" disables a button with the id "dice-btn" by adding a "disable" class and
 * setting the "disabled" property to true.
 */
function disable()
{
    let btn = document.getElementById("dice-btn");
    btn.classList.add("disable");
    btn.disabled = true;
}

/**
 * The function moves an online player on a game board based on their current position and a given
 * number.
 * @param number - The current position of the player on the game board.
 * @param state - The "state" parameter represents the current position/state of the player on the game
 * board.
 * @param user - The user parameter is the ID of the player that needs to be moved.
 */
function move_online_player(number,state,user)
{
    if(number+state <= 100)
    {
        let player = document.getElementById(user);

        let div = document.getElementById(`${number+state}`);
        div.appendChild(player);

        if(ladder_from.indexOf(number+state) != -1)
        {
            let index = ladder_from.indexOf(number+state);
            div = document.getElementById(`${ladder_to[index]}`);
            console.log("ladder ",ladder_to[index]);
            div.appendChild(player);
        }

        if(snake_from.indexOf(state+number) != -1)
        {
            let index = snake_from.indexOf(state+number);
            div = document.getElementById(`${snake_to[index]}`);
            console.log("number,state "+number+","+state);
            // console.log();
            console.log("Snake",snake_to[index]);
            div.appendChild(player);
        }
    }
}

export {
    ids,
    movePlayer,
    move_online_player,
    ladder_from,
    ladder_to,
    snake_from,
    snake_to,
    enable,
    disable,
};