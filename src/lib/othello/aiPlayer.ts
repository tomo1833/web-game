import { GameBoard, Position, getValidMoves, getFlippedPositions } from './gameLogic';

export type AIStrategy = 'random' | 'greedy' | 'corner';

// AI player class
export class AIPlayer {
  private strategy: AIStrategy;
  
  constructor(strategy: AIStrategy = 'greedy') {
    this.strategy = strategy;
  }
  
  // Get the best move for AI based on current strategy
  getBestMove(board: GameBoard, player: 'black' | 'white'): Position | null {
    const validMoves = getValidMoves(board, player);
    
    if (validMoves.length === 0) return null;
    
    switch (this.strategy) {
      case 'random':
        return this.getRandomMove(validMoves);
      case 'greedy':
        return this.getGreedyMove(board, validMoves, player);
      case 'corner':
        return this.getCornerPreferredMove(board, validMoves, player);
      default:
        return this.getGreedyMove(board, validMoves, player);
    }
  }
  
  // Random strategy - pick any valid move
  private getRandomMove(validMoves: Position[]): Position {
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }
  
  // Greedy strategy - pick the move that flips the most pieces
  private getGreedyMove(board: GameBoard, validMoves: Position[], player: 'black' | 'white'): Position {
    let bestMove = validMoves[0];
    let maxFlips = 0;
    
    for (const move of validMoves) {
      const flippedPositions = getFlippedPositions(board, move.row, move.col, player);
      if (flippedPositions.length > maxFlips) {
        maxFlips = flippedPositions.length;
        bestMove = move;
      }
    }
    
    return bestMove;
  }
  
  // Corner-preferred strategy - prioritize corners, then greedy
  private getCornerPreferredMove(board: GameBoard, validMoves: Position[], player: 'black' | 'white'): Position {
    // Corner positions
    const corners = [
      { row: 0, col: 0 },
      { row: 0, col: 7 },
      { row: 7, col: 0 },
      { row: 7, col: 7 }
    ];
    
    // Check if any corners are available
    for (const corner of corners) {
      if (validMoves.some(move => move.row === corner.row && move.col === corner.col)) {
        return corner;
      }
    }
    
    // Avoid positions adjacent to empty corners if possible
    const dangerousPositions = this.getDangerousPositions(board);
    const safeMovesFiltered = validMoves.filter(move => 
      !dangerousPositions.some(dangerous => 
        dangerous.row === move.row && dangerous.col === move.col
      )
    );
    
    // If we have safe moves, use greedy strategy on them
    if (safeMovesFiltered.length > 0) {
      return this.getGreedyMove(board, safeMovesFiltered, player);
    }
    
    // Otherwise fall back to greedy on all moves
    return this.getGreedyMove(board, validMoves, player);
  }
  
  // Get positions that are dangerous (adjacent to empty corners)
  private getDangerousPositions(board: GameBoard): Position[] {
    const dangerous: Position[] = [];
    const corners = [
      { row: 0, col: 0, adjacent: [{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }] },
      { row: 0, col: 7, adjacent: [{ row: 0, col: 6 }, { row: 1, col: 7 }, { row: 1, col: 6 }] },
      { row: 7, col: 0, adjacent: [{ row: 7, col: 1 }, { row: 6, col: 0 }, { row: 6, col: 1 }] },
      { row: 7, col: 7, adjacent: [{ row: 7, col: 6 }, { row: 6, col: 7 }, { row: 6, col: 6 }] }
    ];
    
    for (const corner of corners) {
      // If corner is empty, adjacent positions are dangerous
      if (board[corner.row][corner.col] === null) {
        dangerous.push(...corner.adjacent);
      }
    }
    
    return dangerous;
  }
  
  // Change AI strategy
  setStrategy(strategy: AIStrategy): void {
    this.strategy = strategy;
  }
  
  // Get current strategy
  getStrategy(): AIStrategy {
    return this.strategy;
  }
}

// Create default AI instance
export const createAI = (strategy: AIStrategy = 'greedy'): AIPlayer => {
  return new AIPlayer(strategy);
};