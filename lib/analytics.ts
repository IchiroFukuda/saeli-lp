// 「あの子への手紙」用の薄いanalyticsラッパー。
// PostHog（プロダクト分析）+ gtag（広告連携）を併用。
// イベント名と属性は安定にしたいので、ここで一元管理する。

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, any>) => void;
      flush?: () => void;
      __loaded?: boolean;
    };
    gtag?: (...args: any[]) => void;
  }
}

export function trackLetters(event: string, props?: Props) {
  if (typeof window === "undefined") return;

  // PostHog
  try {
    if (window.posthog?.__loaded) {
      window.posthog.capture(event, props);
    }
  } catch {}

  // gtag
  try {
    if (window.gtag) {
      window.gtag("event", event, props ?? {});
    }
  } catch {}
}
