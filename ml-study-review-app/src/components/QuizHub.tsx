"use client";

import Link from "next/link";
import { chapters } from "@/data/course";
import { useStudyProgress } from "@/lib/progress";

export function QuizHub() {
  const { getRecord } = useStudyProgress();

  return (
    <div className="space-y-5">
      <h2 className="text-4xl font-semibold text-stone-950">Quiz / active recall</h2>
      <p className="max-w-2xl text-lg leading-8 text-stone-600">
        用題目逼自己輸出。答錯會自動進入 mistake notebook。
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {chapters.map((chapter) => {
          const record = getRecord(chapter.slug);
          return (
            <Link
              key={chapter.slug}
              href={`/chapter/${chapter.slug}?mode=quiz`}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-red-200"
            >
              <p className="text-sm font-semibold text-red-700">{chapter.week}</p>
              <h3 className="mt-2 text-2xl font-semibold text-stone-950">{chapter.title}</h3>
              <p className="mt-3 text-sm text-stone-600">
                Last score: {record.quizTotal ? `${record.quizCorrect}/${record.quizTotal}` : "not attempted"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
