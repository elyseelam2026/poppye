'use client';

import React from 'react';
import type { BuddyCharacter } from '@/lib/types';

interface BuddyAvatarProps {
  buddy: BuddyCharacter;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { text: 'text-2xl', img: 'w-8 h-8' },
  md: { text: 'text-4xl', img: 'w-12 h-12' },
  lg: { text: 'text-6xl', img: 'w-16 h-16' },
  xl: { text: 'text-7xl', img: 'w-20 h-20' },
};

export default function BuddyAvatar({ buddy, size = 'md', className = '' }: BuddyAvatarProps) {
  const s = sizeMap[size];

  if (buddy.customImage) {
    return (
      <img
        src={buddy.customImage}
        alt={buddy.name}
        className={`${s.img} rounded-full object-cover inline-block ${className}`}
      />
    );
  }

  return (
    <span className={`${s.text} inline-block ${className}`}>{buddy.emoji}</span>
  );
}
