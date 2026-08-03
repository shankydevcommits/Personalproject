import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BuyButton from "@/components/BuyButton";
import {
  products,
  stateChipLabel,
  categoryMeta,
  formatPrice,
  checklistUrl,
  checklistUrlSlug,
  findProductByUrlSlug,
  productsFor,
} from "@/lib/catalog";
import { getChecklistPreview } from "@/lib/checklistContent";
import { siteUrl } from "@/lib/site";

type Params = Promise<{ state: string; slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ state: p.state, slug: checklistUrlSlug(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { state, slug } = await params;
  const product = findProductByUrlSlug(state, slug);
  if (!product) return {};
  const title = `${product.name} — ${product.stateName} | HouseHQ`;
  const description = `${product.description} Fact-checked for ${product.stateName}, ${formatPrice(product.priceCents)}, instant PDF download.`;
  const url = checklistUrl(product);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function ChecklistPage({ params }: { params: Params }) {
  const { state, slug } = await params;
  const product = findProductByUrlSlug(state, slug);
  if (!product) notFound();

  const preview = getChecklistPreview(product);
  const related = productsFor(product.state).filter((p) => p.slug !== product.slug).slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} (${product.stateName})`,
    description: product.description,
    brand: { "@type": "Brand", name: "HouseHQ" },
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl()}${checklistUrl(product)}`,
    },
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="checklist-page">
        <div className="checklist-crumbs">
          <Link href="/checklists">All states</Link> /{" "}
          <Link href={`/checklists/${product.state}`}>{stateChipLabel[product.state]}</Link> /{" "}
          {product.name}
        </div>

        <div className="checklist-header">
          <div className="section-label">
            {categoryMeta[product.category].name} · {stateChipLabel[product.state]}
          </div>
          <h1>
            {product.pinned && <>★ </>}
            {product.name}
          </h1>
          <p style={{ color: "var(--slate)", fontSize: 15 }}>{product.description}</p>
        </div>

        <div className="checklist-meta">
          <span className="checklist-price">{formatPrice(product.priceCents)}</span>
          <BuyButton product={product} />
        </div>

        {preview && (
          <div className="checklist-preview">
            <h2>{preview.previewSectionTitle}</h2>
            <ul>
              {preview.previewItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {preview.lockedSectionTitles.length > 0 && (
              <div className="checklist-locked">
                <p style={{ fontSize: 12.5, color: "var(--slate)", marginBottom: 8 }}>
                  Unlocks after purchase and email verification:
                </p>
                <ul className="checklist-locked-list">
                  {preview.lockedSectionTitles.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="checklist-related">
            <h2>Other {stateChipLabel[product.state]} checklists</h2>
            <div className="checklist-related-grid">
              {related.map((p) => (
                <Link key={p.slug} href={checklistUrl(p)}>
                  {p.name} — {formatPrice(p.priceCents)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
