"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { chapters, quizzes } from "@/data/course";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalized) return [];
    const chapterHits = chapters
      .filter((chapter) =>
        [chapter.week, chapter.title, chapter.subtitle, ...chapter.topics, ...chapter.outcomes]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .map((chapter) => ({
        id: chapter.slug,
        href: `/chapter/${chapter.slug}`,
        type: "Chapter",
        title: `${chapter.week}: ${chapter.title}`,
        body: chapter.subtitle,
      }));
    const quizHits = quizzes
      .filter((question) =>
        [question.prompt, question.answer, question.explanation, question.tag]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .map((question) => {
        const chapter = chapters.find((item) => item.slug === question.chapterSlug);
        return {
          id: question.id,
          href: `/chapter/${question.chapterSlug}?mode=quiz`,
          type: "Quiz",
          title: question.prompt,
          body: `${chapter?.week ?? ""} · ${question.explanation}`,
        };
      });
    return [...chapterHits, ...quizHits];
  }, [normalized]);

  return (
    <div className="space-y-5">
      <h2 className="text-4xl font-semibold text-stone-950">Search notes</h2>
      <p className="max-w-2xl text-lg leading-8 text-stone-600">
        搜尋章節、概念、考題提示與 quiz 解釋。試試 K-Means、Silhouette、尺度、離群值。
      </p>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-14 w-full rounded-lg border border-stone-200 bg-white px-4 text-lg outline-none focus:border-red-400"
        placeholder="Search concepts..."
      />
      <div className="grid gap-3">
        {results.map((result) => (
          <Link key={result.id} href={result.href} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-red-200">
            <p className="text-sm font-semibold text-red-700">{result.type}</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-950">{result.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{result.body}</p>
          </Link>
        ))}
        {normalized && results.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
            沒找到結果。換個關鍵字試試。
          </div>
        ) : null}
      </div>
    </div>
  );
}
