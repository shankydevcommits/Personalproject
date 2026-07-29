// One-time (and safe to re-run) script that uploads all 96 checklist PDFs
// from private-content/pdfs into a private Supabase Storage bucket, using
// the exact paths the website's checkout/verify flow expects.
//
// Run it after Supabase is set up (see SETUP-GUIDE.md):
//   npm run upload-pdfs
//
// Requires these environment variables (put them in .env.local):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   SUPABASE_STORAGE_BUCKET (optional, defaults to "checklists")

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "checklists";

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const pdfsRoot = path.join(__dirname, "..", "private-content", "pdfs");
const states = fs.readdirSync(pdfsRoot).filter((f) =>
  fs.statSync(path.join(pdfsRoot, f)).isDirectory()
);

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === bucket);
  if (!exists) {
    console.log(`Creating private bucket "${bucket}"...`);
    const { error } = await supabase.storage.createBucket(bucket, {
      public: false,
    });
    if (error) throw error;
  }
}

async function main() {
  await ensureBucket();

  let uploaded = 0;
  let failed = 0;

  for (const state of states) {
    const stateDir = path.join(pdfsRoot, state);
    const files = fs.readdirSync(stateDir).filter((f) => f.endsWith(".pdf"));
    for (const file of files) {
      const localPath = path.join(stateDir, file);
      const storagePath = `${state}/${file}`;
      const fileBuffer = fs.readFileSync(localPath);
      const { error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });
      if (error) {
        console.error(`FAILED  ${storagePath}: ${error.message}`);
        failed++;
      } else {
        console.log(`OK      ${storagePath}`);
        uploaded++;
      }
    }
  }

  console.log(`\nDone. ${uploaded} uploaded, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
