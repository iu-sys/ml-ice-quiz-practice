import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { chapters } from "@/data/course";

export default function ExamPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <h2 className="text-4xl font-semibold text-stone-950">Exam cram mode</h2>
        <p className="max-w-2xl text-lg leading-8 text-stone-600">
          專注在可寫進考卷的答題骨架、比較題關鍵字、以及最容易失分的陷阱。
        </p>
        <div className="grid gap-3">
          {chapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/chapter/${chapter.slug}?mode=exam`}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-red-200"
            >
              <p className="text-sm font-semibold text-red-700">{chapter.week}</p>
              <h3 className="mt-2 text-2xl font-semibold text-stone-950">{chapter.title}</h3>
              <p className="mt-3 text-sm text-stone-600">{chapter.examPrompts.length} exam prompts</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
