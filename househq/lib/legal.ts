import fs from "fs";
import path from "path";
import { marked } from "marked";

const LEGAL_DIR = path.join(process.cwd(), "private-content", "legal");

export function renderLegalDoc(filename: string): string {
  const raw = fs.readFileSync(path.join(LEGAL_DIR, filename), "utf-8");
  // The payment provider is now a settled technical fact (Stripe) - everything
  // else in brackets ([insert date], ABN, contact email) is a founder/solicitor
  // decision and is deliberately left as a visible placeholder, see the
  // banner on each legal page.
  const withProvider = raw.replace(/\[Payhip\/Stripe\/etc\.\]/g, "Stripe");
  return marked.parse(withProvider, { async: false }) as string;
}
