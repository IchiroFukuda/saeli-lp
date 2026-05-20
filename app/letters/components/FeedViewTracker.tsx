"use client";

import { useEffect } from "react";
import { trackLetters } from "@/lib/analytics";

export function FeedViewTracker({ count }: { count: number }) {
  useEffect(() => {
    trackLetters("letters_feed_view", { count });
  }, [count]);
  return null;
}
