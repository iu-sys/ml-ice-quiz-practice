import Link from "next/link";
import { chapters } from "@/data/course";

export function ReviewHub() {
  return (
    <div className="space-y-5">
      <h2 className="text-4xl font-semibold text-stone-950">Review card mode</h2>
      <p className="max-w-2xl text-lg leading-8 text-stone-600">
        先看題面，停一下真的回想，再翻答案。這裡不是摘要牆，是回想訓練。
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {chapters.map((chapter) => (
          <Link
            key={chapter.slug}
            href={`/chapter/${chapter.slug}?mode=review`}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:bg-red-50/30"
          >
            <p className="text-sm font-semibold text-red-700">{chapter.week}</p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-950">{chapter.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">{chapter.cards.length} cards ready</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
