import React from 'react';
import Link from 'next/link';
import OthelloGame from '@/components/othello/OthelloGame';

export default function OthelloPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Othello (Reversi)
          </h1>
          <div className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
            <p className="mb-4">
              Place your stones to flip your opponent&apos;s pieces. The player with the most stones wins!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-white p-6 rounded-lg shadow-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How to Play:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Place stones on valid positions (highlighted)</li>
                  <li>• Flip opponent&apos;s stones between your pieces</li>
                  <li>• If no valid moves, turn is skipped</li>
                  <li>• Game ends when no player can move</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Game Modes:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Human vs Human:</strong> Take turns locally</li>
                  <li>• <strong>Human vs AI:</strong> Play against computer</li>
                  <li>• <strong>AI Strategies:</strong> Random, Greedy, Corner</li>
                  <li>• You play as Black (go first)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Game Component */}
        <OthelloGame />

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span>← Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}