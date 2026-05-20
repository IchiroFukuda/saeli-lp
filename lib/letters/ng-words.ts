// ペットロス文脈での自傷願望ワード。
// ブロックはせず、検出時に相談窓口（/mainichi-anoko/blog/atooi）への導線を提示する。
// 厳密な誤検出は許容する設計（過剰なフィルタは誠実な気持ちを遮断するため）。

const NG_PATTERNS = [
  "死にたい",
  "消えたい",
  "後を追う",
  "あとを追う",
  "一緒に逝",
  "一緒にいく",
  "一緒に行く",
  "終わりにしたい",
  "楽になりたい",
  "生きていたくない",
  "生きる意味",
  "首を吊",
  "首吊り",
  "リスカ",
  "OD",
  "オーバードーズ",
  "飛び降り",
];

export function detectNG(body: string): boolean {
  if (!body) return false;
  return NG_PATTERNS.some((p) => body.includes(p));
}
