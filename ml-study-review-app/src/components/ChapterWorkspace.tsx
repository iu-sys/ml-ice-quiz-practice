"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Clock, Target } from "lucide-react";
import { getChapterQuiz } from "@/data/course";
import type { Chapter, ChapterMode } from "@/data/types";
import { useStudyProgress } from "@/lib/progress";
import { LearningMode } from "./LearningMode";
import { ModeTabs } from "./ModeTabs";
import { ProgressControls } from "./ProgressControls";
import { QuizRunner } from "./QuizRunner";
import { ReviewCards } from "./ReviewCards";

export function ChapterWorkspace({
  chapter,
  mode,
  children,
}: {
  chapter: Chapter;
  mode: ChapterMode;
  children: React.ReactNode;
}) {
  const { setLastMode } = useStudyProgress();
  const quiz = getChapterQuiz(chapter.slug);

  useEffect(() => {
    setLastMode(chapter.slug, mode);
  }, [chapter.slug, mode, setLastMode]);

  return (
    <div className="space-y-6">
      <header className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div>
          <Link href="/" className="text-sm font-semibold text-red-700 hover:text-red-800">
            Back to dashboard
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-stone-400">
            {chapter.week}
          </p>
          <h2 className="mt-2 text-4xl font-semibold leading-tight text-stone-950">
            {chapter.title}
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-stone-600">{chapter.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600">
              <Clock className="h-4 w-4" /> {chapter.minutes} min
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600">
              <Target className="h-4 w-4" /> {chapter.topics.length} concepts
            </span>
          </div>
        </div>
        <ProgressControls chapter={chapter} />
      </header>

      <ModeTabs slug={chapter.slug} active={mode} />

      {mode === "learn" ? <LearningMode chapter={chapter}>{children}</LearningMode> : null}

      {mode === "review" ? <ReviewCards cards={chapter.cards} /> : null}

      {mode === "exam" ? (
        <section className="grid gap-4">
          {chapter.examPrompts.map((item) => (
            <article key={item.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-red-700">考前速答</p>
              <h3 className="mt-2 text-2xl font-semibold text-stone-950">{item.prompt}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-stone-50 p-4">
                  <p className="text-sm font-semibold text-stone-950">答題骨架</p>
                  <p className="mt-2 text-sm leading-7 text-stone-600">{item.answer}</p>
                </div>
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-800">失分提醒</p>
                  <p className="mt-2 text-sm leading-7 text-red-900">{item.trap}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {mode === "quiz" ? <QuizRunner questions={quiz} chapterSlug={chapter.slug} /> : null}
    </div>
  );
}
