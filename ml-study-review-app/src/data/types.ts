export type MasteryStatus =
  | "not-learned"
  | "weak"
  | "okay"
  | "mastered"
  | "review-before-exam";

export type ChapterMode = "learn" | "review" | "exam" | "quiz";

export type StudyCard = {
  id: string;
  front: string;
  back: string;
  tag: string;
};

export type ExamPrompt = {
  id: string;
  prompt: string;
  answer: string;
  trap: string;
};

export type LearningBlock = {
  id: string;
  title: string;
  timebox: string;
  takeaway: string;
  recall: string;
  examSignal: string;
};

export type Chapter = {
  slug: string;
  week: string;
  title: string;
  subtitle: string;
  minutes: number;
  topics: string[];
  outcomes: string[];
  checkpoints: string[];
  learningBlocks: LearningBlock[];
  cards: StudyCard[];
  examPrompts: ExamPrompt[];
};

export type QuizQuestion = {
  id: string;
  type: "single" | "short";
  prompt: string;
  choices?: string[];
  answer: string;
  explanation: string;
  chapterSlug: string;
  tag: string;
};

export type ProgressRecord = {
  mastery: MasteryStatus;
  completedSections: string[];
  quizCorrect: number;
  quizTotal: number;
  mistakes: string[];
  lastMode?: ChapterMode;
  updatedAt?: string;
};

export type ProgressMap = Record<string, ProgressRecord>;
