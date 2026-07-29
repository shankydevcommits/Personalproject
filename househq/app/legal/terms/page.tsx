import LegalPage from "@/components/LegalPage";
import { renderLegalDoc } from "@/lib/legal";

export const metadata = { title: "Terms & Conditions — HouseHQ" };

export default function TermsPage() {
  const html = renderLegalDoc("legal-02-terms-and-conditions.md");
  return <LegalPage html={html} />;
}
