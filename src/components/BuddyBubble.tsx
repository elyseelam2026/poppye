'use client';

import React, { useState, useEffect } from 'react';
import { useProgress } from '@/lib/progress-context';
import { BUDDIES } from '@/lib/constants';
import BuddyAvatar from '@/components/BuddyAvatar';
import type { BuddyCharacter, Subject } from '@/lib/types';

type MoodType = 'asking' | 'correct' | 'wrong' | 'neutral' | 'excited';

const LANGUAGE_PHRASES: Record<string, Record<MoodType, string[]>> = {
  chinese: {
    asking: [
      '嗯，想一想這道題... 🤔',
      '來試試這道題吧！📝',
      '準備好了嗎？看看這個！💪',
      '我覺得你一定會的！看看：',
      '挑戰一下吧！加油！',
    ],
    correct: [
      '太厲害了！答對了！🎉',
      '好棒啊！完全正確！✨',
      '你真聰明！🌟',
      '答對了！繼續加油！💯',
      '太了不起了！👏',
    ],
    wrong: [
      '沒關係，下次一定行！💕',
      '差一點點！再試試吧！💪',
      '不要灰心，學習就會進步的！🌱',
      '有時候錯了才能學到更多！🧠',
    ],
    neutral: [
      '嗨！今天一起學中文吧！📝',
      '你好！準備好學習了嗎？✨',
    ],
    excited: [
      '你做得很好！繼續加油！🌟',
      '我為你感到驕傲！💕',
      '學習好開心啊！✨',
      '你每天都在進步！📈',
    ],
  },
  putonghua: {
    asking: [
      '嗯，想想看這道題... 🤔',
      '來試一試吧！🗣️',
      '準備好了嗎？來看看！💪',
      '這道題很有趣喔！',
      '挑戰一下吧！你行的！',
    ],
    correct: [
      '真棒！回答正確！🎉',
      '太好了！你答對了！✨',
      '你好聰明喔！🌟',
      '完全正確！繼續努力！💯',
      '了不起！👏',
    ],
    wrong: [
      '沒關係，再試一次！💕',
      '差一點點！加油喔！💪',
      '別灰心，一起慢慢來！🌱',
      '錯了也沒關係，學到就好！🧠',
    ],
    neutral: [
      '你好！今天一起練習普通話吧！🗣️',
      '嗨！普通話時間到了！✨',
    ],
    excited: [
      '做得真好！繼續加油！🌟',
      '我真為你驕傲！💕',
      '學習真開心！✨',
      '你越來越棒了！📈',
    ],
  },
};

interface BuddyBubbleProps {
  message?: string;
  mood?: MoodType;
  size?: 'sm' | 'md' | 'lg';
  subject?: Subject;
}

export function BuddyBubble({ message, mood = 'neutral', size = 'md', subject }: BuddyBubbleProps) {
  const { progress, customBuddies } = useProgress();
  const [displayMessage, setDisplayMessage] = useState('');
  const buddy = [...BUDDIES, ...customBuddies].find(b => b.id === progress.selectedBuddyId);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      return;
    }
    if (!buddy) return;

    // Use language-specific phrases for language subjects
    const langPhrases = subject ? LANGUAGE_PHRASES[subject] : undefined;
    if (langPhrases) {
      const phrases = langPhrases[mood];
      setDisplayMessage(phrases[Math.floor(Math.random() * phrases.length)]);
      return;
    }

    let phrases: string[];
    switch (mood) {
      case 'asking':
        phrases = buddy.askPhrases;
        break;
      case 'correct':
        phrases = buddy.correctReactions;
        break;
      case 'wrong':
        phrases = buddy.wrongReactions;
        break;
      case 'excited':
        phrases = buddy.encouragements;
        break;
      default:
        phrases = [buddy.greeting];
    }
    setDisplayMessage(phrases[Math.floor(Math.random() * phrases.length)]);
  }, [message, mood, buddy, subject]);

  if (!buddy) return null;

  const bubbleSizeClasses = {
    sm: 'text-xs max-w-48',
    md: 'text-sm max-w-64',
    lg: 'text-base max-w-80',
  };

  const moodAnimations = {
    asking: 'animate-float',
    correct: 'animate-bounce-in',
    wrong: 'animate-shake',
    neutral: '',
    excited: 'animate-bounce-in',
  };

  return (
    <div className="flex items-start gap-3 mb-3">
      <div className={`${moodAnimations[mood]} flex-shrink-0`}>
        <BuddyAvatar buddy={buddy} size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} />
      </div>
      {displayMessage && (
        <div
          className={`${bubbleSizeClasses[size]} bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-sm px-3 py-2 border border-white/20`}
          style={{ borderColor: `${buddy.color}40` }}
        >
          <p className="text-slate-200 leading-snug">{displayMessage}</p>
          <p className="text-[10px] mt-1 opacity-60">{buddy.name}</p>
        </div>
      )}
    </div>
  );
}

interface BuddyReactionProps {
  isCorrect: boolean;
  subject?: Subject;
}

export function BuddyReaction({ isCorrect, subject }: BuddyReactionProps) {
  return (
    <BuddyBubble
      mood={isCorrect ? 'correct' : 'wrong'}
      size="sm"
      subject={subject}
    />
  );
}

export function useBuddy(): BuddyCharacter | null {
  const { progress, customBuddies } = useProgress();
  return [...BUDDIES, ...customBuddies].find(b => b.id === progress.selectedBuddyId) || null;
}
