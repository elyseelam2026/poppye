'use client';

import React from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { ALL_BADGES } from '@/lib/constants';

export default function BadgesPage() {
  const { progress } = useProgress();

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-2xl font-bold">Badges</h1>
          <span className="ml-auto text-sm text-slate-400">
            {progress.badges.length} / {ALL_BADGES.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {ALL_BADGES.map(badge => {
            const earned = progress.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-4 text-center border transition-all ${
                  earned
                    ? 'bg-yellow-400/10 border-yellow-400/30 animate-pulse-glow'
                    : 'bg-white/5 border-white/10 opacity-40'
                }`}
              >
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <p className="font-bold text-xs">{badge.name}</p>
                <p className="text-[10px] text-slate-400 mt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
