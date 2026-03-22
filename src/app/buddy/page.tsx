'use client';

import React from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { BUDDIES } from '@/lib/constants';
import BuddyAvatar from '@/components/BuddyAvatar';

export default function BuddyPage() {
  const { progress, dispatch, customBuddies, removeCustomBuddy } = useProgress();
  const allBuddies = [...BUDDIES, ...customBuddies];
  const currentBuddy = allBuddies.find(b => b.id === progress.selectedBuddyId);

  const selectBuddy = (id: string) => {
    dispatch({ type: 'SET_BUDDY', payload: id });
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl">←</Link>
            <h1 className="text-2xl font-bold">Choose Your Buddy</h1>
          </div>
          <Link
            href="/design-buddy"
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all"
          >
            ✏️ Design
          </Link>
        </div>

        {currentBuddy && (
          <div
            className="rounded-2xl p-4 mb-6 border border-white/10 text-center"
            style={{ background: `linear-gradient(135deg, ${currentBuddy.color}20, ${currentBuddy.color}05)` }}
          >
            <BuddyAvatar buddy={currentBuddy} size="lg" className="animate-float" />
            <p className="font-bold text-xl mt-2">{currentBuddy.name}</p>
            <p className="text-sm text-slate-400">{currentBuddy.personality}</p>
            <p className="text-sm mt-2 text-slate-300">{currentBuddy.greeting}</p>
          </div>
        )}

        <h2 className="text-lg font-bold mb-3 text-purple-400">🌟 Preset Buddies</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {BUDDIES.map(buddy => (
            <button
              key={buddy.id}
              onClick={() => selectBuddy(buddy.id)}
              className={`rounded-2xl p-4 border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                buddy.id === progress.selectedBuddyId
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <BuddyAvatar buddy={buddy} size="md" className="block mb-2" />
              <p className="font-bold">{buddy.name}</p>
              <p className="text-xs text-slate-400 mt-1">{buddy.personality}</p>
            </button>
          ))}
        </div>

        {customBuddies.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-3 text-pink-400">🎨 Your Custom Buddies</h2>
            <div className="grid grid-cols-2 gap-3">
              {customBuddies.map(buddy => (
                <div
                  key={buddy.id}
                  className={`rounded-2xl p-4 border text-left transition-all relative ${
                    buddy.id === progress.selectedBuddyId
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <button
                    onClick={() => selectBuddy(buddy.id)}
                    className="w-full text-left"
                  >
                    <BuddyAvatar buddy={buddy} size="md" className="block mb-2" />
                    <p className="font-bold">{buddy.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{buddy.personality}</p>
                  </button>
                  <button
                    onClick={() => {
                      if (progress.selectedBuddyId === buddy.id) {
                        dispatch({ type: 'SET_BUDDY', payload: '' });
                      }
                      removeCustomBuddy(buddy.id);
                    }}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm bg-red-400/10 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <Link
          href="/design-buddy"
          className="block mt-6 text-center bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all"
        >
          <span className="text-4xl block mb-2">✨</span>
          <p className="font-bold">Design Your Own Buddy</p>
          <p className="text-xs text-slate-400 mt-1">Create a unique buddy with your own personality!</p>
        </Link>
      </div>
    </div>
  );
}
