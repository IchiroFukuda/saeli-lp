"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Mail, Star } from "lucide-react";

const reviews = [
  {
    text: "It really feels like I'm connected with my beloved one. I almost cried.",
    author: "Woman, 30s",
    platform: "Translated from App Store review",
  },
  {
    text: "Even though I know it's fiction, it truly feels like a real correspondence.",
    author: "Woman, 60s",
    platform: "Translated from App Store review",
  },
];

export default function MainichiAnokoEnPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist-en", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "lp" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to register.");
      } else {
        setSubmitted(true);
        setEmail("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6EF] to-[#F5EFDF] text-stone-800">
      {/* Hero */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-32 overflow-hidden">
        <Image
          src="/images/mainichi-anoko/hero-sky.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6EF]/40 via-[#FAF6EF]/10 to-[#FAF6EF]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm mb-6 shadow-sm">
            <Mail className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-orange-600 tracking-widest mb-4 uppercase">
            Coming Soon · English Version
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-relaxed">
            A daily letter from
            <br />
            your beloved one
          </h1>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed mb-8">
            An AI letter app that gently walks with you through pet loss.
            <br />
            Bring your feelings to your beloved one, one letter at a time.
          </p>

          {/* Inline waitlist form */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6"
          >
            {submitted ? (
              <div className="text-center py-4">
                <Heart className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="font-bold text-stone-800 mb-1">Thank you.</p>
                <p className="text-sm text-stone-600">
                  We&apos;ll email you when we launch in English.
                </p>
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium text-stone-700 mb-3 text-left">
                  Join the waitlist
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-full border border-stone-200 focus:outline-none focus:border-orange-400 text-sm"
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    disabled={submitting || !email}
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {submitting ? "..." : "Join"}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-red-500 mt-3 text-left">{error}</p>
                )}
                <p className="text-xs text-stone-500 mt-3 text-left">
                  No spam. One email when we launch.
                </p>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white/40">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 leading-relaxed">
              We built this app for a mother
              <br />
              who was suffering from pet loss.
            </h2>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              So that the presence of her beloved one, living somewhere beyond,
              could still feel close to her.
              <br />
              So that she could always feel connected, in her heart.
              <br />
              We built this app with that wish.
            </p>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 leading-relaxed">
            What you can do with Mainichi Anoko
          </h2>
          <div className="grid gap-6 sm:gap-8">
            <FeatureRow
              title="A daily letter from your beloved one"
              body="Running across a field of flowers, making new friends, thinking of you and living gently. Every morning, you can hear how your beloved one is doing."
            />
            <FeatureRow
              title="Your replies are reflected in tomorrow's letter"
              body="When you write a reply with the feelings you want to share, they are quietly woven into the next day's letter. A slow correspondence, like a long-form conversation."
            />
            <FeatureRow
              title="One letter a day. A quiet moment, every day."
              body="Just one letter, each day. The small joy of knowing tomorrow's letter will come, gently lights up your daily life."
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-white/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 leading-relaxed">
            From our Japanese users
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm p-6 sm:p-7"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500">{r.platform}</span>
                </div>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base mb-4">
                  &ldquo;{r.text}&rdquo;
                </p>
                <p className="text-xs text-stone-500">— {r.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — waitlist form again */}
      <section className="bg-gradient-to-br from-orange-400 to-orange-500 py-20 text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-relaxed">
            Be the first to know
            <br />
            when we launch in English.
          </h2>
          <p className="text-white/90 mb-8">
            We&apos;re currently available in Japan. Drop your email and we&apos;ll let you know.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6"
          >
            {submitted ? (
              <div className="text-center py-4 text-stone-800">
                <Heart className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="font-bold mb-1">Thank you.</p>
                <p className="text-sm text-stone-600">
                  We&apos;ll email you when we launch in English.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-full border border-stone-200 focus:outline-none focus:border-orange-400 text-sm text-stone-800"
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    disabled={submitting || !email}
                    className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {submitting ? "..." : "Join"}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-red-200 mt-3 text-left">{error}</p>
                )}
              </>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center text-sm">
          <p className="font-bold text-white mb-2">Mainichi Anoko</p>
          <p className="mb-4 text-stone-400">
            A daily letter app for pet loss
          </p>
          <p className="text-xs text-stone-500">
            Operated by SAELI, LLC
            <br />
            Contact:{" "}
            <a
              href="mailto:hello@saeli.org"
              className="underline hover:text-stone-300"
            >
              hello@saeli.org
            </a>
          </p>
          <div className="mt-6 flex justify-center gap-4 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-300">
              日本語版
            </Link>
            <a
              href="https://saeli.org/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-300"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <h3 className="text-lg sm:text-xl font-bold mb-3 leading-relaxed">
        {title}
      </h3>
      <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
        {body}
      </p>
    </div>
  );
}
