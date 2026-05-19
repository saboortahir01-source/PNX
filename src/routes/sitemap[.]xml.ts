import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { POSTS } from "@/lib/blog-posts";

const BASE_URL = "https://pnx.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths: { path: string; priority: string; changefreq: string }[] = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/blog", priority: "0.9", changefreq: "weekly" },
          { path: "/about", priority: "0.7", changefreq: "monthly" },
          { path: "/contact", priority: "0.6", changefreq: "monthly" },
          { path: "/faq", priority: "0.7", changefreq: "monthly" },
          { path: "/privacy", priority: "0.3", changefreq: "yearly" },
          { path: "/terms", priority: "0.3", changefreq: "yearly" },
          { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
        ];
        const postEntries = POSTS.map((p) => ({
          path: `/blog/${p.slug}`,
          lastmod: p.updatedAt,
          priority: "0.8",
          changefreq: "monthly",
        }));
        const all = [...staticPaths, ...postEntries];
        const urls = all.map((e) => {
          const last = "lastmod" in e && e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : "";
          return `  <url>\n    <loc>${BASE_URL}${e.path}</loc>${last}\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`;
        }).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
