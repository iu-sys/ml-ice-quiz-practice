import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ChapterWorkspace } from "@/components/ChapterWorkspace";
import { chapters, getChapter } from "@/data/course";
import type { ChapterMode } from "@/data/types";

const modes: ChapterMode[] = ["learn", "review", "exam", "quiz"];

const noteFiles: Record<string, string> = {
  "week-01-k-means": "week-01-k-means.mdx",
  "week-02-pca-k-medoids-silhouette": "week-02-pca-k-medoids-silhouette.mdx",
};

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const mode = modes.includes(query.mode as ChapterMode) ? (query.mode as ChapterMode) : "learn";
  const notePath = path.join(process.cwd(), "src", "content", "notes", noteFiles[slug]);
  const noteSource = await readFile(notePath, "utf8");

  return (
    <AppShell>
      <ChapterWorkspace chapter={chapter} mode={mode}>
        <MdxNote source={noteSource} />
      </ChapterWorkspace>
    </AppShell>
  );
}

function MdxNote({ source }: { source: string }) {
  const blocks = source.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return <h2 key={index}>{block.replace(/^## /, "")}</h2>;
        }
        if (block.startsWith("### ")) {
          return <h3 key={index}>{block.replace(/^### /, "")}</h3>;
        }
        if (block.startsWith("> ")) {
          return (
            <blockquote key={index}>
              <p>{block.replace(/^> /, "")}</p>
            </blockquote>
          );
        }
        if (block.startsWith("- ")) {
          return (
            <ul key={index}>
              {block.split("\n").map((item) => (
                <li key={item}>{item.replace(/^- /, "")}</li>
              ))}
            </ul>
          );
        }
        if (/^\d+\. /.test(block)) {
          return (
            <ol key={index}>
              {block.split("\n").map((item) => (
                <li key={item}>{item.replace(/^\d+\. /, "")}</li>
              ))}
            </ol>
          );
        }
        return <p key={index}>{block}</p>;
      })}
    </>
  );
}
