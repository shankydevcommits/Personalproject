import LegalPage from "@/components/LegalPage";
import { renderLegalDoc } from "@/lib/legal";

export const metadata = { title: "Privacy Policy — HouseHQ" };

export default function PrivacyPage() {
  const html = renderLegalDoc("legal-01-privacy-policy.md");
  return <LegalPage html={html} />;
}
