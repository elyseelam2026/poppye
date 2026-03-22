'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SUBJECTS, GRADES, GAMES } from '@/lib/constants';
import type { Subject, Grade, GameType } from '@/lib/types';
import QuizBattle from '@/components/games/QuizBattle';
import MemoryMatch from '@/components/games/MemoryMatch';
import WordScramble from '@/components/games/WordScramble';
import SpeedChallenge from '@/components/games/SpeedChallenge';
import FlashcardFlip from '@/components/games/FlashcardFlip';

export default function PlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.gameId as GameType;

  const [subject, setSubject] = useState<Subject>(
    (searchParams.get('subject') as Subject) || 'maths'
  );
  const [grade, setGrade] = useState<Grade>(
    (searchParams.get('grade') as Grade) || 'P3'
  );
  const [started, setStarted] = useState(!!searchParams.get('subject'));

  const game = GAMES.find(g => g.id === gameId);

  if (!game) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Game not found!</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300">← Home</Link>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] p-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="text-2xl">←</Link>
            <h1 className="text-2xl font-bold">{game.name}</h1>
          </div>

          <div className={`bg-gradient-to-r ${game.gradient} rounded-2xl p-6 mb-6 text-center`}>
            <span className="text-5xl block mb-2">{game.icon}</span>
            <p className="text-lg font-bold">{game.name}</p>
            <p className="text-sm text-white/70">{game.description}</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
            <label className="block text-sm font-bold mb-2">Choose Subject</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {SUBJECTS.slice(0, 9).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={`p-2 rounded-xl text-center text-xs transition-all ${
                    s.id === subject
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className="block text-lg">{s.icon}</span>
                  {s.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <label className="block text-sm font-bold mb-2">Grade</label>
            <div className="flex gap-2">
              {GRADES.map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`px-4 py-2 rounded-full text-sm font-bold flex-1 ${
                    g === grade ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className={`w-full py-4 rounded-2xl font-bold text-xl bg-gradient-to-r ${game.gradient} hover:scale-[1.02] active:scale-[0.98] transition-all`}
          >
            Start! 🚀
          </button>
        </div>
      </div>
    );
  }

  switch (gameId) {
    case 'quiz-battle':
      return <QuizBattle subject={subject} grade={grade} />;
    case 'memory-match':
      return <MemoryMatch subject={subject} grade={grade} />;
    case 'word-scramble':
      return <WordScramble subject={subject} grade={grade} />;
    case 'speed-challenge':
      return <SpeedChallenge subject={subject} grade={grade} />;
    case 'flashcard-flip':
      return <FlashcardFlip subject={subject} grade={grade} />;
    default:
      return <QuizBattle subject={subject} grade={grade} />;
  }
}
