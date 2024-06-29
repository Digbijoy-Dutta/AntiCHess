import React, { Component } from 'react';
import { Chessboard } from 'react-chessboard'; // Importing the Chessboard component from react-chessboard
import AntiChess from './Antilogic'; // Importing the AntiChess class
import Header from './Header';
import Footer from './Footer';
import './App.css';
class AntiChessGame extends Component {
  constructor(props) {
    super(props);
    // Initialize the state with game settings and initial game state
    this.state = {
      game: new AntiChess(), // Initialize a new instance of AntiChess game
      fen: 'start', // FEN notation for the starting position
      turn: 'w', // Initial turn (white starts first)
      orientation: 'white', // Board orientation (white at the bottom)
      player1Wins: 0, // Player 1 wins counter
      player2Wins: 0, // Player 2  wins counter
      winner: null, // Winner of the current game round
      history: [], // Array to store move history
      piecesCount: { w: 16, b: 16 }, // Initial count of pieces for each color
      black: 2,  // initial player no. with black 
      white: 1  //initial player no. with white
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
    const { piecesCount, player1Wins, player2Wins,black,white } = this.state;
    let newPlayer1Wins=player1Wins, newPlayer2Wins=player2Wins,no;
    if (piecesCount.w === 1 || piecesCount.b === 1) {
      const winner = piecesCount.w === 1 ? 'Black' : 'White'; // Determine the winner
      if (winner==='Black'){
         no=this.state.black;
        if (no===1)
           newPlayer1Wins = player1Wins + 1 ;// Increment winner's win count
        else
        newPlayer2Wins = player2Wins + 1;
      }
      else{   no=this.state.white;
        if (no===1)
           newPlayer1Wins = player1Wins + 1 ;// Increment winner's win count
        else
        newPlayer2Wins = player2Wins + 1;

      }
      alert("Player No. "+no+" wins in "+winner);
      // Update state with winner and win counts
      this.setState({
        winner:winner,
        player1Wins: newPlayer1Wins,
        player2Wins: newPlayer2Wins,
        black: white,
        white:black
      });
      this.resetGame(); //reset the game state
    }
  };

  // Handle quitting the current game round
  handleQuit = () => {
    const { turn, player1Wins, player2Wins, black,white } = this.state;
    let newPlayer1Wins=player1Wins, newPlayer2Wins=player2Wins,no;

    const winner = turn === 'w' ? 'Black' : 'White'; // Determine winner (opposite of current turn)
    if (winner==='Black'){
       no=this.state.black;
      if (no===1)
         newPlayer1Wins = player1Wins + 1 ;// Increment winner's win count
      else
      newPlayer2Wins = player2Wins + 1;
    }
    else{   no=this.state.white;
      if (no===1)
         newPlayer1Wins = player1Wins + 1 ;// Increment winner's win count
      else
      newPlayer2Wins = player2Wins + 1;

    }
    alert("Player No. "+no+" wins in "+winner);
     // Update state with winner and win counts
     this.setState({
      winner:winner,
      player1Wins: newPlayer1Wins,
      player2Wins: newPlayer2Wins,
      black: white,
      white:black
    });
    this.resetGame(); //reset the game state
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
      <div className="container">
        <Header turn={turn === 'w' ? 'White' : 'Black'}/>
        {/* Render the Chessboard component */}
        <div className="game-area"> 
          <Chessboard
          position={fen}
          onPieceDrop={this.onDrop}
          boardOrientation={orientation}
        />
        </div>
       
        <div className="info-panel">
          {/* Display current turn, wins, remaining pieces */}
          <p>Current Turn: {turn === 'w' ? 'White' : 'Black'}</p>
          <p>Player 1  Wins: {player1Wins}</p>
          <p>Player 2  Wins: {player2Wins}</p>
          <p> Current White: Player no. {this.state.white} </p>
          <p> Current Black: Player no. {this.state.black} </p>

          <p>White Pieces Left: {piecesCount.w}</p>
          <p>Black Pieces Left: {piecesCount.b}</p>
          
          {/* Buttons for quitting, resetting */}
          <button className="button" onClick={this.handleQuit}>Quit</button>
          <button className="button" onClick={this.resetGame}>Reset</button>
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
