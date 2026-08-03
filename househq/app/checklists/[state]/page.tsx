import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  states,
  stateNames,
  stateChipLabel,
  bundleProductsFor,
  categoryMeta,
  formatPrice,
  checklistUrl,
} from "@/lib/catalog";

type Params = Promise<{ state: string }>;

export function generateStaticParams() {
  return states.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { state } = await params;
  const stateName = stateNames[state];
  if (!stateName) return {};
  const title = `${stateName} Property Checklists — First Home Buyers, Renters, Investors & Sellers | HouseHQ`;
  const description = `All 13 fact-checked ${stateName} property checklists in one place: first home buyer grants and stamp duty, renting, investing (including SMSF), and selling.`;
  return {
    title,
    description,
    alternates: { canonical: `/checklists/${state}` },
    openGraph: { title, description, url: `/checklists/${state}` },
  };
}

export default async function StateHubPage({ params }: { params: Params }) {
  const { state } = await params;
  const stateName = stateNames[state];
  if (!stateName) notFound();

  const products = bundleProductsFor(state);

  return (
    <>
      <SiteHeader />
      <div className="state-hub-wrap">
        <div className="checklist-crumbs">
          <Link href="/checklists">All states</Link> / {stateChipLabel[state]}
        </div>
        <div className="section-label">{stateChipLabel[state]}</div>
        <h1>{stateName} property checklists</h1>
        <p className="state-hub-intro">
          13 checklists covering every stage of buying, renting, investing
          and selling property in {stateName} — each checked against{" "}
          {stateName}&apos;s actual government sources, updated monthly.
        </p>
        <div className="checklist-related-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {products.map((p) => (
            <Link key={p.slug} href={checklistUrl(p)}>
              {p.pinned ? "★ " : ""}
              {p.name} — {formatPrice(p.priceCents)}
              <span style={{ display: "block", color: "var(--slate)", fontSize: 11.5, marginTop: 2 }}>
                {categoryMeta[p.category].name}
              </span>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 28 }}>
          <Link href={`/#catalog`} className="link-inline">
            Browse and buy on the main {stateName} catalogue page →
          </Link>
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
