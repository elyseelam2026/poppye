'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Subject, Grade, ScrambleWord } from '@/lib/types';
import { useAIContent } from '@/lib/use-ai-content';
import { useProgress } from '@/lib/progress-context';
import { SUBJECTS } from '@/lib/constants';
import GameResultComponent from '@/components/GameResult';
import { BuddyBubble, BuddyReaction } from '@/components/BuddyBubble';

interface WordScrambleProps {
  subject: Subject;
  grade: Grade;
}

function scrambleLetters(word: string): string[] {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  // Make sure it's actually scrambled
  if (letters.join('') === word && word.length > 1) {
    [letters[0], letters[1]] = [letters[1], letters[0]];
  }
  return letters;
}

export default function WordScramble({ subject, grade }: WordScrambleProps) {
  const { getScrambleWords } = useAIContent(subject, grade);
  const { dispatch } = useProgress();
  const subjectInfo = SUBJECTS.find(s => s.id === subject);

  const [words, setWords] = useState<ScrambleWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const w = getScrambleWords(4);
    setWords(w);
    if (w.length > 0) setScrambled(scrambleLetters(w[0].word));
  }, []);

  const handleLetterClick = useCallback((letter: string, idx: number) => {
    if (showResult) return;
    const newScrambled = [...scrambled];
    newScrambled.splice(idx, 1);
    setScrambled(newScrambled);
    const newAnswer = [...userAnswer, letter];
    setUserAnswer(newAnswer);

    // Check if word is complete
    if (newAnswer.length === words[currentIndex].word.length) {
      const isCorrect = newAnswer.join('') === words[currentIndex].word;
      setLastCorrect(isCorrect);
      if (isCorrect) setScore(prev => prev + 1);
      setShowResult(true);

      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setScrambled(scrambleLetters(words[currentIndex + 1].word));
          setUserAnswer([]);
          setShowResult(false);
          setLastCorrect(null);
        } else {
          const timeTaken = Math.round((Date.now() - startTime) / 1000);
          dispatch({
            type: 'RECORD_GAME',
            payload: {
              gameType: 'word-scramble',
              subject,
              grade,
              score: isCorrect ? score + 1 : score,
              totalQuestions: words.length,
              timeTaken,
              date: new Date().toISOString(),
            },
          });
          setGameComplete(true);
        }
      }, 1500);
    }
  }, [scrambled, userAnswer, showResult, currentIndex, words, score, startTime, dispatch, subject, grade]);

  const handleUndo = () => {
    if (userAnswer.length === 0 || showResult) return;
    const lastLetter = userAnswer[userAnswer.length - 1];
    setUserAnswer(userAnswer.slice(0, -1));
    setScrambled([...scrambled, lastLetter]);
  };

  if (words.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  if (gameComplete) {
    return (
      <GameResultComponent
        result={{
          gameType: 'word-scramble',
          subject,
          grade,
          score,
          totalQuestions: words.length,
          timeTaken: Math.round((Date.now() - startTime) / 1000),
          date: new Date().toISOString(),
        }}
        onPlayAgain={() => {
          const w = getScrambleWords(4);
          setWords(w);
          if (w.length > 0) setScrambled(scrambleLetters(w[0].word));
          setCurrentIndex(0);
          setUserAnswer([]);
          setScore(0);
          setShowResult(false);
          setLastCorrect(null);
          setGameComplete(false);
        }}
      />
    );
  }

  const word = words[currentIndex];

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subjectInfo?.icon}</span>
            <span className="font-bold">{subjectInfo?.name}</span>
          </div>
          <div className="text-sm text-slate-400">
            {currentIndex + 1} / {words.length}
          </div>
        </div>

        <BuddyBubble mood="asking" size="sm" subject={subject} />

        {lastCorrect !== null && showResult && (
          <BuddyReaction isCorrect={lastCorrect} subject={subject} />
        )}

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10 text-center">
          <p className="text-sm text-slate-400 mb-1">💡 Hint</p>
          <p className="text-lg">{word.hint}</p>
        </div>

        {/* Answer slots */}
        <div className="flex justify-center gap-2 mb-6">
          {word.word.split('').map((_, i) => (
            <div
              key={i}
              className={`w-10 h-12 rounded-lg flex items-center justify-center text-xl font-bold border-2 transition-all ${
                userAnswer[i]
                  ? showResult
                    ? lastCorrect ? 'border-green-400 bg-green-500/20' : 'border-red-400 bg-red-500/20'
                    : 'border-purple-400 bg-purple-500/20'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              {userAnswer[i] || ''}
            </div>
          ))}
        </div>

        {/* Scrambled letters */}
        <div className="flex justify-center gap-2 flex-wrap mb-4">
          {scrambled.map((letter, idx) => (
            <button
              key={idx}
              onClick={() => handleLetterClick(letter, idx)}
              disabled={showResult}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/30 border border-amber-400/30 text-xl font-bold hover:scale-110 active:scale-95 transition-all"
            >
              {letter}
            </button>
          ))}
        </div>

        {userAnswer.length > 0 && !showResult && (
          <div className="text-center">
            <button onClick={handleUndo} className="text-sm text-slate-400 hover:text-white">
              ↩️ Undo
            </button>
          </div>
        )}

        {showResult && !lastCorrect && (
          <div className="text-center mt-4 animate-slide-up">
            <p className="text-yellow-400">The answer was: <strong>{word.word}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}