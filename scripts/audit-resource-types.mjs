import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const RES_DIR = path.join(ROOT, "src", "content", "resources");

function extractFrontmatter(md) {
  if (!md.startsWith("---")) return { fm: null, body: md };
  const end = md.indexOf("\n---", 3);
  if (end === -1) return { fm: null, body: md };
  const fm = md.slice(3, end + 1); // includes trailing \n
  const body = md.slice(end + "\n---".length);
  return { fm, body };
}

function parseFrontmatterLines(fm) {
  const lines = fm.split("\n").map((l) => l.trimEnd());
  const kv = new Map();
  for (const line of lines) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)\s*$/);
    if (!m) continue;
    kv.set(m[1], m[2]);
  }
  return kv;
}

function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function stripQuotes(v) {
  const s = String(v ?? "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function suggestType({ title, description, url, section, category }) {
  const text = normalize([title, description, section, url].filter(Boolean).join(" "));
  const sectionN = normalize(section);

  // Strong explicit section mapping (existing content already uses this)
  if (sectionN.includes("publicer")) return "publishing";
  if (sectionN.includes("stream")) return "streaming";
  if (sectionN.includes("market")) return "marketplace";
  if (sectionN.includes("relay")) return "relay";

  // Category hints (legacy)
  if (category === "extensions") return "extension";
  if (category === "relays") return "relay";
  if (category === "tools") return "tool";

  // Text heuristics (Danish + English)
  if (/\b(publicer|publicering|publish|publishing|blog|artik|news)\b/.test(text)) return "publishing";
  if (/\b(stream|streaming|video|music|podcast)\b/.test(text)) return "streaming";
  if (/\b(market|marketplace|markedsplads|shop|store)\b/.test(text)) return "marketplace";
  if (/\b(relay|relays)\b/.test(text)) return "relay";
  if (/\b(extension|browser|chrome|firefox)\b/.test(text)) return "extension";
  if (/\b(wallet|lightning|zap|zaps|lnurl|nwc)\b/.test(text)) return "wallet";
  if (/\b(tool|værktøj|search|søg|stats|directory|discover)\b/.test(text)) return "tool";
  if (/\b(client|klient|damus|primal|snort|coracle|iris)\b/.test(text)) return "client";

  return "service";
}

function upsertTypeFrontmatter(originalMd, typeValue) {
  const { fm, body } = extractFrontmatter(originalMd);
  if (fm == null) return { changed: false, md: originalMd };

  const kv = parseFrontmatterLines(fm);
  if (kv.has("type")) return { changed: false, md: originalMd };

  // Insert `type:` just before `order:` if present, else before `published:` if present, else at end of fm.
  const fmLines = fm.split("\n");
  const insertAt = (() => {
    const idxOrder = fmLines.findIndex((l) => l.trimStart().startsWith("order:"));
    if (idxOrder !== -1) return idxOrder;
    const idxPublished = fmLines.findIndex((l) => l.trimStart().startsWith("published:"));
    if (idxPublished !== -1) return idxPublished;
    return fmLines.length - 1; // before trailing empty line
  })();

  const typeLine = `type: "${typeValue}"`;
  fmLines.splice(insertAt, 0, typeLine);
  const newFm = fmLines.join("\n");
  return { changed: true, md: `---${newFm}\n---${body}` };
}

const args = new Set(process.argv.slice(2));
const WRITE = args.has("--write");
const ONLY_MISSING = !args.has("--all");

const files = (await fs.readdir(RES_DIR))
  .filter((f) => f.endsWith(".md"))
  .map((f) => path.join(RES_DIR, f))
  .sort((a, b) => a.localeCompare(b));

const rows = [];
let changedCount = 0;

for (const file of files) {
  const md = await fs.readFile(file, "utf8");
  const { fm } = extractFrontmatter(md);
  if (!fm) continue;
  const kv = parseFrontmatterLines(fm);

  const title = stripQuotes(kv.get("title"));
  const description = stripQuotes(kv.get("description"));
  const url = stripQuotes(kv.get("url"));
  const section = stripQuotes(kv.get("section"));
  const category = stripQuotes(kv.get("category"));
  const existingTypeRaw = kv.get("type");
  const existingType = existingTypeRaw ? stripQuotes(existingTypeRaw) : "";

  const suggested = suggestType({ title, description, url, section, category });
  const missing = !existingType;

  if (ONLY_MISSING && !missing) continue;

  rows.push({
    file: path.relative(ROOT, file),
    title,
    category,
    section,
    existingType: existingType || "(missing)",
    suggested,
  });

  if (WRITE && missing) {
    const { changed, md: newMd } = upsertTypeFrontmatter(md, suggested);
    if (changed) {
      await fs.writeFile(file, newMd, "utf8");
      changedCount++;
    }
  }
}

// Print a compact table (markdown-ish) for easy review
console.log(`Found ${rows.length} resource(s) ${ONLY_MISSING ? "missing type" : "total"}.`);
if (WRITE) console.log(`Wrote type to ${changedCount} file(s).`);
console.log("");
console.log("| file | existing | suggested | section | category | title |");
console.log("|---|---:|---:|---|---|---|");
for (const r of rows) {
  console.log(
    `| ${r.file} | ${r.existingType} | ${r.suggested} | ${r.section || ""} | ${r.category || ""} | ${r.title || ""} |`,
  );
}

