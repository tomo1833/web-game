'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameState, createInitialGameState, updateGameState, getWinner } from '@/lib/othello/gameLogic';
import { AIPlayer, AIStrategy } from '@/lib/othello/aiPlayer';
import OthelloBoard from './OthelloBoard';

export type GameMode = 'human-vs-human' | 'human-vs-ai';

interface OthelloGameProps {
  initialMode?: GameMode;
}

const OthelloGame: React.FC<OthelloGameProps> = ({ 
  initialMode = 'human-vs-human' 
}) => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [gameMode, setGameMode] = useState<GameMode>(initialMode);
  const [aiStrategy, setAiStrategy] = useState<AIStrategy>('greedy');
  const [aiPlayer] = useState(() => new AIPlayer('greedy'));
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameState[]>([createInitialGameState()]);
  
  // Update AI strategy when it changes
  useEffect(() => {
    aiPlayer.setStrategy(aiStrategy);
  }, [aiStrategy, aiPlayer]);

  // Handle AI moves
  const makeAiMove = useCallback(async () => {
    if (
      gameMode === 'human-vs-ai' && 
      gameState.currentPlayer === 'white' &&
      gameState.gameStatus === 'playing' &&
      !isAiThinking
    ) {
      setIsAiThinking(true);
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const aiMove = aiPlayer.getBestMove(gameState.board, 'white');
      
      if (aiMove) {
        const newGameState = updateGameState(gameState, aiMove.row, aiMove.col);
        setGameState(newGameState);
        setGameHistory(prev => [...prev, newGameState]);
      }
      
      setIsAiThinking(false);
    }
  }, [gameMode, gameState, aiPlayer]);

  // Effect to trigger AI moves
  useEffect(() => {
    if (gameMode === 'human-vs-ai' && 
        gameState.currentPlayer === 'white' &&
        gameState.gameStatus === 'playing' &&
        !isAiThinking) {
      makeAiMove();
    }
  }, [gameMode, gameState.currentPlayer, gameState.gameStatus, isAiThinking, makeAiMove]);

  const handleCellClick = (row: number, col: number) => {
    // Prevent moves when AI is thinking or game is over
    if (isAiThinking || gameState.gameStatus !== 'playing') return;
    
    // In AI mode, only allow human (black) to make moves directly
    if (gameMode === 'human-vs-ai' && gameState.currentPlayer === 'white') return;

    const newGameState = updateGameState(gameState, row, col);
    
    // Only update if the move was valid
    if (newGameState !== gameState) {
      setGameState(newGameState);
      setGameHistory(prev => [...prev, newGameState]);
    }
  };

  const resetGame = () => {
    const initialState = createInitialGameState();
    setGameState(initialState);
    setGameHistory([initialState]);
    setIsAiThinking(false);
  };

  const undoMove = () => {
    if (gameHistory.length > 1) {
      const newHistory = gameHistory.slice(0, -1);
      const previousState = newHistory[newHistory.length - 1];
      setGameHistory(newHistory);
      setGameState(previousState);
    }
  };

  const winner = getWinner(gameState);

  const getGameStatusText = () => {
    if (isAiThinking) {
      return 'AI is thinking...';
    }
    
    if (winner === 'draw') {
      return "It's a draw!";
    }
    
    if (winner) {
      const winnerName = winner === 'black' ? (gameMode === 'human-vs-ai' ? 'You' : 'Black') : (gameMode === 'human-vs-ai' ? 'AI' : 'White');
      return `${winnerName} wins!`;
    }
    
    if (gameState.gameStatus === 'playing') {
      if (gameMode === 'human-vs-ai') {
        return gameState.currentPlayer === 'black' ? 'Your turn' : "AI's turn";
      } else {
        return `${gameState.currentPlayer === 'black' ? 'Black' : 'White'}'s turn`;
      }
    }
    
    return '';
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* Game Mode Selection */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => {
            setGameMode('human-vs-human');
            resetGame();
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            gameMode === 'human-vs-human'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Human vs Human
        </button>
        <button
          onClick={() => {
            setGameMode('human-vs-ai');
            resetGame();
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            gameMode === 'human-vs-ai'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Human vs AI
        </button>
      </div>

      {/* AI Strategy Selection */}
      {gameMode === 'human-vs-ai' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">AI Strategy:</span>
          <select
            value={aiStrategy}
            onChange={(e) => setAiStrategy(e.target.value as AIStrategy)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="random">Random</option>
            <option value="greedy">Greedy (Most Flips)</option>
            <option value="corner">Corner Strategy</option>
          </select>
        </div>
      )}

      {/* Game Status */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {getGameStatusText()}
        </h2>
        
        {/* Score Display */}
        <div className="flex space-x-8 text-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
            <span className={`font-semibold ${gameMode === 'human-vs-ai' ? '' : gameState.currentPlayer === 'black' ? 'text-blue-600' : ''}`}>
              {gameMode === 'human-vs-ai' ? 'You' : 'Black'}: {gameState.blackScore}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full"></div>
            <span className={`font-semibold ${gameMode === 'human-vs-ai' ? '' : gameState.currentPlayer === 'white' ? 'text-blue-600' : ''}`}>
              {gameMode === 'human-vs-ai' ? 'AI' : 'White'}: {gameState.whiteScore}
            </span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <OthelloBoard
        board={gameState.board}
        validMoves={gameState.validMoves}
        onCellClick={handleCellClick}
        currentPlayer={gameState.currentPlayer}
        disabled={isAiThinking}
      />

      {/* Game Controls */}
      <div className="flex space-x-4">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          New Game
        </button>
        
        <button
          onClick={undoMove}
          disabled={gameHistory.length <= 1 || isAiThinking}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Undo
        </button>
      </div>

      {/* Game Rules Info */}
      {gameState.validMoves.length === 0 && gameState.gameStatus === 'playing' && (
        <div className="text-center text-gray-600 bg-yellow-100 p-3 rounded-lg">
          No valid moves available. Turn skipped.
        </div>
      )}
    </div>
  );
};

export default OthelloGame;