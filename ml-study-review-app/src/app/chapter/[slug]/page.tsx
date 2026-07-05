import { readFile } from "node:fs/promises";
import path from "node:path";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ChapterWorkspace } from "@/components/ChapterWorkspace";
import { chapters, getChapter } from "@/data/course";

const noteFiles: Record<string, string> = {
  "week-01-k-means": "week-01-k-means.mdx",
  "week-02-pca-k-medoids-silhouette": "week-02-pca-k-medoids-silhouette.mdx",
};

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const notePath = path.join(process.cwd(), "src", "content", "notes", noteFiles[slug]);
  const noteSource = await readFile(notePath, "utf8");

  return (
    <AppShell>
      <Suspense fallback={<div className="rounded-lg border border-stone-200 bg-white p-6">Loading chapter...</div>}>
        <ChapterWorkspace chapter={chapter}>
          <MdxNote source={noteSource} />
        </ChapterWorkspace>
      </Suspense>
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
