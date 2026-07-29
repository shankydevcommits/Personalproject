import raw from "@/data/products.json";

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
};

export type Bundle = {
  state: string;
  stateName: string;
  priceCents: number;
  wasCents: number;
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
  fhb: {
    code: "CAT · FHB",
    name: "First Home Buyers",
    blurb: "Grants, stamp duty, the contract, settlement — what to do and when.",
  },
  renters: {
    code: "CAT · RENT",
    name: "Renters",
    blurb: "How to actually win an application, and how to get your bond back.",
  },
  investors: {
    code: "CAT · INV",
    name: "Investors",
    blurb: "What to check before you buy, and what the tax office expects after.",
  },
  sellers: {
    code: "CAT · SELL",
    name: "Sellers",
    blurb: "Picking an agent, and what you legally have to tell buyers.",
  },
};

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findBundle(state: string): Bundle | undefined {
  return bundles.find((b) => b.state === state);
}

export function productsFor(state: string, category?: string): Product[] {
  return products.filter(
    (p) => p.state === state && (category ? p.category === category : true)
  );
}

export function bundleProductsFor(state: string): Product[] {
  return products.filter((p) => p.state === state);
}
