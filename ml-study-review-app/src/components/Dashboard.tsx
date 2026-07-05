"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, ClipboardList } from "lucide-react";
import { chapters, masteryLabels, masteryStyles } from "@/data/course";
import { useStudyProgress } from "@/lib/progress";

export function Dashboard() {
  const { getRecord, reset } = useStudyProgress();

  const totals = chapters.map((chapter) => {
    const record = getRecord(chapter.slug);
    const percent = Math.round((record.completedSections.length / chapter.checkpoints.length) * 100);
    return { chapter, record, percent };
  });
  const avg = Math.round(totals.reduce((sum, item) => sum + item.percent, 0) / totals.length);

  return (
    <div className="space-y-6">
      <header className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            把機器學習筆記變成考前可操作的複習系統
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
            短段落閱讀、卡片回想、考題骨架、錯題追蹤與搜尋都在同一個工作流裡。
          </p>
        </div>
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-stone-500">Overall progress</p>
          <p className="mt-3 text-5xl font-semibold text-stone-950">{avg}%</p>
          <div className="mt-4 h-2 rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-teal-600" style={{ width: `${avg}%` }} />
          </div>
          <button
            onClick={reset}
            className="mt-5 rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50"
          >
            Reset local progress
          </button>
        </section>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Learning blocks", value: "2 chapters", icon: BookOpen },
          { label: "Review cards", value: "6 cards", icon: Brain },
          { label: "Active recall", value: "6 questions", icon: ClipboardList },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
              <Icon className="h-5 w-5 text-red-700" />
              <p className="mt-4 text-sm text-stone-500">{item.label}</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">{item.value}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        {totals.map(({ chapter, record, percent }) => (
          <article key={chapter.slug} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-700">{chapter.week}</p>
                <h3 className="mt-1 text-2xl font-semibold text-stone-950">{chapter.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{chapter.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {chapter.topics.map((topic) => (
                    <span key={topic} className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full shrink-0 lg:w-64">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${masteryStyles[record.mastery]}`}>
                    {masteryLabels[record.mastery]}
                  </span>
                  <span className="text-sm font-semibold text-stone-500">{percent}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/chapter/${chapter.slug}`}
                    className="rounded-md bg-stone-950 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Learn
                  </Link>
                  <Link
                    href={`/chapter/${chapter.slug}?mode=quiz`}
                    className="inline-flex items-center justify-center gap-1 rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Quiz <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
