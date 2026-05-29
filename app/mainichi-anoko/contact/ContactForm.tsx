"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [supportId, setSupportId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    const composedMessage = supportId.trim()
      ? `お問い合わせ番号: ${supportId.trim()}\n\n${message}`
      : message;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: composedMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "送信に失敗しました。");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSupportId("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "送信に失敗しました。",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <h2 className="text-xl font-semibold text-stone-800">
          お問い合わせを受け付けました
        </h2>
        <p className="mt-3 text-stone-700 leading-loose">
          ご連絡ありがとうございます。内容を確認のうえ、通常2〜5営業日以内にご返信いたします。
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-800 px-6 py-2 text-sm font-medium text-white hover:bg-stone-700 transition"
        >
          もう一度お問い合わせする
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field
        label="お名前"
        required
        htmlFor="contact-name"
      >
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
          autoComplete="name"
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400/30 disabled:bg-stone-100"
          placeholder="山田 太郎"
        />
      </Field>

      <Field
        label="メールアドレス"
        required
        htmlFor="contact-email"
      >
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          autoComplete="email"
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400/30 disabled:bg-stone-100"
          placeholder="you@example.com"
        />
      </Field>

      <Field
        label="お問い合わせ番号"
        htmlFor="contact-support-id"
        hint="アプリの「設定」→「お問い合わせ番号」をお持ちの方はご入力ください（任意）"
      >
        <input
          id="contact-support-id"
          type="text"
          value={supportId}
          onChange={(e) => setSupportId(e.target.value)}
          disabled={submitting}
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 font-mono text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400/30 disabled:bg-stone-100"
          placeholder="例: 1a2b3c4d-..."
        />
      </Field>

      <Field
        label="お問い合わせ内容"
        required
        htmlFor="contact-message"
      >
        <textarea
          id="contact-message"
          required
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400/30 disabled:bg-stone-100 resize-y"
          placeholder="お問い合わせ内容をご記入ください"
        />
      </Field>

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-stone-800 px-6 py-3 text-base font-medium text-white hover:bg-stone-700 transition disabled:bg-stone-400 disabled:cursor-not-allowed"
      >
        {submitting ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-stone-700"
      >
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
