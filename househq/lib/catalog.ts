import raw from "@/data/products.json";
import { slugify } from "./slug";

export type Product = {
  slug: string;
  state: string;
  stateName: string;
  category: string;
  categoryName: string;
  name: string;
  description: string;
  priceCents: number;
  pdfPath: string;
  pdfFilename: string;
  pinned: boolean;
};

export type Bundle = {
  state: string;
  stateName: string;
  priceCents: number;
};

export const products: Product[] = raw.products as Product[];
export const bundles: Bundle[] = raw.bundles as Bundle[];
export const stateNames: Record<string, string> = raw.states;
export const categoryNames: Record<string, string> = raw.categories;

export const states = Object.keys(stateNames);
export const categories = Object.keys(categoryNames);

export const stateAbbr: Record<string, string> = {
  vic: "VIC",
  nsw: "NSW",
  qld: "QLD",
  wa: "WA",
  sa: "SA",
  tas: "TAS",
  act: "ACT",
  nt: "NT",
};

export const stateChipLabel: Record<string, string> = {
  vic: "Victoria",
  nsw: "New South Wales",
  qld: "Queensland",
  wa: "Western Australia",
  sa: "South Australia",
  tas: "Tasmania",
  act: "ACT",
  nt: "Northern Territory",
};

export const categoryMeta: Record<
  string,
  { code: string; name: string; blurb: string }
> = {
  all: {
    code: "CAT · ALL",
    name: "All Checklists",
    blurb: "See everything in one place.",
  },
  fhb: {
    code: "CAT · FHB",
    name: "First Home Buyers",
    blurb: "Grants, stamp duty, the contract, settlement.",
  },
  renters: {
    code: "CAT · RENT",
    name: "Renters",
    blurb: "Win the application, get your bond back.",
  },
  investors: {
    code: "CAT · INV",
    name: "Investors",
    blurb: "Before you buy, and what tax expects after.",
  },
  sellers: {
    code: "CAT · SELL",
    name: "Sellers",
    blurb: "Picking an agent, and what you must disclose.",
  },
};

export const categoryHeading: Record<string, string> = {
  all: "All checklists",
  fhb: "First Home Buyer checklists",
  renters: "Renter checklists",
  investors: "Investor checklists",
  sellers: "Seller checklists",
};

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findBundle(state: string): Bundle | undefined {
  return bundles.find((b) => b.state === state);
}

/** Pinned items (currently just the SMSF checklist) always display first. */
function pinnedFirst(items: Product[]): Product[] {
  return [...items].sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

export function productsFor(state: string, category?: string): Product[] {
  return pinnedFirst(
    products.filter(
      (p) => p.state === state && (category ? p.category === category : true)
    )
  );
}

export function bundleProductsFor(state: string): Product[] {
  return pinnedFirst(products.filter((p) => p.state === state));
}

/** The bundle's honest "was" price - the real sum of its individual items, not a hardcoded number. */
export function bundleWasCents(state: string): number {
  return bundleProductsFor(state).reduce((sum, p) => sum + p.priceCents, 0);
}

/** Human-readable URL slug for a checklist's own SEO landing page. */
export function checklistUrlSlug(product: Product): string {
  return slugify(product.name);
}

export function checklistUrl(product: Product): string {
  return `/checklists/${product.state}/${checklistUrlSlug(product)}`;
}

export function findProductByUrlSlug(
  state: string,
  urlSlug: string
): Product | undefined {
  return products.find(
    (p) => p.state === state && checklistUrlSlug(p) === urlSlug
  );
}
