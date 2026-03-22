'use client';

import React from 'react';
import Link from 'next/link';
import type { GameResult as GameResultType } from '@/lib/types';
import { SUBJECTS, GAMES } from '@/lib/constants';

interface GameResultProps {
  result: GameResultType;
  onPlayAgain: () => void;
}

export default function GameResult({ result, onPlayAgain }: GameResultProps) {
  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const subject = SUBJECTS.find(s => s.id === result.subject);
  const game = GAMES.find(g => g.id === result.gameType);

  const getGrade = () => {
    if (percentage >= 90) return { emoji: '🌟', text: 'AMAZING!', color: 'text-yellow-400' };
    if (percentage >= 70) return { emoji: '🎉', text: 'Great Job!', color: 'text-green-400' };
    if (percentage >= 50) return { emoji: '👍', text: 'Good Try!', color: 'text-blue-400' };
    return { emoji: '💪', text: 'Keep Trying!', color: 'text-purple-400' };
  };

  const grade = getGrade();

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center border border-white/10 animate-bounce-in">
        <div className="text-6xl mb-4">{grade.emoji}</div>
        <h1 className={`text-3xl font-bold mb-2 ${grade.color}`}>{grade.text}</h1>

        <div className="bg-white/5 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">{subject?.icon}</span>
            <span className="text-lg font-medium">{subject?.name}</span>
          </div>
          <div className="text-sm text-slate-400 mb-3">{game?.name}</div>

          <div className="text-5xl font-bold mb-1" style={{ color: subject?.color }}>
            {percentage}%
          </div>
          <div className="text-slate-400">
            {result.score} / {result.totalQuestions} correct
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-slate-400">Time</div>
            <div className="font-bold text-lg">{result.timeTaken}s</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-slate-400">XP Earned</div>
            <div className="font-bold text-lg text-yellow-400">+{result.score * 10 + 5}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            Play Again 🔄
          </button>
          <Link
            href="/"
            className="w-full py-3 rounded-xl font-bold text-slate-300 bg-white/5 hover:bg-white/10 transition-all block"
          >
            Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
