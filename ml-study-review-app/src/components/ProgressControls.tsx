"use client";

import { CheckCircle2 } from "lucide-react";
import { masteryLabels, masteryStyles } from "@/data/course";
import type { Chapter, MasteryStatus } from "@/data/types";
import { useStudyProgress } from "@/lib/progress";

const masteryOrder = Object.keys(masteryLabels) as MasteryStatus[];

export function ProgressControls({ chapter }: { chapter: Chapter }) {
  const { getRecord, setMastery, toggleSection } = useStudyProgress();
  const record = getRecord(chapter.slug);
  const complete = record.completedSections.length;
  const total = chapter.checkpoints.length;
  const percent = total ? Math.round((complete / total) * 100) : 0;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-950">學習進度</p>
          <p className="text-sm text-stone-500">{complete}/{total} checkpoints completed</p>
        </div>
        <span className={`w-fit rounded-md border px-3 py-1 text-sm font-semibold ${masteryStyles[record.mastery]}`}>
          {masteryLabels[record.mastery]}
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {masteryOrder.map((status) => (
          <button
            key={status}
            onClick={() => setMastery(chapter.slug, status)}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
              record.mastery === status
                ? "border-stone-950 bg-stone-950 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
            }`}
          >
            {masteryLabels[status]}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-2">
        {chapter.checkpoints.map((checkpoint) => {
          const checked = record.completedSections.includes(checkpoint);
          return (
            <button
              key={checkpoint}
              onClick={() => toggleSection(chapter.slug, checkpoint)}
              className="flex w-full items-center gap-3 rounded-md border border-stone-200 px-3 py-3 text-left text-sm transition hover:bg-stone-50"
            >
              <CheckCircle2 className={`h-5 w-5 ${checked ? "text-teal-600" : "text-stone-300"}`} />
              <span className={checked ? "text-stone-950" : "text-stone-600"}>{checkpoint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
