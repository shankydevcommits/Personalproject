import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function LegalPage({ html }: { html: string }) {
  return (
    <>
      <SiteHeader />
      <div className="legal-page">
        <Link href="/" className="back-link">
          ← Back to HouseHQ
        </Link>
        <div
          style={{
            background: "var(--kraft)",
            border: "1px solid var(--line)",
            borderRadius: 4,
            padding: "14px 18px",
            fontSize: 12.5,
            color: "var(--ink)",
            marginBottom: 28,
          }}
        >
          <strong>Draft document.</strong> Bracketed placeholders (dates, ABN,
          contact email) still need to be filled in, and this needs a
          solicitor&apos;s review before the site goes live for real sales.
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <SiteFooter />
    </>
  );
}
