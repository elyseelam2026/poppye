'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { useMaterials } from '@/lib/materials-context';

export default function SettingsPage() {
  const { progress, dispatch } = useProgress();
  const { state, dispatch: materialsDispatch } = useMaterials();
  const [apiKey, setApiKey] = useState(state.apiKey);
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    materialsDispatch({ type: 'SET_API_KEY', payload: apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* API Key */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
          <h2 className="font-bold mb-2">🤖 xAI (Grok) API Key</h2>
          <p className="text-xs text-slate-400 mb-3">
            Enter your xAI API key to enable AI-powered content generation.
            Get one at <span className="text-blue-400">console.x.ai</span>
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="xai-..."
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm mb-2 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={handleSaveKey}
            className="w-full py-2 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-sm"
          >
            {saved ? '✅ Saved!' : 'Save Key'}
          </button>
        </div>

        {/* Player stats */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
          <h2 className="font-bold mb-3">📊 Player Stats</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-slate-400">Level</p>
              <p className="font-bold text-lg text-yellow-400">{progress.level}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-slate-400">XP</p>
              <p className="font-bold text-lg">{progress.xp}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-slate-400">Games</p>
              <p className="font-bold text-lg">{progress.totalGamesPlayed}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-slate-400">Badges</p>
              <p className="font-bold text-lg">{progress.badges.length}</p>
            </div>
          </div>
        </div>

        {/* Materials stats */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
          <h2 className="font-bold mb-3">📚 Materials</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-slate-400">Uploaded</p>
              <p className="font-bold text-lg">{state.materials.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-slate-400">AI Content</p>
              <p className="font-bold text-lg text-emerald-400">{state.generatedContent.length}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-3">
          <button
            onClick={() => {
              materialsDispatch({ type: 'CLEAR_ALL' });
            }}
            className="w-full py-3 rounded-xl font-bold bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10"
          >
            Clear All Materials 🗑️
          </button>
          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone!')) {
                dispatch({ type: 'RESET_PROGRESS' });
              }
            }}
            className="w-full py-3 rounded-xl font-bold bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10"
          >
            Reset Progress ⚠️
          </button>
        </div>
      </div>
    </div>
  );
}