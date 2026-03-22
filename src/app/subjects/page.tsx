'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SUBJECTS, GRADES, GAMES } from '@/lib/constants';
import type { Subject, Grade, GameType } from '@/lib/types';

export default function SubjectsPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade>('P3');

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-2xl font-bold">Choose Subject</h1>
        </div>

        {/* Grade selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {GRADES.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                g === selectedGrade
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {!selectedSubject ? (
          <div className="grid grid-cols-2 gap-3">
            {SUBJECTS.map(subject => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`bg-gradient-to-br ${subject.gradient} rounded-2xl p-4 text-left hover:scale-[1.02] active:scale-[0.98] transition-all`}
              >
                <span className="text-3xl block mb-2">{subject.icon}</span>
                <p className="font-bold text-sm">{subject.name}</p>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-sm text-purple-400 mb-4 hover:text-purple-300"
            >
              ← Back to subjects
            </button>
            <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{SUBJECTS.find(s => s.id === selectedSubject)?.icon}</span>
                <span className="font-bold">{SUBJECTS.find(s => s.id === selectedSubject)?.name}</span>
                <span className="text-sm text-slate-400 ml-auto">{selectedGrade}</span>
              </div>
            </div>
            <h3 className="font-bold mb-3">Choose a Game:</h3>
            <div className="grid gap-3">
              {GAMES.map(game => (
                <Link
                  key={game.id}
                  href={`/play/${game.id}?subject=${selectedSubject}&grade=${selectedGrade}`}
                  className={`bg-gradient-to-r ${game.gradient} rounded-2xl p-4 hover:scale-[1.02] active:scale-[0.98] transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <p className="font-bold">{game.name}</p>
                      <p className="text-sm text-white/70">{game.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
