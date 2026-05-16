import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default function sitemap(): MetadataRoute.Sitemap {
  const host = headers().get("host") ?? "";
  const now = new Date();

  if (host.includes("mainichi-anoko.com")) {
    const base = "https://mainichi-anoko.com";
    return [
      { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
      { url: `${base}/pet-loss`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ];
  }

  const base = "https://saeli.org";
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/pet-loss`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/exit-score`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/keep`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/grantsaigent`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/promptguard`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/realestate-exit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/revealprop`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/cad-search`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
