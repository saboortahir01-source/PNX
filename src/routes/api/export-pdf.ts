import { createFileRoute } from "@tanstack/react-router";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Server-side PDF generator for PNX assistant responses (audits, strategies, etc.).
 * Accepts plain text (markdown stripped client-side) + a title and returns a
 * styled, paginated PDF. Pure JS — runs on the Cloudflare Worker runtime.
 */
export const Route = createFileRoute("/api/export-pdf")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let payload: { title?: string; content?: string };
        try {
          payload = (await request.json()) as { title?: string; content?: string };
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const title = (payload.title ?? "PNX SEO Report").slice(0, 200);
        const content = (payload.content ?? "").slice(0, 60_000);
        if (!content.trim()) {
          return new Response("Missing content", { status: 400 });
        }

        const pdf = await PDFDocument.create();
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

        const pageWidth = 595.28; // A4
        const pageHeight = 841.89;
        const margin = 56;
        const maxWidth = pageWidth - margin * 2;

        const brand = rgb(0.486, 0.227, 0.929); // ~ #7c3aed
        const ink = rgb(0.11, 0.13, 0.18);
        const muted = rgb(0.42, 0.45, 0.52);

        let page = pdf.addPage([pageWidth, pageHeight]);
        let y = pageHeight - margin;

        const wrap = (text: string, size: number, f = font) => {
          const words = text.split(/\s+/);
          const lines: string[] = [];
          let current = "";
          for (const w of words) {
            const test = current ? `${current} ${w}` : w;
            if (f.widthOfTextAtSize(test, size) > maxWidth) {
              if (current) lines.push(current);
              current = w;
            } else {
              current = test;
            }
          }
          if (current) lines.push(current);
          return lines;
        };

        const ensureSpace = (h: number) => {
          if (y - h < margin) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
        };

        // Header — brand bar
        page.drawRectangle({ x: 0, y: pageHeight - 36, width: pageWidth, height: 36, color: brand });
        page.drawText("PNX  ·  Agentic SEO Report", {
          x: margin, y: pageHeight - 24, size: 12, font: bold, color: rgb(1, 1, 1),
        });
        y = pageHeight - 60;

        // Title
        const titleLines = wrap(title, 22, bold);
        for (const ln of titleLines) {
          ensureSpace(28);
          page.drawText(ln, { x: margin, y, size: 22, font: bold, color: ink });
          y -= 28;
        }
        const stamp = `Generated ${new Date().toUTCString()}`;
        ensureSpace(20);
        page.drawText(stamp, { x: margin, y, size: 10, font, color: muted });
        y -= 24;

        // Body — render line by line, treat markdown headings specially
        const lines = content.replace(/\r\n/g, "\n").split("\n");
        for (const raw of lines) {
          const line = raw.trimEnd();
          if (!line.trim()) {
            y -= 8;
            continue;
          }
          const h1 = line.match(/^#\s+(.*)/);
          const h2 = line.match(/^##\s+(.*)/);
          const h3 = line.match(/^###\s+(.*)/);
          const bullet = line.match(/^[-*]\s+(.*)/);
          if (h1) {
            const text = h1[1];
            const wrapped = wrap(text, 16, bold);
            for (const w of wrapped) { ensureSpace(22); page.drawText(w, { x: margin, y, size: 16, font: bold, color: ink }); y -= 22; }
          } else if (h2) {
            const text = h2[1];
            const wrapped = wrap(text, 14, bold);
            for (const w of wrapped) { ensureSpace(20); page.drawText(w, { x: margin, y, size: 14, font: bold, color: brand }); y -= 20; }
          } else if (h3) {
            const text = h3[1];
            const wrapped = wrap(text, 12, bold);
            for (const w of wrapped) { ensureSpace(18); page.drawText(w, { x: margin, y, size: 12, font: bold, color: ink }); y -= 18; }
          } else if (bullet) {
            const text = bullet[1];
            const wrapped = wrap(text, 11, font);
            wrapped.forEach((w, i) => {
              ensureSpace(16);
              if (i === 0) page.drawText("•", { x: margin, y, size: 11, font, color: brand });
              page.drawText(w, { x: margin + 14, y, size: 11, font, color: ink });
              y -= 16;
            });
          } else {
            const text = line.replace(/\*\*(.*?)\*\*/g, "$1");
            const wrapped = wrap(text, 11, font);
            for (const w of wrapped) { ensureSpace(15); page.drawText(w, { x: margin, y, size: 11, font, color: ink }); y -= 15; }
          }
        }

        // Footer on every page
        const pages = pdf.getPages();
        pages.forEach((p, i) => {
          p.drawText(`PNX SEO Report · pnx.lovable.app · Page ${i + 1} of ${pages.length}`, {
            x: margin, y: 24, size: 9, font, color: muted,
          });
        });

        const bytes = await pdf.save();
        const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
        const safeName = title.replace(/[^a-z0-9-_ ]/gi, "").slice(0, 60).trim() || "PNX-SEO-Report";
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});