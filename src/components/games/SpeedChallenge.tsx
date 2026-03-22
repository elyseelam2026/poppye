'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Subject, Grade, Question } from '@/lib/types';
import { useAIContent } from '@/lib/use-ai-content';
import { useProgress } from '@/lib/progress-context';
import { SUBJECTS } from '@/lib/constants';
import GameResultComponent from '@/components/GameResult';
import { BuddyBubble } from '@/components/BuddyBubble';

interface SpeedChallengeProps {
  subject: Subject;
  grade: Grade;
}

export default function SpeedChallenge({ subject, grade }: SpeedChallengeProps) {
  const { getQuestions } = useAIContent(subject, grade);
  const { dispatch } = useProgress();
  const subjectInfo = SUBJECTS.find(s => s.id === subject);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuestions(getQuestions(10));
  }, []);

  useEffect(() => {
    if (questions.length === 0 || gameComplete) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [questions, gameComplete]);

  useEffect(() => {
    if (timeLeft === 0 && !gameComplete) {
      finishGame();
    }
  }, [timeLeft]);

  const finishGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    dispatch({
      type: 'RECORD_GAME',
      payload: {
        gameType: 'speed-challenge',
        subject,
        grade,
        score,
        totalQuestions: Math.max(currentIndex, 1),
        timeTaken,
        date: new Date().toISOString(),
      },
    });
    setGameComplete(true);
  }, [score, currentIndex, startTime, dispatch, subject, grade]);

  const handleAnswer = useCallback((index: number) => {
    const isCorrect = index === questions[currentIndex].correctIndex;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishGame();
    }
  }, [currentIndex, questions, finishGame]);

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  if (gameComplete) {
    return (
      <GameResultComponent
        result={{
          gameType: 'speed-challenge',
          subject,
          grade,
          score,
          totalQuestions: Math.max(currentIndex, 1),
          timeTaken: 60 - timeLeft,
          date: new Date().toISOString(),
        }}
        onPlayAgain={() => {
          setQuestions(getQuestions(10));
          setCurrentIndex(0);
          setScore(0);
          setTimeLeft(60);
          setGameComplete(false);
        }}
      />
    );
  }

  const question = questions[currentIndex];
  const urgency = timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subjectInfo?.icon}</span>
            <span className="font-bold">{subjectInfo?.name}</span>
          </div>
          <div className={`text-2xl font-bold ${urgency}`}>
            ⏱️ {timeLeft}s
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
          <span>Question {currentIndex + 1}</span>
          <span>Score: {score}</span>
        </div>

        <BuddyBubble mood="asking" size="sm" subject={subject} />

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-bold text-center">{question.question}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="p-4 rounded-xl text-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}