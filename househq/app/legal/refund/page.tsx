import LegalPage from "@/components/LegalPage";
import { renderLegalDoc } from "@/lib/legal";

export const metadata = { title: "Refund Policy — HouseHQ" };

export default function RefundPage() {
  const html = renderLegalDoc("legal-03-refund-policy.md");
  return <LegalPage html={html} />;
}
