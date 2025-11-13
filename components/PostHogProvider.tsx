"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

// グローバルな初期化フラグ（React Strict Modeでの重複初期化を防ぐ）
let isInitializing = false;
let isInitialized = false;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const initRef = useRef(false);

  useEffect(() => {
    // 既にこのコンポーネントで初期化済みの場合はスキップ
    if (initRef.current) return;
    
    // PostHogの初期化（環境変数から取得）
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

    if (!posthogKey) {
      console.warn("PostHog key is not set. Please set NEXT_PUBLIC_POSTHOG_KEY environment variable.");
      return;
    }

    if (typeof window === "undefined") return;

    // 既に初期化が完了している場合はスキップ（__loadedフラグも確認）
    const isFullyLoaded = posthog && 
      typeof posthog.capture === 'function' && 
      (posthog as any).__loaded === true;
    
    if (isInitialized && isFullyLoaded) {
      initRef.current = true;
      return;
    }

    // captureメソッドは存在するが、まだ初期化が完了していない場合
    // 既にinit()が呼ばれている可能性があるので、初期化を再試行
    if (posthog && typeof posthog.capture === 'function' && !(posthog as any).__loaded) {
      isInitializing = false;
    }

    // 初期化中の場合はスキップ
    if (isInitializing) {
      return;
    }

    isInitializing = true;
    initRef.current = true;

    try {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        loaded: (posthogInstance) => {
          isInitialized = true;
          isInitializing = false;
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('posthog:loaded'));
          }
        },
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: false,
        disable_session_recording: true,
        persistence: 'localStorage+cookie',
      });
      
      // 初期化が即座に完了した場合（既に初期化済みの場合）
      setTimeout(() => {
        if ((posthog as any).__loaded === true && !isInitialized) {
          isInitialized = true;
          isInitializing = false;
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('posthog:loaded'));
          }
        }
      }, 500);
    } catch (error) {
      console.error("PostHog initialization error:", error);
      isInitializing = false;
    }
  }, []);

  return <>{children}</>;
}
