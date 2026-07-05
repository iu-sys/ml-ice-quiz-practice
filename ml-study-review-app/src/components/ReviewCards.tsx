"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { StudyCard } from "@/data/types";

export function ReviewCards({ cards }: { cards: StudyCard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-red-700">{card.tag}</p>
          <p className="text-sm text-stone-500">
            Card {index + 1} / {cards.length}
          </p>
        </div>
        <button
          onClick={() => setFlipped(false)}
          className="grid h-10 w-10 place-items-center rounded-md border border-stone-200 text-stone-500 hover:bg-stone-50"
          aria-label="Reset card"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => setFlipped((value) => !value)}
        className="mt-4 min-h-56 w-full rounded-lg border border-stone-200 bg-[#fbfaf8] p-6 text-left transition hover:border-red-200"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
          {flipped ? "Answer" : "Prompt"}
        </p>
        <p className="mt-4 text-2xl font-semibold leading-snug text-stone-950">
          {flipped ? card.back : card.front}
        </p>
      </button>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            setIndex((value) => Math.max(0, value - 1));
            setFlipped(false);
          }}
          className="rounded-md border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 disabled:opacity-40"
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          onClick={() => {
            setIndex((value) => Math.min(cards.length - 1, value + 1));
            setFlipped(false);
          }}
          className="rounded-md bg-stone-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
          disabled={index === cards.length - 1}
        >
          Next
        </button>
      </div>
    </section>
  );
}
