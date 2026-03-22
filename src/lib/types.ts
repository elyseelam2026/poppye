export type Subject =
  | 'chinese'
  | 'english'
  | 'maths'
  | 'general-studies'
  | 'science'
  | 'music'
  | 'visual-arts'
  | 'pe'
  | 'computer'
  | 'putonghua'
  | 'religious-studies'
  | 'moral-civic'
  | 'reading'
  | 'stem'
  | 'drama'
  | 'social-studies'
  | 'life-wide-learning';

export type Grade = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

export type GameType = 'quiz-battle' | 'memory-match' | 'word-scramble' | 'speed-challenge' | 'flashcard-flip';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  subject: Subject;
  grade: Grade;
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  subject: Subject;
  grade: Grade;
}

export interface MemoryCard {
  id: string;
  content: string;
  matchId: string;
  type: 'term' | 'definition';
}

export interface ScrambleWord {
  id: string;
  word: string;
  hint: string;
  subject: Subject;
  grade: Grade;
}

export interface PlayerProgress {
  level: number;
  xp: number;
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  subjectScores: Record<Subject, SubjectScore>;
  badges: string[];
  streak: number;
  lastPlayedDate: string;
  selectedBuddyId: string;
}

export interface SubjectScore {
  gamesPlayed: number;
  correctAnswers: number;
  totalQuestions: number;
  bestScore: number;
  lastPlayed: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (progress: PlayerProgress) => boolean;
}

export interface GameResult {
  gameType: GameType;
  subject: Subject;
  grade: Grade;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  date: string;
}

export interface SubjectInfo {
  id: Subject;
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface UploadedMaterial {
  id: string;
  name: string;
  type: 'image' | 'text' | 'pdf';
  content: string;
  subject: Subject;
  grade: Grade;
  uploadedAt: string;
  processed: boolean;
}

export interface AIGeneratedContent {
  id: string;
  materialId: string;
  subject: Subject;
  grade: Grade;
  questions: Question[];
  flashcards: FlashCard[];
  scrambleWords: ScrambleWord[];
  summary: string;
  keyPoints: string[];
  generatedAt: string;
}

export interface RevisionPlan {
  id: string;
  subject: Subject;
  grade: Grade;
  days: RevisionDay[];
  createdAt: string;
}

export interface RevisionDay {
  day: number;
  topic: string;
  activities: string[];
  focusAreas: string[];
}

export interface BuddyCharacter {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  color: string;
  bgGradient: string;
  greeting: string;
  askPhrases: string[];
  correctReactions: string[];
  wrongReactions: string[];
  encouragements: string[];
  isCustom?: boolean;
  customImage?: string;
}