"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ChapterMode, MasteryStatus, ProgressMap, ProgressRecord } from "@/data/types";

const STORAGE_KEY = "ml-study-progress-v1";
const CHANGE_EVENT = "ml-study-progress-change";
const serverSnapshot: ProgressMap = {};
let cachedValue = "";
let cachedProgress: ProgressMap = {};

export const defaultRecord: ProgressRecord = {
  mastery: "not-learned",
  completedSections: [],
  quizCorrect: 0,
  quizTotal: 0,
  mistakes: [],
};

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return serverSnapshot;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY) ?? "";
    if (value === cachedValue) return cachedProgress;
    cachedValue = value;
    cachedProgress = value ? (JSON.parse(value) as ProgressMap) : {};
    return cachedProgress;
  } catch {
    return {};
  }
}

function writeProgress(progress: ProgressMap) {
  cachedProgress = progress;
  cachedValue = JSON.stringify(progress);
  window.localStorage.setItem(STORAGE_KEY, cachedValue);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function updateProgress(updater: (current: ProgressMap) => ProgressMap) {
  writeProgress(updater(readProgress()));
}

export function useStudyProgress() {
  const progress = useSyncExternalStore(subscribe, readProgress, () => serverSnapshot);

  const getRecord = useCallback((slug: string): ProgressRecord => progress[slug] ?? defaultRecord, [progress]);

  const setMastery = useCallback((slug: string, mastery: MasteryStatus) => {
    updateProgress((current) => ({
      ...current,
      [slug]: {
        ...(current[slug] ?? defaultRecord),
        mastery,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const toggleSection = useCallback((slug: string, section: string) => {
    updateProgress((current) => {
      const record = current[slug] ?? defaultRecord;
      const exists = record.completedSections.includes(section);
      return {
        ...current,
        [slug]: {
          ...record,
          completedSections: exists
            ? record.completedSections.filter((item) => item !== section)
            : [...record.completedSections, section],
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const setLastMode = useCallback((slug: string, mode: ChapterMode) => {
    updateProgress((current) => {
      const record = current[slug] ?? defaultRecord;
      if (record.lastMode === mode) return current;
      return {
        ...current,
        [slug]: {
          ...record,
          lastMode: mode,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const recordQuiz = useCallback((slug: string, correct: number, total: number, mistakes: string[]) => {
    updateProgress((current) => {
      const record = current[slug] ?? defaultRecord;
      return {
        ...current,
        [slug]: {
          ...record,
          quizCorrect: correct,
          quizTotal: total,
          mistakes: Array.from(new Set([...record.mistakes, ...mistakes])),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const clearMistake = useCallback((slug: string, questionId: string) => {
    updateProgress((current) => {
      const record = current[slug] ?? defaultRecord;
      return {
        ...current,
        [slug]: {
          ...record,
          mistakes: record.mistakes.filter((id) => id !== questionId),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const reset = useCallback(() => {
    writeProgress({});
  }, []);

  return {
    progress,
    getRecord,
    setMastery,
    toggleSection,
    setLastMode,
    recordQuiz,
    clearMistake,
    reset,
  };
}
