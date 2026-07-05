"use client";

import Link from "next/link";
import { chapters, quizzes } from "@/data/course";
import { useStudyProgress } from "@/lib/progress";

export function MistakeNotebook() {
  const { getRecord, clearMistake } = useStudyProgress();
  const mistakes = chapters.flatMap((chapter) => {
    const record = getRecord(chapter.slug);
    return record.mistakes.map((id) => ({
      chapter,
      question: quizzes.find((item) => item.id === id),
    }));
  }).filter((item) => item.question);

  return (
    <div className="space-y-5">
      <h2 className="text-4xl font-semibold text-stone-950">Mistake notebook</h2>
      <p className="max-w-2xl text-lg leading-8 text-stone-600">
        錯題不是失敗紀錄，是下次考前最有價值的複習清單。
      </p>
      {mistakes.length === 0 ? (
        <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xl font-semibold text-stone-950">目前沒有錯題</p>
          <p className="mt-2 text-stone-600">完成 quiz 後，答錯的題目會出現在這裡。</p>
          <Link href="/quiz" className="mt-5 inline-block rounded-md bg-red-700 px-4 py-3 text-sm font-semibold text-white">
            Start quiz
          </Link>
        </section>
      ) : (
        <div className="grid gap-3">
          {mistakes.map(({ chapter, question }) => (
            <article key={`${chapter.slug}-${question?.id}`} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-red-700">{chapter.week} · {question?.tag}</p>
              <h3 className="mt-2 text-xl font-semibold leading-snug text-stone-950">{question?.prompt}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{question?.explanation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/chapter/${chapter.slug}?mode=quiz`} className="rounded-md bg-stone-950 px-3 py-2 text-sm font-semibold text-white">
                  Retry chapter
                </Link>
                <button
                  onClick={() => question && clearMistake(chapter.slug, question.id)}
                  className="rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Mark understood
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
