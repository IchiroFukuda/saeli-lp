import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = headers().get("host") ?? "";
  const now = new Date();

  if (host.includes("mainichi-anoko.com")) {
    const base = "https://mainichi-anoko.com";
    const items: MetadataRoute.Sitemap = [
      { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
      { url: `${base}/blog/atooi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/blog/tsurai`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/blog/itsumade`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/letters`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
      { url: `${base}/letters/new`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ];

    // 個別の手紙ページ（最新50件をindex対象に）
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: letters } = await supabase
        .from("letters")
        .select("id, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (letters) {
        for (const letter of letters) {
          items.push({
            url: `${base}/letters/${letter.id}`,
            lastModified: new Date(letter.created_at),
            changeFrequency: "monthly",
            priority: 0.5,
          });
        }
      }
    } catch {
      // Supabase落ちててsitemap生成失敗 → static分だけ返す
    }

    return items;
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
