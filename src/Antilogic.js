import { Chess  } from 'chess.js';

// Extend the original Chess class from chess.js
class AntiChess extends Chess {
  constructor() {
    super(); // Call the constructor of the parent class (OriginalChess)
  }

  // Override the in_check method to always return false
  in_check() {
    return false; // The king is never considered in check
  }

  // Override the in_checkmate method to always return false
  in_checkmate() {
    return false; // There are no checkmates in anti-chess
  }

  // Override the in_stalemate method to always return false
  in_stalemate() {
    return false; // There are no stalemates in anti-chess
  }

  // Override the in_draw method to always return false
  in_draw() {
    return false; // There are no draws in anti-chess
  }
}

export default AntiChess;
