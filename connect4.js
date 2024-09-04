class Game {
  constructor(height = 6, width = 7) {
    // I'm setting up some things here like the height and width
    this.height = height;   // the number of rows on the board
    this.width = width;     // the number of columns on the board
    this.board = [];        // this will be our game board, but it's empty for now
    this.currPlayer = 1;    // start with player 1 (1 or 2)
    this.gameOver = false;  // let's track if the game is done
    this.makeBoard();       // call the function to create the board array
    this.makeHtmlBoard();   // call the function to create the HTML board
  }

  // This function makes the board array in memory
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      // We're pushing a new array into our board array for each row
      this.board.push(Array.from({ length: this.width }));
    }
  }

  // This function makes the HTML board you can see on the screen
  makeHtmlBoard() {
    const board = document.getElementById('board'); // Get the board element

    // Creating the top row where you can click to drop pieces
    const top = document.createElement('tr');  // Making a table row element
    top.setAttribute('id', 'column-top');  // Setting its ID
    top.addEventListener('click', this.handleClick.bind(this)); // Add event listener for clicks

    for (let x = 0; x < this.width; x++) {
      // Creating each cell in the top row
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x); // Setting the ID to the column number
      top.append(headCell); // Adding the cell to the top row
    }

    board.append(top); // Adding the top row to the board

    // Now we're making the main part of the board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr'); // Making a row

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td'); // Making a cell
        cell.setAttribute('id', `${y}-${x}`); // Setting an ID like "0-0"
        row.append(cell); // Adding the cell to the row
      }

      board.append(row); // Adding the row to the board
    }
  }

  // This function figures out the next empty spot in a column
  findSpotForCol(x) {
    // Start from the bottom and go up
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) { // If the spot is empty
        return y; // Return the row number
      }
    }
    return null; // If the column is full, return null
  }

  // This function places the piece in the HTML board
  placeInTable(y, x) {
    const piece = document.createElement('div'); // Make a piece
    piece.classList.add('piece'); // Add the "piece" class
    piece.classList.add(`p${this.currPlayer}`); // Add class for current player
    piece.style.top = -50 * (y + 2); // Position it

    const spot = document.getElementById(`${y}-${x}`); // Get the correct spot
    spot.append(piece); // Put the piece there
  }

  // This function shows an alert when the game is over
  endGame(msg) {
    alert(msg); // Show the message
    this.gameOver = true; // Stop the game
  }

  // This handles a click on the top row to play a piece
  handleClick(evt) {
    if (this.gameOver) return; // Don't do anything if the game's over

    const x = +evt.target.id; // Get the column number from the ID

    const y = this.findSpotForCol(x); // Find the next empty spot in the column
    if (y === null) {
      return; // If the column is full, do nothing
    }

    this.board[y][x] = this.currPlayer; // Put the piece in the board array
    this.placeInTable(y, x); // Update the HTML board

    if (this.checkForWin()) { // Check if the current player won
      return this.endGame(`Player ${this.currPlayer} won!`); // End the game
    }

    // Check if all cells are filled (tie)
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!'); // End the game
    }

    // Switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  // This checks if the current player has won
  checkForWin() {
    // A helper function to check if four cells are the same player
    const _win = cells => {
      // Check if all cells are within bounds and match the current player
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    // Go through all cells in the board
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Possible winning combinations
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // Check if any win
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }

    return false; // No win
  }
}

// Start a new game when the page loads
new Game();
