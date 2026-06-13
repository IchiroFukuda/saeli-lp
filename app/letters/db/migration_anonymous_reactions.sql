-- 誰でも（ログイン不要・匿名）リアクションを送れるようにする差分。
-- 既に schema.sql を適用済みのDBに対して実行する。
-- 重複防止はクライアント側(localStorage)で行うため、DBの一意制約には依存しない。

-- 1. email_lower を任意化（匿名リアクションは email を持たない）
alter table public.letter_reactions alter column email_lower drop not null;

-- 2. 旧ポリシー（認証ユーザーのみ・email一致）を破棄
drop policy if exists "authenticated users can react" on public.letter_reactions;

-- 3. 誰でも insert 可能に
create policy "anyone can react"
  on public.letter_reactions for insert
  with check (true);

-- 4. anon ロールに insert 権限を明示付与（実際の制御は上のRLS）
grant insert on public.letter_reactions to anon;
