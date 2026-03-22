'use client';

import React, { useState, useEffect } from 'react';
import type { Subject, Grade, MemoryCard } from '@/lib/types';
import { useAIContent } from '@/lib/use-ai-content';
import { useProgress } from '@/lib/progress-context';
import { SUBJECTS } from '@/lib/constants';
import GameResultComponent from '@/components/GameResult';
import { BuddyBubble } from '@/components/BuddyBubble';

interface MemoryMatchProps {
  subject: Subject;
  grade: Grade;
}

export default function MemoryMatch({ subject, grade }: MemoryMatchProps) {
  const { getFlashcards } = useAIContent(subject, grade);
  const { dispatch } = useProgress();
  const subjectInfo = SUBJECTS.find(s => s.id === subject);

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const flashcards = getFlashcards(4);
    const memoryCards: MemoryCard[] = [];
    flashcards.forEach((fc, i) => {
      memoryCards.push({ id: `t-${i}`, content: fc.front, matchId: `pair-${i}`, type: 'term' });
      memoryCards.push({ id: `d-${i}`, content: fc.back, matchId: `pair-${i}`, type: 'definition' });
    });
    // Shuffle
    for (let i = memoryCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [memoryCards[i], memoryCards[j]] = [memoryCards[j], memoryCards[i]];
    }
    setCards(memoryCards);
    setTotalPairs(flashcards.length);
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.has(cards[index].id)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1);
      const [first, second] = newFlipped;
      if (cards[first].matchId === cards[second].matchId) {
        setMatchedIds(prev => new Set([...prev, cards[first].id, cards[second].id]));
        setMatchedPairs(prev => {
          const newPairs = prev + 1;
          if (newPairs === totalPairs) {
            dispatch({
              type: 'RECORD_GAME',
              payload: {
                gameType: 'memory-match',
                subject,
                grade,
                score: totalPairs,
                totalQuestions: totalPairs,
                timeTaken: Math.round((Date.now() - startTime) / 1000),
                date: new Date().toISOString(),
              },
            });
            setTimeout(() => setGameComplete(true), 500);
          }
          return newPairs;
        });
        setTimeout(() => setFlippedIndices([]), 300);
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  if (cards.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  if (gameComplete) {
    return (
      <GameResultComponent
        result={{
          gameType: 'memory-match',
          subject,
          grade,
          score: totalPairs,
          totalQuestions: totalPairs,
          timeTaken: Math.round((Date.now() - startTime) / 1000),
          date: new Date().toISOString(),
        }}
        onPlayAgain={() => {
          const flashcards = getFlashcards(4);
          const memoryCards: MemoryCard[] = [];
          flashcards.forEach((fc, i) => {
            memoryCards.push({ id: `t-${i}`, content: fc.front, matchId: `pair-${i}`, type: 'term' });
            memoryCards.push({ id: `d-${i}`, content: fc.back, matchId: `pair-${i}`, type: 'definition' });
          });
          for (let i = memoryCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [memoryCards[i], memoryCards[j]] = [memoryCards[j], memoryCards[i]];
          }
          setCards(memoryCards);
          setTotalPairs(flashcards.length);
          setFlippedIndices([]);
          setMatchedIds(new Set());
          setAttempts(0);
          setMatchedPairs(0);
          setGameComplete(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subjectInfo?.icon}</span>
            <span className="font-bold">{subjectInfo?.name}</span>
          </div>
          <div className="text-sm text-slate-400">
            Pairs: {matchedPairs}/{totalPairs} | Tries: {attempts}
          </div>
        </div>

        <BuddyBubble mood={matchedPairs > 0 ? 'excited' : 'asking'} size="sm" subject={subject} />

        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index);
            const isMatched = matchedIds.has(card.id);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`min-h-[80px] p-3 rounded-xl border transition-all text-sm ${
                  isMatched
                    ? 'bg-green-500/20 border-green-400/30 text-green-300'
                    : isFlipped
                      ? 'bg-purple-500/20 border-purple-400'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {isFlipped || isMatched ? (
                  <span>{card.content}</span>
                ) : (
                  <span className="text-2xl">❓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}