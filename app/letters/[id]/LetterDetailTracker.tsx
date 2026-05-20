"use client";

import { useEffect } from "react";
import { trackLetters } from "@/lib/analytics";

export function LetterDetailTracker({ letterId }: { letterId: string }) {
  useEffect(() => {
    trackLetters("letter_detail_view", { letter_id: letterId });
  }, [letterId]);
  return null;
}
