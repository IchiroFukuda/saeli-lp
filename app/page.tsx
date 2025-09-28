import { redirect } from 'next/navigation';

export default function Home() {
  // 既存のSAELIホームページにリダイレクト
  redirect('/index.html');
}
