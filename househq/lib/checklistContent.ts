import fs from "fs";
import path from "path";
import type { Product } from "./catalog";

const MARKDOWN_DIR = path.join(process.cwd(), "private-content", "source-markdown");

export type ChecklistPreview = {
  title: string;
  subtitle: string | null;
  previewSectionTitle: string;
  previewItems: string[];
  lockedSectionTitles: string[];
};

/**
 * Pulls a genuine content preview straight from the source markdown: the
 * first real section shown in full (for SEO and buyer confidence), every
 * later section shown as a locked title only. Never rewrites the source
 * text - the checklist content itself is fact-checked and out of scope to
 * silently edit.
 */
export function getChecklistPreview(product: Product): ChecklistPreview | null {
  const markdownFilename = product.pdfFilename.replace(/\.pdf$/, ".md");
  const filePath = path.join(MARKDOWN_DIR, markdownFilename);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");

  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const subtitleMatch = raw.match(/^###\s+(.+)$/m);

  const headingRe = /^##\s+(.+)$/gm;
  const headings: { title: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(raw))) {
    headings.push({ title: m[1].trim(), index: m.index });
  }

  const sections = headings.map((h, i) => {
    const end = i + 1 < headings.length ? headings[i + 1].index : raw.length;
    return { title: h.title, body: raw.slice(h.index, end) };
  });

  const checklistSections = sections.filter((s) => s.body.includes("- [ ]"));
  if (checklistSections.length === 0) return null;

  const [first, ...rest] = checklistSections;
  const itemRe = /- \[ \] \*\*(.+?)\*\*/g;
  const previewItems: string[] = [];
  let im: RegExpExecArray | null;
  while ((im = itemRe.exec(first.body))) {
    previewItems.push(im[1].trim());
  }

  return {
    title: titleMatch ? titleMatch[1].trim() : product.name,
    subtitle: subtitleMatch ? subtitleMatch[1].trim() : null,
    previewSectionTitle: first.title,
    previewItems,
    lockedSectionTitles: rest.map((s) => s.title),
  };
}
