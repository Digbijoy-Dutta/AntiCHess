import React, { Component } from 'react';
import { Chessboard } from 'react-chessboard'; // Importing the Chessboard component from react-chessboard
import AntiChess from './Antilogic'; // Importing the AntiChess class
import Header from './Header';
import Footer from './Footer';
class AntiChessGame extends Component {
  constructor(props) {
    super(props);
    // Initialize the state with game settings and initial game state
    this.state = {
      game: new AntiChess(), // Initialize a new instance of AntiChess game
      fen: 'start', // FEN notation for the starting position
      turn: 'w', // Initial turn (white starts first)
      orientation: 'white', // Board orientation (white at the bottom)
      player1Wins: 0, // Player 1 (White) wins counter
      player2Wins: 0, // Player 2 (Black) wins counter
      winner: null, // Winner of the current game round
      history: [], // Array to store move history
      piecesCount: { w: 16, b: 16 }, 
      black: 2,
      white: 1// Initial count of pieces for each color
    };
  }

  // Handler for when a piece is dropped on the board
  onDrop = (sourceSquare, targetSquare) => {
    const { game, turn } = this.state;

    let moveglobal;

    // Check for mandatory capture if applicable
    if (this.hasMandatoryCapture(game)) {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });
      if (move === null) 
        return false; // Illegal move

      if ( !move.flags.includes('c')) {
        // If move doesn't capture when mandatory, handle error
        alert("You must capture an opponent's piece if possible!");
        game.undo(); // Undo the move
        return false;
      }

      moveglobal = move; // Save the move globally
    } else {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (move === null) return false; // If move is illegal, return false
      moveglobal = move; // Save the move globally
    }

    // Update game state after successful move
    this.setState(
      (prevState) => ({
        fen: game.fen(), // Update FEN notation
        turn: game.turn(), // Update current turn
        orientation: turn === 'w' ? 'black' : 'white', // Toggle board orientation
        history: [...prevState.history, moveglobal.san], // Add move to history
        piecesCount: this.updatePiecesCount(game), // Update count of pieces
      }),
      this.checkGameOver // Check if the game is over
    );

    return true;
  };

  // Check if there's a mandatory capture available
  hasMandatoryCapture(game) {
    const moves = game.moves({ verbose: true });
    return moves.some((move) => move.flags.includes('c')); // Check for captures
  }

  // Update the count of remaining pieces for each color
  updatePiecesCount(game) {
    const pieces = game.board().flat(); // Flatten the board array
    const whiteCount = pieces.filter((piece) => piece && piece.color === 'w').length; // Count white pieces
    const blackCount = pieces.filter((piece) => piece && piece.color === 'b').length; // Count black pieces
    return { w: whiteCount, b: blackCount }; // Return updated counts
  }

  // Check if the game is over (no pieces left for one color)
  checkGameOver = () => {
    const { piecesCount, player1Wins, player2Wins } = this.state;
    if (piecesCount.w === 0 || piecesCount.b === 0) {
      const winner = piecesCount.w === 0 ? 'Black' : 'White'; // Determine the winner
      const newPlayer1Wins = winner === 'White' ? player1Wins + 1 : player1Wins; // Increment winner's win count
      const newPlayer2Wins = winner === 'Black' ? player2Wins + 1 : player2Wins; // Increment loser's win count

      // Update state with winner and win counts
      this.setState({
        winner,
        player1Wins: newPlayer1Wins,
        player2Wins: newPlayer2Wins,
      });
    }
  };

  // Handle quitting the current game round
  handleQuit = () => {
    const { turn, player1Wins, player2Wins } = this.state;
    const winner = turn === 'w' ? 'Black' : 'White'; // Determine winner (opposite of current turn)
    const newPlayer1Wins = winner === 'White' ? player1Wins + 1 : player1Wins; // Increment winner's win count
    const newPlayer2Wins = winner === 'Black' ? player2Wins + 1 : player2Wins; // Increment loser's win count

    // Reset game state to start a new round
    this.setState({
      winner,
      player1Wins: newPlayer1Wins,
      player2Wins: newPlayer2Wins,
      game: new AntiChess(),
      fen: 'start',
      turn: 'w',
      orientation: 'white',
      history: [],
      piecesCount: { w: 16, b: 16 },
    });
  };

  // Reset the entire game state
  resetGame = () => {
    this.setState({
      game: new AntiChess(),
      fen: 'start',
      turn: 'w',
      orientation: 'white',
      winner: null,
      history: [],
      piecesCount: { w: 16, b: 16 },
    });
  };

  render() {
    const { fen, turn, orientation, winner, player1Wins, player2Wins, history, piecesCount } = this.state;

    return (
      <div>
        <Header turn={turn === 'w' ? 'White' : 'Black'}/>
        {/* Render the Chessboard component */}
        <Chessboard
          position={fen}
          onPieceDrop={this.onDrop}
          boardOrientation={orientation}
        />
        <div>
          {/* Display current turn, wins, remaining pieces, and winner */}
          <p>Current Turn: {turn === 'w' ? 'White' : 'Black'}</p>
          <p>Player 1 (White) Wins: {player1Wins}</p>
          <p>Player 2 (Black) Wins: {player2Wins}</p>
          <p>White Pieces Left: {piecesCount.w}</p>
          <p>Black Pieces Left: {piecesCount.b}</p>
          {winner && <p>Winner: {winner}</p>} {/* Display winner if game is over */}
          {/* Buttons for quitting, resetting, and move history */}
          <button onClick={this.handleQuit}>Quit</button>
          <button onClick={this.resetGame}>Reset</button>
          <div>
            <h2>Move History</h2>
            <ol>
              {/* Display move history */}
              {history.map((move, index) => (
                <li key={index}>{move}</li>
              ))}
            </ol>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default AntiChessGame;
