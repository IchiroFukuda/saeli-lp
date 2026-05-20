import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { LetterCard } from "../components/LetterCard";
import { LetterActions } from "../components/LetterActions";
import { LetterDetailTracker } from "./LetterDetailTracker";
import { BackLink } from "./BackLink";

export const revalidate = 30;

type Letter = {
  id: string;
  pet_name: string;
  owner_nickname: string;
  body: string;
  photo_path: string | null;
  email_lower: string;
  created_at: string;
};

async function fetchLetter(id: string): Promise<Letter | null> {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("letters")
    .select("id, pet_name, owner_nickname, body, photo_path, email_lower, created_at")
    .eq("id", id)
    .maybeSingle();
  return data as Letter | null;
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const letter = await fetchLetter(params.id);
  if (!letter) {
    return { title: "あの子への手紙" };
  }
  const excerpt = letter.body.slice(0, 80).replace(/\s+/g, " ");
  const title = `${letter.pet_name}へ — あの子への手紙`;
  const description = `${excerpt}${letter.body.length > 80 ? "…" : ""} / ${letter.owner_nickname} より`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "あの子への手紙",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LetterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const letter = await fetchLetter(params.id);
  if (!letter) notFound();

  return (
    <div className="space-y-6">
      <LetterDetailTracker letterId={letter.id} />

      <BackLink ownerEmailLower={letter.email_lower} />

      <LetterCard letter={letter} />

      <LetterActions
        letterId={letter.id}
        letterPetName={letter.pet_name}
        ownerEmailLower={letter.email_lower}
        photoPath={letter.photo_path}
      />
    </div>
  );
}
