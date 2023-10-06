// Function to check if a player has won
/**
 * The function `checkWin` checks if a player has won in a tic-tac-toe game based on the current state
 * of the board.
 * @param board - The `board` parameter represents the current state of the game board. It is an array
 * that contains the positions of the players' moves. Each element in the array represents a position
 * on the board, and its value can be either "X", "O", or empty ("").
 * @param player - The `player` parameter represents the player for whom we are checking if they have
 * won the game.
 * @returns The function `checkWin` returns a boolean value. It returns `true` if the specified player
 * has won the game on the given board, and `false` otherwise.
 */


function checkWin(board, player) {
    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
  
    for (const combo of winCombos) {
      const [a, b, c] = combo;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return true;
      }
    }
    return false;
  }
  
  // Function to check if the game is a tie
/**
 * The function checks if the game board is full and returns true if it is, indicating a tie.
 * @param board - The "board" parameter is an array representing the game board. Each element in the
 * array represents a cell on the board, and the value of each element can be either 'X', 'O', or an
 * empty string ('').
 * @returns a boolean value. It returns true if every cell in the board is not an empty string,
 * indicating that the game is tied. Otherwise, it returns false.
 */
  function checkTie(board) {
    return board.every(cell => cell !== '');
  }
  
  // Minimax function
/**
 * The minimax function is a recursive algorithm that determines the best possible move for a player in
 * a tic-tac-toe game.
 * @param board - The board parameter represents the current state of the tic-tac-toe board. It is an
 * array of length 9, where each element represents a cell on the board. An empty cell is represented
 * by an empty string (''), the AI player's moves are represented by 'O', and the human
 * @param depth - The depth parameter represents the current depth of the recursive function call. It
 * is used to keep track of how many moves have been made in the game.
 * @param isMaximizing - The `isMaximizing` parameter is a boolean value that indicates whether the
 * current player is the maximizing player (AI player) or the minimizing player (human player). If
 * `isMaximizing` is `true`, it means it's the AI player's turn to make a move and maximize
 * @returns The function `minimax` returns the best score for the current state of the board. If the AI
 * player wins, it returns 1. If the human player wins, it returns -1. If it's a tie, it returns 0.
 */
  function minimax(board, depth, isMaximizing) {
    const aiPlayer = 'O'; // AI player
    const humanPlayer = 'X'; // Human player
  
    // Base cases
    if (checkWin(board, aiPlayer)) {
      return 1;
    } else if (checkWin(board, humanPlayer)) {
      return -1;
    } else if (checkTie(board)) {
      return 0;
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = aiPlayer;
          const score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = humanPlayer;
          const score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }
  
  // Function to find the best move using minimax
  /**
   * The function `findBestMove` uses the minimax algorithm to determine the best move for the AI
   * player in a tic-tac-toe game.
   * @param board - The "board" parameter represents the current state of the tic-tac-toe board. It is
   * an array of length 9, where each element represents a cell on the board. The elements can have
   * three possible values: 'X' for the human player's move, 'O' for the
   * @returns The function `findBestMove` returns the index of the best move for the AI player on the
   * given board.
   */
  function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = -1;
  
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O'; // AI player's move
        const score = minimax(board, 0, false);
        board[i] = ''; // Undo the move
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
  
    return bestMove;
  }
  
export{
    findBestMove,
}
  