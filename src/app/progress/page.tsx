'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { SUBJECTS } from '@/lib/constants';
import type { Subject, Grade } from '@/lib/types';

export default function ProgressPage() {
  const { progress } = useProgress();

  const subjectsWithScores = SUBJECTS.filter(s => progress.subjectScores[s.id]?.gamesPlayed > 0);
  const accuracy = progress.totalQuestions > 0
    ? Math.round((progress.totalCorrectAnswers / progress.totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-2xl font-bold">Your Progress</h1>
        </div>

        {/* Overall stats */}
        <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-yellow-400">Level {progress.level}</p>
            <p className="text-slate-400">{progress.xp} XP total</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{progress.totalGamesPlayed}</p>
              <p className="text-xs text-slate-400">Games</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{accuracy}%</p>
              <p className="text-xs text-slate-400">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">{progress.streak}</p>
              <p className="text-xs text-slate-400">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        <h2 className="text-lg font-bold mb-3">Subject Progress</h2>
        {subjectsWithScores.length === 0 ? (
          <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
            <p className="text-slate-400">Play some games to see your progress here! 🎮</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {subjectsWithScores.map(subject => {
              const score = progress.subjectScores[subject.id];
              const subjectAccuracy = score.totalQuestions > 0
                ? Math.round((score.correctAnswers / score.totalQuestions) * 100)
                : 0;

              return (
                <div key={subject.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{subject.icon}</span>
                    <span className="font-bold text-sm">{subject.name}</span>
                    <span className="ml-auto text-sm font-bold" style={{ color: subject.color }}>
                      {subjectAccuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${subjectAccuracy}%`, backgroundColor: subject.color }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-400">
                    <span>{score.gamesPlayed} games</span>
                    <span>Best: {score.bestScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
