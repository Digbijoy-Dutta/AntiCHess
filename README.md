# AntiCHess
AntiChess game using React.js

<b>You can play the game @ https://pice-antichess.netlify.app/</b>

Welcome to the AntiChess game, a variant of chess where the objective is to lose all your pieces! This game is built using React and allows two players to play against each other.


# Installation
To get started with the AntiChess game, clone the repository and install the dependencies:

```
git clone https://github.com/yourusername/antichess-game.git
cd antichess-game
```

# Usage
To run the game locally, use the following command:
```
npm start
```
Open your browser and navigate to http://localhost:3000 to start playing.

# Rules
AntiChess follows the same movement rules as traditional chess with the following modifications:

### Objective: The goal is to lose all of your pieces.
### Capturing is Mandatory: If a player can make a capture, they must do so.

# Components
### AntiChessGame Component
The AntiChessGame component manages the game logic and state, including:

**State Initialization:** Initializes the game state, including the board orientation, turn, and win counters.
**Piece Drop Handling**: Handles piece movements and enforces mandatory captures.
**Game Over Check**: Checks if the game is over when one player loses all pieces.
**Move History**: Maintains a history of moves.
**Quit and Reset**: Allows players to quit or reset the game.

### Key Functions
**onDrop**: Handles piece movements on the board.
**hasMandatoryCapture**: Checks if a mandatory capture is available.
**updatePiecesCount**: Updates the count of remaining pieces for each player.
**checkGameOver**: Determines if the game is over and updates the winner.
**handleQuit**: Allows a player to quit the game and declares the winner.
**resetGame**: Resets the game state to start a new game.

### AntiChess Class
The AntiChess class extends the original Chess class from chess.js to implement AntiChess-specific rules:

**in_check**: Always returns false, as the king is never considered in check.
**in_checkmate**: Always returns false, as there are no checkmates in AntiChess.
**in_stalemate**: Always returns false, as there are no stalemates in AntiChess.
**in_draw**: Always returns false, as there are no draws in AntiChess.


