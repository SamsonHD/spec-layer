import { NextRequest, NextResponse } from "next/server";
import { getAllDocs } from "@/lib/contentCache";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().toLowerCase();
  if (q.length < 2) return NextResponse.json({ hits: [] });

  const docs = getAllDocs();
  const hits = docs
    .map((doc) => {
      const name = doc.frontmatter.name.toLowerCase();
      const tags = (doc.frontmatter.tags || []).join(" ").toLowerCase();
      const pathStr = doc.slug.join(" ").toLowerCase();
      const body = doc.body.toLowerCase();

      let score = 0;
      if (name.includes(q)) score += 10;
      if (name.startsWith(q)) score += 5;
      if (tags.includes(q)) score += 4;
      if (pathStr.includes(q)) score += 3;
      if (body.includes(q)) score += 1;

      return { doc, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((r) => ({
      slug: r.doc.slug,
      name: r.doc.frontmatter.name,
      path: r.doc.slug.join(" / "),
    }));

  return NextResponse.json({ hits });
}
