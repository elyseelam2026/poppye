'use client';

import React from 'react';
import Link from 'next/link';
import { useMaterials } from '@/lib/materials-context';
import { SUBJECTS } from '@/lib/constants';

export default function MaterialsPage() {
  const { state, dispatch } = useMaterials();

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-2xl font-bold">My Materials</h1>
        </div>

        {state.materials.length === 0 ? (
          <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
            <span className="text-5xl block mb-4">📚</span>
            <p className="font-bold text-lg mb-2">No materials yet!</p>
            <p className="text-slate-400 mb-4">Upload your study materials to get AI-generated content</p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600"
            >
              Upload Now 📸
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-3 mb-6">
              {state.materials.map(material => {
                const subject = SUBJECTS.find(s => s.id === material.subject);
                const hasContent = state.generatedContent.some(c => c.materialId === material.id);

                return (
                  <div key={material.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{subject?.icon}</span>
                      <span className="font-bold text-sm flex-1">{material.name}</span>
                      <span className="text-xs text-slate-400">{material.grade}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        material.processed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {material.processed ? '✅ Processed' : '⏳ Pending'}
                      </span>
                      {hasContent && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                          🤖 AI Content
                        </span>
                      )}
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_MATERIAL', payload: material.id })}
                        className="ml-auto text-xs text-red-400 hover:text-red-300"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {state.revisionPlans.length > 0 && (
              <>
                <h2 className="text-lg font-bold mb-3">Revision Plans</h2>
                {state.revisionPlans.map(plan => {
                  const subject = SUBJECTS.find(s => s.id === plan.subject);
                  return (
                    <div key={plan.id} className="bg-white/5 rounded-xl p-4 border border-white/10 mb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <span>{subject?.icon}</span>
                        <span className="font-bold">{subject?.name}</span>
                        <span className="text-xs text-slate-400 ml-auto">{plan.grade}</span>
                      </div>
                      {plan.days.map(day => (
                        <div key={day.day} className="bg-white/5 rounded-lg p-3 mb-2">
                          <p className="font-bold text-sm">Day {day.day}: {day.topic}</p>
                          <ul className="text-xs text-slate-400 mt-1">
                            {day.activities.map((a, i) => (
                              <li key={i}>• {a}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
