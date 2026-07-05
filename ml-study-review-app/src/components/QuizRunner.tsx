"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/data/types";
import { useStudyProgress } from "@/lib/progress";

export function QuizRunner({
  questions,
  chapterSlug,
}: {
  questions: QuizQuestion[];
  chapterSlug: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { recordQuiz } = useStudyProgress();

  const results = useMemo(() => {
    const mistakes = questions
      .filter((question) => {
        const answer = answers[question.id]?.trim();
        if (!answer) return true;
        return question.type === "single"
          ? answer !== question.answer
          : !answer.includes(question.answer.slice(0, 8));
      })
      .map((question) => question.id);
    return { correct: questions.length - mistakes.length, mistakes };
  }, [answers, questions]);

  function submit() {
    setSubmitted(true);
    recordQuiz(chapterSlug, results.correct, questions.length, results.mistakes);
  }

  return (
    <section className="space-y-4">
      {questions.map((question, index) => {
        const selected = answers[question.id] ?? "";
        const isWrong = submitted && results.mistakes.includes(question.id);
        return (
          <article key={question.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-red-700">Q{index + 1} · {question.tag}</p>
                <h3 className="mt-2 text-xl font-semibold leading-snug text-stone-950">{question.prompt}</h3>
              </div>
              {submitted ? (
                isWrong ? <X className="h-5 w-5 text-rose-600" /> : <Check className="h-5 w-5 text-teal-600" />
              ) : null}
            </div>
            {question.type === "single" ? (
              <div className="mt-4 grid gap-2">
                {question.choices?.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: choice }))}
                    className={`rounded-md border px-3 py-3 text-left text-sm transition ${
                      selected === choice
                        ? "border-stone-950 bg-stone-950 text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={selected}
                onChange={(event) =>
                  setAnswers((current) => ({ ...current, [question.id]: event.target.value }))
                }
                className="mt-4 min-h-28 w-full rounded-md border border-stone-200 bg-[#fbfaf8] p-3 text-sm leading-7 outline-none focus:border-red-400"
                placeholder="先用自己的話寫，再按提交看提示。"
              />
            )}
            {submitted ? (
              <div className="mt-4 rounded-md bg-stone-50 p-3 text-sm leading-7 text-stone-700">
                <p className="font-semibold text-stone-950">參考答案：{question.answer}</p>
                <p>{question.explanation}</p>
              </div>
            ) : null}
          </article>
        );
      })}
      <div className="sticky bottom-4 rounded-lg border border-stone-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <button
          onClick={submit}
          className="w-full rounded-md bg-red-700 px-4 py-3 text-sm font-semibold text-white hover:bg-red-800"
        >
          Submit recall · {submitted ? `${results.correct}/${questions.length}` : "check answers"}
        </button>
      </div>
    </section>
  );
}
