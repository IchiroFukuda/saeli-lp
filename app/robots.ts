import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default function robots(): MetadataRoute.Robots {
  const host = headers().get("host") ?? "";
  const baseUrl = host.includes("mainichi-anoko.com")
    ? "https://mainichi-anoko.com"
    : "https://saeli.org";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/letters-admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
