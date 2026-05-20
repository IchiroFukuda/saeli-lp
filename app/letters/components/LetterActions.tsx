"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { trackLetters } from "@/lib/analytics";

export function LetterActions({
  letterId,
  letterPetName,
  ownerEmailLower,
  photoPath,
}: {
  letterId: string;
  letterPetName: string;
  ownerEmailLower: string;
  photoPath: string | null;
}) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && user.email.toLowerCase() === ownerEmailLower) {
        setIsOwner(true);
      }
    })();
  }, [ownerEmailLower]);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${letterPetName}へ — あの子への手紙`;
    trackLetters("share_clicked", { letter_id: letterId });

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: text, url });
        trackLetters("share_native", { letter_id: letterId });
        return;
      } catch {
        // ユーザーがキャンセル等 → クリップボードへフォールバック
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      trackLetters("share_copied", { letter_id: letterId });
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      setError("共有に失敗しました。URLをコピーしてください。");
    }
  }

  async function handleDelete() {
    if (!confirm("この手紙を削除しますか？\nこの操作は取り消せません。")) {
      trackLetters("delete_cancelled", { letter_id: letterId });
      return;
    }
    trackLetters("delete_confirmed", { letter_id: letterId });
    setDeleting(true);
    setError(null);

    const supabase = supabaseBrowser();
    const { error: delErr } = await supabase
      .from("letters")
      .delete()
      .eq("id", letterId);

    if (delErr) {
      setError(`削除に失敗しました: ${delErr.message}`);
      setDeleting(false);
      return;
    }

    if (photoPath) {
      // 写真の削除失敗は致命ではないので静かに無視（orphan許容）
      await supabase.storage.from("letter-photos").remove([photoPath]).catch(() => {});
    }

    trackLetters("letter_deleted", { letter_id: letterId });
    router.push("/letters");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleShare}
          className="text-sm text-stone-600 hover:text-stone-800 underline"
        >
          {shareStatus === "copied" ? "URLをコピーしました" : "この手紙を共有する"}
        </button>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-stone-500 hover:text-red-600 disabled:opacity-50"
          >
            {deleting ? "削除中..." : "削除する"}
          </button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}
    </div>
  );
}
