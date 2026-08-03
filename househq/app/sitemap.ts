import type { MetadataRoute } from "next";
import { states, products, checklistUrl } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes = [
    "/",
    "/checklists",
    "/legal/privacy",
    "/legal/terms",
    "/legal/refund",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));

  const stateRoutes = states.map((state) => ({
    url: `${base}/checklists/${state}`,
    lastModified: now,
  }));

  const checklistRoutes = products.map((product) => ({
    url: `${base}${checklistUrl(product)}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...stateRoutes, ...checklistRoutes];
}
