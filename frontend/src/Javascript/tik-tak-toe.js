/* The `winnerMatrix` is a 2-dimensional array that represents all the possible winning combinations in
a tic-tac-toe game. Each inner array represents a winning combination, and each element within the
inner array represents a position on the tic-tac-toe board. For example, the first inner array
`["1","2","3"]` represents the winning combination of having the symbols in positions 1, 2, and 3 on
the board. */
const winnerMatrix = [
    ["1","2","3"],
    ["4","5","6"],
    ["7","8","9"],
    ["1","4","7"],
    ["2","5","8"],
    ["3","6","9"],
    ["1","5","9"],
    ["3","5","7"]
];

/**
 * The function checks if a given user has won the game by comparing the values of three elements on
 * the game board.
 * @param user - The "user" parameter represents the symbol (e.g., "X" or "O") that we are checking for
 * in the tic-tac-toe game.
 * @returns a boolean value. It returns true if there is a winning combination of the specified user in
 * the tic-tac-toe game, and false otherwise.
 */
function checkWinner(user)
{
    for(let combination of winnerMatrix)
    {
        let one = document.getElementById(combination[0]).innerText;
        let two = document.getElementById(combination[1]).innerText;
        let three = document.getElementById(combination[2]).innerText;

        if((one== two) && (two == three) && (three == user))
        {
            return true;
        }
    }
    return false;
}

/**
 * The function checks if a game board is in a tie state.
 * @param board - The "board" parameter is an array representing the game board. It contains 9
 * elements, each representing a cell on the board. The elements can have three possible values: "X"
 * for player X, "O" for player O, or null if the cell is empty.
 * @returns a boolean value. It returns true if the game is a tie (all positions on the board are
 * filled) and false if the game is not a tie (there are still empty positions on the board).
 */
function checkGameTie(board)
{
    for(let i = 0; i < 9; i++)
        if(board[i])
        {
            continue;
        }else{
            return false;
        }
    return true;
}


export {
    winnerMatrix,
    checkWinner,
    checkGameTie,
}