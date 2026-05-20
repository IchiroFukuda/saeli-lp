"use client";

import Link from "next/link";
import { trackLetters } from "@/lib/analytics";

export function AppPromoLink() {
  return (
    <Link
      href="/mainichi-anoko"
      onClick={() => trackLetters("app_promo_click", { from: "letters_footer" })}
      className="underline hover:text-stone-700"
    >
      毎日あの子
    </Link>
  );
}
