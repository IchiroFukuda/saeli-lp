-- 「あの子への手紙」Web版 スキーマ
-- 1人1ページのメモリアルではなく、1投稿1手紙の構造。匿名性を保ちつつ削除権限のため
-- メアド認証（magic link）を採用。

create extension if not exists "uuid-ossp";

-- 投稿された手紙
create table if not exists public.letters (
  id uuid primary key default uuid_generate_v4(),
  pet_name text not null check (char_length(pet_name) between 1 and 30),
  owner_nickname text not null check (char_length(owner_nickname) between 1 and 30),
  body text not null check (char_length(body) between 1 and 2000),
  photo_path text,
  -- 認証ユーザーのemail（小文字化済み）。削除権限の判定用。
  email_lower text not null,
  created_at timestamptz not null default now()
);

create index if not exists letters_created_at_idx on public.letters (created_at desc);
create index if not exists letters_email_idx on public.letters (email_lower);

-- リアクション（絵文字を送る）。数は表示しないが、誰が何を送ったかは保持
-- （重複防止のため email + letter + emoji の一意制約）
create type reaction_emoji as enum ('heart', 'flower', 'pray', 'paw');

create table if not exists public.letter_reactions (
  id uuid primary key default uuid_generate_v4(),
  letter_id uuid not null references public.letters(id) on delete cascade,
  email_lower text not null,
  emoji reaction_emoji not null,
  created_at timestamptz not null default now(),
  unique (letter_id, email_lower, emoji)
);

create index if not exists reactions_letter_idx on public.letter_reactions (letter_id);

-- Row Level Security
alter table public.letters enable row level security;
alter table public.letter_reactions enable row level security;

-- 全員が手紙を読める
create policy "letters are readable by anyone"
  on public.letters for select using (true);

-- 認証ユーザーは投稿できる（emailが一致する場合のみ）
create policy "authenticated users can insert their own letter"
  on public.letters for insert
  with check (
    auth.role() = 'authenticated'
    and lower(auth.email()) = email_lower
  );

-- 自分の投稿だけ削除可能
create policy "users can delete own letter"
  on public.letters for delete
  using (lower(auth.email()) = email_lower);

-- リアクション：全員が読める
create policy "reactions are readable by anyone"
  on public.letter_reactions for select using (true);

-- 認証ユーザーは自分のリアクションを追加できる
create policy "authenticated users can react"
  on public.letter_reactions for insert
  with check (
    auth.role() = 'authenticated'
    and lower(auth.email()) = email_lower
  );

-- Storage: letter-photos バケット（手動でSupabase Dashboardで作成すること）
-- bucket name: letter-photos
-- public access: true (read)
-- policies:
--   insert: authenticated only, path must start with email
--   delete: only own (path matches email)
