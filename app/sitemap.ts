export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/cart", "/checkout"].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: new Date(), changeFrequency: "weekly", priority: p === "" ? 1 : 0.6 }));
}
