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
      if (process.env.NODE_ENV === "development") {
        console.log("PostHog already initialized and loaded");
      }
      initRef.current = true;
      return;
    }

    // captureメソッドは存在するが、まだ初期化が完了していない場合
    // 既にinit()が呼ばれている可能性があるので、初期化完了を待つか再初期化
    if (posthog && typeof posthog.capture === 'function' && !(posthog as any).__loaded) {
      if (process.env.NODE_ENV === "development") {
        console.log("PostHog capture exists but not loaded yet, attempting to reinitialize...", {
          has_capture: typeof posthog.capture === 'function',
          loaded: (posthog as any).__loaded,
          config: (posthog as any).config
        });
      }
      
      // 初期化を再試行（既存の初期化が失敗している可能性がある）
      // PostHogは既に初期化されている場合、init()を再度呼び出しても問題ない
      isInitializing = false;
      // 次の処理で初期化が実行されるようにする
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
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog initialized successfully", {
              has_capture: typeof posthogInstance.capture === 'function',
              api_host: posthogHost,
              key_set: !!posthogKey,
              loaded: (posthogInstance as any).__loaded,
              config: (posthogInstance as any).config
            });
          }
          // カスタムイベントで初期化完了を通知
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('posthog:loaded'));
          }
        },
        capture_pageview: false, // 自動ページビューを無効化（手動で送信するため）
        capture_pageleave: false,
        autocapture: false, // 自動キャプチャを無効化
        disable_session_recording: true, // セッション録画を無効化
        persistence: 'localStorage+cookie', // 永続化方法を明示
      });
      
      // 初期化が即座に完了した場合（既に初期化済みの場合）
      // loadedコールバックが呼ばれない可能性があるので、少し待ってから確認
      setTimeout(() => {
        if ((posthog as any).__loaded === true && !isInitialized) {
          isInitialized = true;
          isInitializing = false;
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog was already initialized");
          }
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
