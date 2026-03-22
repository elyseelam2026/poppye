'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { PlayerProgress, Subject, SubjectScore, GameResult, BuddyCharacter } from './types';
import { ALL_BADGES, XP_PER_CORRECT, XP_PER_GAME, XP_PER_LEVEL, STREAK_BONUS } from './constants';

const DEFAULT_SUBJECT_SCORE: SubjectScore = {
  gamesPlayed: 0,
  correctAnswers: 0,
  totalQuestions: 0,
  bestScore: 0,
  lastPlayed: '',
};

const DEFAULT_PROGRESS: PlayerProgress = {
  level: 1,
  xp: 0,
  totalGamesPlayed: 0,
  totalCorrectAnswers: 0,
  totalQuestions: 0,
  subjectScores: {} as Record<Subject, SubjectScore>,
  badges: [],
  streak: 0,
  lastPlayedDate: '',
  selectedBuddyId: '',
};

type Action =
  | { type: 'LOAD_PROGRESS'; payload: PlayerProgress }
  | { type: 'RECORD_GAME'; payload: GameResult }
  | { type: 'EARN_BADGE'; payload: string }
  | { type: 'SET_BUDDY'; payload: string }
  | { type: 'RESET_PROGRESS' };

function progressReducer(state: PlayerProgress, action: Action): PlayerProgress {
  switch (action.type) {
    case 'LOAD_PROGRESS':
      return action.payload;

    case 'RECORD_GAME': {
      const { subject, score, totalQuestions } = action.payload;
      const xpGained = (score * XP_PER_CORRECT) + XP_PER_GAME;
      const newXp = state.xp + xpGained;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = state.lastPlayedDate === yesterday
        ? state.streak + 1
        : state.lastPlayedDate === today
          ? state.streak
          : 1;

      const subjectScore = state.subjectScores[subject] || { ...DEFAULT_SUBJECT_SCORE };
      const newSubjectScore: SubjectScore = {
        gamesPlayed: subjectScore.gamesPlayed + 1,
        correctAnswers: subjectScore.correctAnswers + score,
        totalQuestions: subjectScore.totalQuestions + totalQuestions,
        bestScore: Math.max(subjectScore.bestScore, Math.round((score / totalQuestions) * 100)),
        lastPlayed: today,
      };

      const newProgress: PlayerProgress = {
        ...state,
        level: newLevel,
        xp: newXp,
        totalGamesPlayed: state.totalGamesPlayed + 1,
        totalCorrectAnswers: state.totalCorrectAnswers + score,
        totalQuestions: state.totalQuestions + totalQuestions,
        subjectScores: { ...state.subjectScores, [subject]: newSubjectScore },
        streak: newStreak + (newStreak > 0 && newStreak % 3 === 0 ? 0 : 0),
        lastPlayedDate: today,
        selectedBuddyId: state.selectedBuddyId,
      };

      // Add streak bonus XP
      if (newStreak > state.streak && newStreak % 3 === 0) {
        newProgress.xp += STREAK_BONUS;
        newProgress.level = Math.floor(newProgress.xp / XP_PER_LEVEL) + 1;
      }

      // Check badges
      const newBadges = [...newProgress.badges];
      for (const badge of ALL_BADGES) {
        if (!newBadges.includes(badge.id) && badge.requirement(newProgress)) {
          newBadges.push(badge.id);
        }
      }
      // Perfect score badge
      if (score === totalQuestions && !newBadges.includes('perfect-score')) {
        newBadges.push('perfect-score');
      }
      newProgress.badges = newBadges;

      return newProgress;
    }

    case 'EARN_BADGE':
      if (state.badges.includes(action.payload)) return state;
      return { ...state, badges: [...state.badges, action.payload] };

    case 'SET_BUDDY':
      return { ...state, selectedBuddyId: action.payload };

    case 'RESET_PROGRESS':
      return DEFAULT_PROGRESS;

    default:
      return state;
  }
}

const ProgressContext = createContext<{
  progress: PlayerProgress;
  dispatch: React.Dispatch<Action>;
  customBuddies: BuddyCharacter[];
  addCustomBuddy: (buddy: BuddyCharacter) => void;
  removeCustomBuddy: (id: string) => void;
}>({
  progress: DEFAULT_PROGRESS,
  dispatch: () => {},
  customBuddies: [],
  addCustomBuddy: () => {},
  removeCustomBuddy: () => {},
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, dispatch] = useReducer(progressReducer, DEFAULT_PROGRESS);
  const [customBuddies, setCustomBuddies] = React.useState<BuddyCharacter[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('poppye-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_PROGRESS', payload: { ...DEFAULT_PROGRESS, ...parsed } });
      } catch {
        // ignore corrupt data
      }
    }
    const savedBuddies = localStorage.getItem('poppye-custom-buddies');
    if (savedBuddies) {
      try {
        setCustomBuddies(JSON.parse(savedBuddies));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('poppye-progress', JSON.stringify(progress));
  }, [progress]);

  const addCustomBuddy = React.useCallback((buddy: BuddyCharacter) => {
    setCustomBuddies(prev => {
      const updated = [...prev, { ...buddy, isCustom: true }];
      localStorage.setItem('poppye-custom-buddies', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeCustomBuddy = React.useCallback((id: string) => {
    setCustomBuddies(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem('poppye-custom-buddies', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <ProgressContext.Provider value={{ progress, dispatch, customBuddies, addCustomBuddy, removeCustomBuddy }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}