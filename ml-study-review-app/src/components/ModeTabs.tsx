import Link from "next/link";
import type { ChapterMode } from "@/data/types";

const modes: { mode: ChapterMode; label: string }[] = [
  { mode: "learn", label: "Learning" },
  { mode: "review", label: "Review cards" },
  { mode: "exam", label: "Exam cram" },
  { mode: "quiz", label: "Active recall" },
];

export function ModeTabs({ slug, active }: { slug: string; active: ChapterMode }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-stone-200 bg-white p-2 sm:grid-cols-4">
      {modes.map((item) => (
        <Link
          key={item.mode}
          href={`/chapter/${slug}?mode=${item.mode}`}
          className={`rounded-md px-3 py-2 text-center text-sm font-semibold transition ${
            active === item.mode
              ? "bg-red-700 text-white"
              : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
