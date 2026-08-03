import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const TITLE = "HouseHQ: Australian Property Checklists, Fact-Checked by State";
const DESCRIPTION =
  "Fact-checked Australian property checklists for first home buyers, renters, investors and sellers. Covers all 8 states and territories, updated monthly, under $10 a checklist.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "HouseHQ",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Fact-checked Australian property checklists for first home buyers, renters, investors and sellers.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HouseHQ",
  url: siteUrl(),
  description:
    "Fact-checked Australian property checklists for first home buyers, renters, investors and sellers, covering all 8 states and territories.",
  areaServed: { "@type": "Country", name: "Australia" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this legal, financial, or tax advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It's general information checked against state government sources. Talk to a licensed conveyancer, solicitor, broker or accountant before making a real decision.",
      },
    },
    {
      "@type": "Question",
      name: "How do you make sure the checklists are accurate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every checklist is checked against primary sources such as State Revenue Offices, tenancy authorities and current legislation, not other websites.",
      },
    },
    {
      "@type": "Question",
      name: "Which state checklist do I need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the checklist for the state where the property is located, since stamp duty, tenancy law and cooling-off periods are all set at the state level.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
