"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export function BackLink({ ownerEmailLower }: { ownerEmailLower: string }) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && user.email.toLowerCase() === ownerEmailLower) {
        setIsOwner(true);
      }
    })();
  }, [ownerEmailLower]);

  const href = isOwner ? "/letters/mine" : "/letters";
  const label = isOwner ? "← 自分の手紙一覧へ" : "← みんなの手紙へ";

  return (
    <Link href={href} className="text-sm text-stone-500 hover:text-stone-700">
      {label}
    </Link>
  );
}
