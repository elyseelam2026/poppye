'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { useMaterials } from '@/lib/materials-context';
import { GAMES, BUDDIES } from '@/lib/constants';
import BuddyAvatar from '@/components/BuddyAvatar';

export default function Home() {
  const { progress, customBuddies } = useProgress();
  const { state } = useMaterials();
  const selectedBuddy = [...BUDDIES, ...customBuddies].find(b => b.id === progress.selectedBuddyId);

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Poppye&apos;s Revision
          </h1>
          <p className="text-slate-400 mt-1">Fun learning for P1-P6! 🎮</p>
        </div>

        {/* Buddy greeting */}
        {selectedBuddy ? (
          <div
            className={`bg-gradient-to-r ${selectedBuddy.bgGradient} bg-opacity-20 rounded-2xl p-4 mb-6 border border-white/10`}
            style={{ background: `linear-gradient(135deg, ${selectedBuddy.color}15, ${selectedBuddy.color}05)` }}
          >
            <div className="flex items-center gap-3">
              <BuddyAvatar buddy={selectedBuddy} size="md" className="animate-float" />
              <div>
                <p className="font-bold text-lg">{selectedBuddy.name}</p>
                <p className="text-sm text-slate-300">{selectedBuddy.greeting}</p>
              </div>
            </div>
          </div>
        ) : (
          <Link href="/buddy" className="block bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 mb-6 border border-purple-400/30 text-center hover:border-purple-400/60 transition-all">
            <span className="text-3xl">🤗</span>
            <p className="font-bold mt-1">Choose Your Learning Buddy!</p>
            <p className="text-sm text-slate-400">Pick a friend to learn with</p>
          </Link>
        )}

        {/* Upload CTA */}
        <Link href="/upload" className="block bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 rounded-2xl p-4 mb-6 border border-indigo-400/30 hover:border-indigo-400/60 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📸</span>
            <div>
              <p className="font-bold">Upload Study Materials</p>
              <p className="text-sm text-slate-400">
                Photos of textbooks, notes, or exercises → AI generates quizzes!
              </p>
            </div>
          </div>
        </Link>

        {/* AI content stats */}
        {state.generatedContent.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-3 mb-6 border border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">🤖 AI Content Ready</span>
              <span className="text-emerald-400 font-bold">{state.generatedContent.length} sets</span>
            </div>
          </div>
        )}

        {/* Level & XP */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">Level {progress.level}</span>
            <span className="text-sm text-yellow-400">⭐ {progress.xp} XP</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all"
              style={{ width: `${(progress.xp % 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>🎮 {progress.totalGamesPlayed} games</span>
            <span>🔥 {progress.streak} day streak</span>
            <span>🏅 {progress.badges.length} badges</span>
          </div>
        </div>

        {/* Games */}
        <h2 className="text-xl font-bold mb-3">Play & Learn 🎮</h2>
        <div className="grid grid-cols-1 gap-3 mb-6">
          {GAMES.map(game => (
            <Link
              key={game.id}
              href={`/play/${game.id}`}
              className={`bg-gradient-to-r ${game.gradient} rounded-2xl p-4 hover:scale-[1.02] active:scale-[0.98] transition-all`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{game.icon}</span>
                <div>
                  <p className="font-bold text-lg">{game.name}</p>
                  <p className="text-sm text-white/70">{game.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          <Link href="/buddy" className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-all">
            {selectedBuddy ? (
              <BuddyAvatar buddy={selectedBuddy} size="sm" />
            ) : (
              <span className="text-xl">🤗</span>
            )}
            <p className="text-xs mt-1 text-slate-400">Buddy</p>
          </Link>
          <Link href="/upload" className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-all">
            <span className="text-xl">📸</span>
            <p className="text-xs mt-1 text-slate-400">Upload</p>
          </Link>
          <Link href="/materials" className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-all">
            <span className="text-xl">📚</span>
            <p className="text-xs mt-1 text-slate-400">Materials</p>
          </Link>
          <Link href="/progress" className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-all">
            <span className="text-xl">📊</span>
            <p className="text-xs mt-1 text-slate-400">Progress</p>
          </Link>
          <Link href="/badges" className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-all">
            <span className="text-xl">🏅</span>
            <p className="text-xs mt-1 text-slate-400">Badges</p>
          </Link>
          <Link href="/settings" className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-all">
            <span className="text-xl">⚙️</span>
            <p className="text-xs mt-1 text-slate-400">Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
