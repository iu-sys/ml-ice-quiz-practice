"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  ClipboardList,
  NotebookPen,
  Search,
  TimerReset,
} from "lucide-react";
import { chapters } from "@/data/course";

const navItems = [
  { href: "/", label: "Dashboard", icon: BookOpen },
  { href: "/review", label: "Review", icon: Brain },
  { href: "/exam", label: "Exam cram", icon: TimerReset },
  { href: "/quiz", label: "Quiz", icon: ClipboardList },
  { href: "/mistakes", label: "Mistakes", icon: NotebookPen },
  { href: "/search", label: "Search", icon: Search },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-stone-200 bg-white/85 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <Link href="/" className="block">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              ML Review
            </p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-stone-950">
              機器學習考前複習
            </h1>
          </Link>

          <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                    active
                      ? "bg-stone-950 text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              Chapters
            </p>
            <div className="mt-3 space-y-2">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.slug}
                  href={`/chapter/${chapter.slug}`}
                  className="block rounded-md border border-stone-200 bg-white p-3 transition hover:border-red-200 hover:bg-red-50/40"
                >
                  <p className="text-xs font-semibold text-red-700">{chapter.week}</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">{chapter.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
