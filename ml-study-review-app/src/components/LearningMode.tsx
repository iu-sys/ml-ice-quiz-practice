"use client";

import { BookMarked, CheckCircle2, Clock3, Flame, PencilLine, Sparkles } from "lucide-react";
import type { Chapter } from "@/data/types";
import { useStudyProgress } from "@/lib/progress";

export function LearningMode({
  chapter,
  children,
}: {
  chapter: Chapter;
  children: React.ReactNode;
}) {
  const { getRecord, toggleSection } = useStudyProgress();
  const record = getRecord(chapter.slug);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-red-700">Learning path</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-stone-950">
                先建立直覺，再背考點
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">
                每一格只讀一個概念。讀完先回答回想題，再進原始筆記，最後勾 checkpoint。
              </p>
            </div>
            <div className="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
              <p className="font-semibold">建議節奏</p>
              <p className="mt-1">8 分鐘讀 + 2 分鐘回想</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {chapter.learningBlocks.map((block, index) => (
              <article
                key={block.id}
                className="rounded-lg border border-stone-200 bg-[#fbfaf8] p-4 transition hover:border-red-200 hover:bg-red-50/30"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-stone-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-semibold text-stone-950">{block.title}</h4>
                      <span className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2 py-1 text-xs font-medium text-stone-500">
                        <Clock3 className="h-3.5 w-3.5" /> {block.timebox}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-stone-600">{block.takeaway}</p>
                    <div className="mt-3 grid gap-2 lg:grid-cols-2">
                      <div className="rounded-md bg-white p-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                          <Sparkles className="h-3.5 w-3.5" /> Active recall
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-700">{block.recall}</p>
                      </div>
                      <div className="rounded-md bg-white p-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-700">
                          <Flame className="h-3.5 w-3.5" /> Exam signal
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-700">{block.examSignal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <article className="study-prose rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-stone-200 pb-4">
            <BookMarked className="h-5 w-5 text-red-700" />
            <div>
              <p className="text-sm font-semibold text-stone-950">Structured notes</p>
              <p className="text-sm text-stone-500">讀完上面的導讀卡，再用這裡補細節。</p>
            </div>
          </div>
          {children}
        </article>
      </div>

      <aside className="space-y-4">
        <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-stone-950">本章學完要會</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-stone-600">
            {chapter.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-red-800">
            <PencilLine className="h-4 w-4" /> 20 秒停頓題
          </p>
          <p className="mt-2 text-sm leading-6 text-red-900">
            每讀完一張導讀卡，先不要往下滑。用自己的話講一次，再勾一個 checkpoint。
          </p>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-stone-950">Checkpoint</p>
          <div className="mt-3 space-y-2">
            {chapter.checkpoints.map((checkpoint) => {
              const checked = record.completedSections.includes(checkpoint);
              return (
                <button
                  key={checkpoint}
                  onClick={() => toggleSection(chapter.slug, checkpoint)}
                  className={`flex w-full items-start gap-2 rounded-md border px-3 py-3 text-left text-sm leading-6 transition ${
                    checked
                      ? "border-teal-200 bg-teal-50 text-teal-900"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${checked ? "text-teal-600" : "text-stone-300"}`} />
                  <span>{checkpoint}</span>
                </button>
              );
            })}
          </div>
        </section>
      </aside>
    </div>
  );
}
