export type Player = 'black' | 'white' | null;
export type GameBoard = Player[][];

export interface GameState {
  board: GameBoard;
  currentPlayer: 'black' | 'white';
  blackScore: number;
  whiteScore: number;
  gameStatus: 'playing' | 'finished' | 'draw';
  validMoves: number[][];
}

export interface Position {
  row: number;
  col: number;
}

// Initialize empty 8x8 board with starting position
export function createInitialBoard(): GameBoard {
  const board: GameBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initial Othello setup - 4 pieces in center
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  
  return board;
}

// Calculate score for both players
export function calculateScore(board: GameBoard): { black: number; white: number } {
  let black = 0;
  let white = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'black') black++;
      else if (board[row][col] === 'white') white++;
    }
  }
  
  return { black, white };
}

// Check if position is valid on board
function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Get opposite player
export function getOppositePlayer(player: 'black' | 'white'): 'black' | 'white' {
  return player === 'black' ? 'white' : 'black';
}

// Check if a move would flip stones in a given direction
function checkDirection(
  board: GameBoard,
  row: number,
  col: number,
  dRow: number,
  dCol: number,
  player: 'black' | 'white'
): Position[] {
  const toFlip: Position[] = [];
  const opponent = getOppositePlayer(player);
  
  let currentRow = row + dRow;
  let currentCol = col + dCol;
  
  // First, collect opponent pieces in this direction
  while (
    isValidPosition(currentRow, currentCol) &&
    board[currentRow][currentCol] === opponent
  ) {
    toFlip.push({ row: currentRow, col: currentCol });
    currentRow += dRow;
    currentCol += dCol;
  }
  
  // Check if the line ends with player's piece (valid flip)
  if (
    toFlip.length > 0 &&
    isValidPosition(currentRow, currentCol) &&
    board[currentRow][currentCol] === player
  ) {
    return toFlip;
  }
  
  return [];
}

// Get all positions that would be flipped by a move
export function getFlippedPositions(
  board: GameBoard,
  row: number,
  col: number,
  player: 'black' | 'white'
): Position[] {
  if (board[row][col] !== null) return [];
  
  const allFlipped: Position[] = [];
  
  // Check all 8 directions
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [dRow, dCol] of directions) {
    const flipped = checkDirection(board, row, col, dRow, dCol, player);
    allFlipped.push(...flipped);
  }
  
  return allFlipped;
}

// Check if a move is valid
export function isValidMove(
  board: GameBoard,
  row: number,
  col: number,
  player: 'black' | 'white'
): boolean {
  if (!isValidPosition(row, col) || board[row][col] !== null) return false;
  return getFlippedPositions(board, row, col, player).length > 0;
}

// Get all valid moves for a player
export function getValidMoves(board: GameBoard, player: 'black' | 'white'): Position[] {
  const validMoves: Position[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(board, row, col, player)) {
        validMoves.push({ row, col });
      }
    }
  }
  
  return validMoves;
}

// Make a move and return new board state
export function makeMove(
  board: GameBoard,
  row: number,
  col: number,
  player: 'black' | 'white'
): GameBoard | null {
  if (!isValidMove(board, row, col, player)) return null;
  
  // Create a copy of the board
  const newBoard = board.map(row => [...row]);
  
  // Place the new stone
  newBoard[row][col] = player;
  
  // Flip all affected positions
  const toFlip = getFlippedPositions(board, row, col, player);
  for (const pos of toFlip) {
    newBoard[pos.row][pos.col] = player;
  }
  
  return newBoard;
}

// Create initial game state
export function createInitialGameState(): GameState {
  const board = createInitialBoard();
  const { black, white } = calculateScore(board);
  const validMoves = getValidMoves(board, 'black');
  
  return {
    board,
    currentPlayer: 'black', // Black always goes first in Othello
    blackScore: black,
    whiteScore: white,
    gameStatus: 'playing',
    validMoves: validMoves.map(pos => [pos.row, pos.col])
  };
}

// Update game state after a move
export function updateGameState(gameState: GameState, row: number, col: number): GameState {
  const newBoard = makeMove(gameState.board, row, col, gameState.currentPlayer);
  if (!newBoard) return gameState; // Invalid move
  
  const nextPlayer = getOppositePlayer(gameState.currentPlayer);
  const { black, white } = calculateScore(newBoard);
  
  // Check if next player has valid moves
  const nextPlayerMoves = getValidMoves(newBoard, nextPlayer);
  const currentPlayerMoves = getValidMoves(newBoard, gameState.currentPlayer);
  
  let finalCurrentPlayer = nextPlayer;
  let gameStatus: 'playing' | 'finished' | 'draw' = 'playing';
  let validMoves = nextPlayerMoves.map(pos => [pos.row, pos.col]);
  
  // If next player has no moves, check if current player does
  if (nextPlayerMoves.length === 0) {
    if (currentPlayerMoves.length === 0) {
      // Game over - no moves for either player
      gameStatus = black === white ? 'draw' : 'finished';
    } else {
      // Skip next player's turn
      finalCurrentPlayer = gameState.currentPlayer;
      validMoves = currentPlayerMoves.map(pos => [pos.row, pos.col]);
    }
  }
  
  return {
    board: newBoard,
    currentPlayer: finalCurrentPlayer,
    blackScore: black,
    whiteScore: white,
    gameStatus,
    validMoves
  };
}

// Get winner
export function getWinner(gameState: GameState): 'black' | 'white' | 'draw' | null {
  if (gameState.gameStatus !== 'finished' && gameState.gameStatus !== 'draw') {
    return null;
  }
  
  if (gameState.gameStatus === 'draw') return 'draw';
  
  return gameState.blackScore > gameState.whiteScore ? 'black' : 'white';
}