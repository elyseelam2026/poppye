'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Subject, Grade, Question } from '@/lib/types';
import { useAIContent } from '@/lib/use-ai-content';
import { useProgress } from '@/lib/progress-context';
import { SUBJECTS } from '@/lib/constants';
import GameResultComponent from '@/components/GameResult';
import { BuddyBubble, BuddyReaction } from '@/components/BuddyBubble';

interface QuizBattleProps {
  subject: Subject;
  grade: Grade;
}

export default function QuizBattle({ subject, grade }: QuizBattleProps) {
  const { getQuestions } = useAIContent(subject, grade);
  const { dispatch } = useProgress();
  const subjectInfo = SUBJECTS.find(s => s.id === subject);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);

  useEffect(() => {
    setQuestions(getQuestions(5));
  }, []);

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentIndex].correctIndex;
    setLastAnswer(isCorrect);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setLastAnswer(null);
      } else {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        dispatch({
          type: 'RECORD_GAME',
          payload: {
            gameType: 'quiz-battle',
            subject,
            grade,
            score: isCorrect ? score + 1 : score,
            totalQuestions: questions.length,
            timeTaken,
            date: new Date().toISOString(),
          },
        });
        setGameComplete(true);
      }
    }, 2000);
  }, [selectedAnswer, currentIndex, questions, score, startTime, dispatch, subject, grade]);

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading questions...</div>;
  }

  if (gameComplete) {
    return (
      <GameResultComponent
        result={{
          gameType: 'quiz-battle',
          subject,
          grade,
          score,
          totalQuestions: questions.length,
          timeTaken: Math.round((Date.now() - startTime) / 1000),
          date: new Date().toISOString(),
        }}
        onPlayAgain={() => {
          setQuestions(getQuestions(5));
          setCurrentIndex(0);
          setSelectedAnswer(null);
          setScore(0);
          setShowResult(false);
          setGameComplete(false);
          setLastAnswer(null);
        }}
      />
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subjectInfo?.icon}</span>
            <span className="font-bold">{subjectInfo?.name}</span>
          </div>
          <div className="text-sm text-slate-400">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-6">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Buddy */}
        <BuddyBubble mood="asking" size="md" subject={subject} />

        {/* Last answer reaction */}
        {lastAnswer !== null && showResult && (
          <BuddyReaction isCorrect={lastAnswer} subject={subject} />
        )}

        {/* Question */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
          <h2 className="text-xl font-bold text-center">{question.question}</h2>
        </div>

        {/* Options */}
        <div className="grid gap-3">
          {question.options.map((option, index) => {
            let buttonClass = 'bg-white/5 border-white/10 hover:bg-white/10';
            if (showResult) {
              if (index === question.correctIndex) {
                buttonClass = 'bg-green-500/20 border-green-400';
              } else if (index === selectedAnswer && index !== question.correctIndex) {
                buttonClass = 'bg-red-500/20 border-red-400 animate-shake';
              }
            } else if (index === selectedAnswer) {
              buttonClass = 'bg-purple-500/20 border-purple-400';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl text-left border transition-all ${buttonClass}`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{' '}
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && question.explanation && (
          <div className="mt-4 bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 animate-slide-up">
            <p className="text-sm text-blue-300">💡 {question.explanation}</p>
          </div>
        )}

        {/* Score */}
        <div className="mt-6 text-center">
          <span className="text-sm text-slate-400">Score: </span>
          <span className="font-bold text-yellow-400">{score}</span>
          <span className="text-sm text-slate-400"> / {currentIndex + (showResult ? 1 : 0)}</span>
        </div>
      </div>
    </div>
  );
}