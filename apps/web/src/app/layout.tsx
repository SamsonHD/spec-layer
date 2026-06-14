import type { Metadata } from "next";
import "./globals.css";
import { getNavTree, getAllDocs } from "@/lib/contentCache";
import Sidebar from "@/components/Sidebar";
import { getInboxCount, withoutInbox } from "@/lib/navInbox";
import type { CommandItem } from "@/lib/commandPalette";

export const metadata: Metadata = {
  title: "Design System Docs",
  description: "Markdown-driven design system documentation",
};

// Runs before first paint to avoid a light→dark flash: honour a saved choice,
// otherwise the OS preference.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allDocs = getAllDocs();
  const nav = withoutInbox(getNavTree());
  const inboxCount = getInboxCount(allDocs);
  const searchItems: CommandItem[] = allDocs
    .filter((doc) => doc.slug[0] !== "_inbox")
    .map((doc) => ({
      slug: doc.slug,
      name: doc.frontmatter.name,
      path: doc.slug.join(" / "),
    }));
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <div className="app">
          <Sidebar nav={nav} inboxCount={inboxCount} searchItems={searchItems} />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
