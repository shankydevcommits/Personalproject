import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { states, stateChipLabel } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Browse All Australian Property Checklists by State | HouseHQ",
  description:
    "104 fact-checked property checklists for first home buyers, renters, investors and sellers across all 8 Australian states and territories.",
  alternates: { canonical: "/checklists" },
};

export default function ChecklistsIndexPage() {
  return (
    <>
      <SiteHeader />
      <div className="state-hub-wrap">
        <div className="section-label">Every state, one place</div>
        <h1>Australian property checklists, by state</h1>
        <p className="state-hub-intro">
          Pick your state to see all 13 checklists for buying, renting,
          investing and selling there — each one checked against that
          state&apos;s actual rules, not a generic national template.
        </p>
        <div className="block-grid">
          {states.map((s) => (
            <Link key={s} href={`/checklists/${s}`} className="select-block">
              <div className="cat-code">STATE</div>
              <h3>{stateChipLabel[s]}</h3>
            </Link>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
