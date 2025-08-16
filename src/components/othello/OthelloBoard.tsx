'use client';

import React from 'react';
import { GameBoard, Player } from '@/lib/othello/gameLogic';

interface OthelloBoardProps {
  board: GameBoard;
  validMoves: number[][];
  onCellClick: (row: number, col: number) => void;
  currentPlayer: 'black' | 'white';
  disabled?: boolean;
}

const OthelloBoard: React.FC<OthelloBoardProps> = ({
  board,
  validMoves,
  onCellClick,
  currentPlayer,
  disabled = false
}) => {
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move[0] === row && move[1] === col);
  };

  const getCellContent = (player: Player, row: number, col: number) => {
    if (player) {
      return (
        <div 
          className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
            player === 'black' 
              ? 'bg-gray-900 border-gray-700' 
              : 'bg-white border-gray-300'
          }`}
        />
      );
    }
    
    if (isValidMove(row, col) && !disabled) {
      return (
        <div className={`w-6 h-6 rounded-full border-2 border-dashed opacity-50 transition-all duration-200 hover:opacity-80 ${
          currentPlayer === 'black'
            ? 'border-gray-900 hover:bg-gray-900'
            : 'border-gray-300 hover:bg-white'
        }`} />
      );
    }
    
    return null;
  };

  return (
    <div className="inline-block bg-green-600 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-8 gap-1">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 bg-green-500 border border-green-700 flex items-center justify-center transition-all duration-200 hover:bg-green-400 ${
                isValidMove(rowIndex, colIndex) && !disabled
                  ? 'cursor-pointer' 
                  : 'cursor-default'
              } ${
                disabled ? 'opacity-60' : ''
              }`}
              onClick={() => !disabled && onCellClick(rowIndex, colIndex)}
              disabled={disabled || !isValidMove(rowIndex, colIndex)}
            >
              {getCellContent(cell, rowIndex, colIndex)}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default OthelloBoard;