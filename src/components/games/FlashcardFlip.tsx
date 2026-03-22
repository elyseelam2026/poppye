'use client';

import React, { useState, useEffect } from 'react';
import type { Subject, Grade, FlashCard } from '@/lib/types';
import { useAIContent } from '@/lib/use-ai-content';
import { useProgress } from '@/lib/progress-context';
import { SUBJECTS } from '@/lib/constants';
import { BuddyBubble } from '@/components/BuddyBubble';
import Link from 'next/link';

interface FlashcardFlipProps {
  subject: Subject;
  grade: Grade;
}

export default function FlashcardFlip({ subject, grade }: FlashcardFlipProps) {
  const { getFlashcards } = useAIContent(subject, grade);
  const { dispatch } = useProgress();
  const subjectInfo = SUBJECTS.find(s => s.id === subject);

  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setCards(getFlashcards(6));
  }, []);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setIsFlipped(false);
    setCompleted(prev => prev + 1);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      dispatch({
        type: 'RECORD_GAME',
        payload: {
          gameType: 'flashcard-flip',
          subject,
          grade,
          score: cards.length,
          totalQuestions: cards.length,
          timeTaken: 0,
          date: new Date().toISOString(),
        },
      });
    }
  };

  if (cards.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading cards...</div>;
  }

  const allDone = completed >= cards.length;

  if (allDone) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center p-4">
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">All Cards Reviewed!</h1>
          <p className="text-slate-400 mb-6">You reviewed {cards.length} flashcards</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setCards(getFlashcards(6));
                setCurrentIndex(0);
                setIsFlipped(false);
                setCompleted(0);
              }}
              className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600"
            >
              Study Again 🔄
            </button>
            <Link href="/" className="px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10">
              Home 🏠
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subjectInfo?.icon}</span>
            <span className="font-bold">{subjectInfo?.name}</span>
          </div>
          <div className="text-sm text-slate-400">
            {currentIndex + 1} / {cards.length}
          </div>
        </div>

        <BuddyBubble mood={isFlipped ? 'excited' : 'asking'} size="sm" subject={subject} />

        <div
          onClick={handleFlip}
          className="cursor-pointer mb-6"
        >
          <div className={`bg-gradient-to-br ${isFlipped ? 'from-emerald-600/20 to-teal-700/20' : 'from-purple-600/20 to-indigo-700/20'} backdrop-blur-sm rounded-2xl p-8 min-h-[200px] flex items-center justify-center border border-white/10 transition-all duration-500`}>
            <div className="text-center">
              <p className="text-xs text-slate-400 mb-2">{isFlipped ? 'ANSWER' : 'QUESTION'}</p>
              <p className="text-xl font-bold">{isFlipped ? card.back : card.front}</p>
              {!isFlipped && (
                <p className="text-sm text-slate-400 mt-4">Tap to flip! 👆</p>
              )}
            </div>
          </div>
        </div>

        {isFlipped && (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 transition-all animate-slide-up"
          >
            {currentIndex < cards.length - 1 ? 'Next Card ➡️' : 'Finish ✅'}
          </button>
        )}
      </div>
    </div>
  );
}