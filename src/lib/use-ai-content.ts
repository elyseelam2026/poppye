'use client';

import { useMaterials } from './materials-context';
import type { Subject, Grade, Question, FlashCard, ScrambleWord } from './types';

const SAMPLE_QUESTIONS: Record<string, Question[]> = {
  'maths': [
    { id: 'sq1', question: 'What is 7 × 8?', options: ['54', '56', '58', '64'], correctIndex: 1, subject: 'maths', grade: 'P3', explanation: '7 × 8 = 56' },
    { id: 'sq2', question: 'What is 125 + 376?', options: ['491', '501', '511', '401'], correctIndex: 1, subject: 'maths', grade: 'P3', explanation: '125 + 376 = 501' },
    { id: 'sq3', question: 'What is 1/4 of 100?', options: ['20', '25', '30', '50'], correctIndex: 1, subject: 'maths', grade: 'P3', explanation: '100 ÷ 4 = 25' },
    { id: 'sq4', question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctIndex: 1, subject: 'maths', grade: 'P3', explanation: 'A hexagon has 6 sides' },
    { id: 'sq5', question: 'What is 9 × 9?', options: ['72', '81', '90', '99'], correctIndex: 1, subject: 'maths', grade: 'P3', explanation: '9 × 9 = 81' },
  ],
  'english': [
    { id: 'se1', question: 'Which word is a noun?', options: ['quickly', 'beautiful', 'happiness', 'run'], correctIndex: 2, subject: 'english', grade: 'P3', explanation: '"Happiness" is a noun (a thing/feeling)' },
    { id: 'se2', question: 'What is the past tense of "go"?', options: ['goed', 'went', 'gone', 'going'], correctIndex: 1, subject: 'english', grade: 'P3', explanation: 'Go → went (irregular verb)' },
    { id: 'se3', question: 'Choose the correct sentence:', options: ['She are happy.', 'She is happy.', 'She am happy.', 'She be happy.'], correctIndex: 1, subject: 'english', grade: 'P3' },
    { id: 'se4', question: 'What is the plural of "child"?', options: ['childs', 'childen', 'children', 'childes'], correctIndex: 2, subject: 'english', grade: 'P3' },
    { id: 'se5', question: 'Which word means "very big"?', options: ['tiny', 'enormous', 'small', 'narrow'], correctIndex: 1, subject: 'english', grade: 'P3' },
  ],
  'chinese': [
    { id: 'sc1', question: '「日」字有多少畫？', options: ['3畫', '4畫', '5畫', '6畫'], correctIndex: 1, subject: 'chinese', grade: 'P3', explanation: '「日」字共有4畫' },
    { id: 'sc2', question: '以下哪個是量詞？', options: ['跑', '一條', '美麗', '因為'], correctIndex: 1, subject: 'chinese', grade: 'P3' },
    { id: 'sc3', question: '「花」的部首是什麼？', options: ['亻', '艹', '木', '口'], correctIndex: 1, subject: 'chinese', grade: 'P3', explanation: '「花」的部首是「艹」(草字頭)' },
    { id: 'sc4', question: '以下哪個詞語形容天氣？', options: ['開心', '晴朗', '努力', '聰明'], correctIndex: 1, subject: 'chinese', grade: 'P3' },
    { id: 'sc5', question: '「我喜歡吃蘋果。」中的動詞是？', options: ['我', '喜歡', '吃', '蘋果'], correctIndex: 2, subject: 'chinese', grade: 'P3' },
  ],
  'general-studies': [
    { id: 'sg1', question: 'What is the capital of China?', options: ['Shanghai', 'Beijing', 'Guangzhou', 'Hong Kong'], correctIndex: 1, subject: 'general-studies', grade: 'P3' },
    { id: 'sg2', question: 'How many days are in a leap year?', options: ['364', '365', '366', '367'], correctIndex: 2, subject: 'general-studies', grade: 'P3' },
    { id: 'sg3', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correctIndex: 1, subject: 'general-studies', grade: 'P3' },
    { id: 'sg4', question: 'What do plants need to make food?', options: ['Darkness', 'Sunlight', 'Cold', 'Wind'], correctIndex: 1, subject: 'general-studies', grade: 'P3' },
    { id: 'sg5', question: 'Hong Kong is a SAR of which country?', options: ['Japan', 'USA', 'China', 'UK'], correctIndex: 2, subject: 'general-studies', grade: 'P3' },
  ],
  'science': [
    { id: 'ss1', question: 'What is H₂O?', options: ['Oxygen', 'Hydrogen', 'Water', 'Carbon dioxide'], correctIndex: 2, subject: 'science', grade: 'P3' },
    { id: 'ss2', question: 'Which force pulls things down?', options: ['Friction', 'Gravity', 'Magnetism', 'Wind'], correctIndex: 1, subject: 'science', grade: 'P3' },
    { id: 'ss3', question: 'What do we call a baby frog?', options: ['Cub', 'Tadpole', 'Puppy', 'Kitten'], correctIndex: 1, subject: 'science', grade: 'P3' },
    { id: 'ss4', question: 'Which is a renewable energy source?', options: ['Coal', 'Oil', 'Solar', 'Gas'], correctIndex: 2, subject: 'science', grade: 'P3' },
    { id: 'ss5', question: 'How many bones does an adult human have?', options: ['106', '206', '306', '406'], correctIndex: 1, subject: 'science', grade: 'P3' },
  ],
};

const SAMPLE_FLASHCARDS: Record<string, FlashCard[]> = {
  'english': [
    { id: 'f1', front: 'Noun', back: 'A word that names a person, place, thing, or idea. E.g.: dog, school, happiness', subject: 'english', grade: 'P3' },
    { id: 'f2', front: 'Verb', back: 'A word that shows action or state of being. E.g.: run, eat, is', subject: 'english', grade: 'P3' },
    { id: 'f3', front: 'Adjective', back: 'A word that describes a noun. E.g.: big, beautiful, red', subject: 'english', grade: 'P3' },
    { id: 'f4', front: 'Synonym', back: 'A word that has the same or similar meaning as another word. E.g.: big = large', subject: 'english', grade: 'P3' },
  ],
  'maths': [
    { id: 'fm1', front: 'Perimeter', back: 'The total length of all sides of a shape added together', subject: 'maths', grade: 'P3' },
    { id: 'fm2', front: 'Fraction', back: 'A part of a whole, written as one number over another (e.g. 1/2)', subject: 'maths', grade: 'P3' },
    { id: 'fm3', front: 'Even Number', back: 'A number that can be divided by 2 with no remainder (e.g. 2, 4, 6)', subject: 'maths', grade: 'P3' },
  ],
  'chinese': [
    { id: 'fc1', front: '部首', back: '漢字的基本組成部分，用來分類和查字典', subject: 'chinese', grade: 'P3' },
    { id: 'fc2', front: '量詞', back: '用來計算事物的詞語，如：一「條」魚、一「本」書', subject: 'chinese', grade: 'P3' },
    { id: 'fc3', front: '成語', back: '四個字組成的固定詞語，如：一心一意', subject: 'chinese', grade: 'P3' },
  ],
};

const SAMPLE_SCRAMBLE: Record<string, ScrambleWord[]> = {
  'english': [
    { id: 'w1', word: 'SCHOOL', hint: 'A place where you learn', subject: 'english', grade: 'P3' },
    { id: 'w2', word: 'TEACHER', hint: 'A person who helps you learn', subject: 'english', grade: 'P3' },
    { id: 'w3', word: 'FRIEND', hint: 'Someone you play with', subject: 'english', grade: 'P3' },
    { id: 'w4', word: 'HAPPY', hint: 'A feeling when you smile', subject: 'english', grade: 'P3' },
  ],
  'science': [
    { id: 'ws1', word: 'GRAVITY', hint: 'The force that pulls things down', subject: 'science', grade: 'P3' },
    { id: 'ws2', word: 'PLANET', hint: 'A large body that orbits a star', subject: 'science', grade: 'P3' },
    { id: 'ws3', word: 'ENERGY', hint: 'The ability to do work', subject: 'science', grade: 'P3' },
  ],
  'maths': [
    { id: 'wm1', word: 'DIVIDE', hint: 'Split into equal parts', subject: 'maths', grade: 'P3' },
    { id: 'wm2', word: 'FRACTION', hint: 'A part of a whole number', subject: 'maths', grade: 'P3' },
  ],
};

export function useAIContent(subject: Subject, grade: Grade) {
  const { state } = useMaterials();

  const aiContent = state.generatedContent.filter(
    c => c.subject === subject && c.grade === grade
  );

  const hasAIContent = aiContent.length > 0;

  function getQuestions(count: number = 5): Question[] {
    const aiQuestions = aiContent.flatMap(c => c.questions);
    const sampleQuestions = SAMPLE_QUESTIONS[subject] || SAMPLE_QUESTIONS['general-studies'] || [];
    const allQuestions = [...aiQuestions, ...sampleQuestions];

    // Shuffle and return requested count
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((q, i) => ({ ...q, id: `q-${i}-${Date.now()}` }));
  }

  function getFlashcards(count: number = 4): FlashCard[] {
    const aiCards = aiContent.flatMap(c => c.flashcards);
    const sampleCards = SAMPLE_FLASHCARDS[subject] || SAMPLE_FLASHCARDS['english'] || [];
    const allCards = [...aiCards, ...sampleCards];

    const shuffled = allCards.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  function getScrambleWords(count: number = 4): ScrambleWord[] {
    const aiWords = aiContent.flatMap(c => c.scrambleWords);
    const sampleWords = SAMPLE_SCRAMBLE[subject] || SAMPLE_SCRAMBLE['english'] || [];
    const allWords = [...aiWords, ...sampleWords];

    const shuffled = allWords.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  return { getQuestions, getFlashcards, getScrambleWords, hasAIContent };
}
