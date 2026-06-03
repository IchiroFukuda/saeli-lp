"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Mail, Star } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/app/id6760970361";

// 英語版Google Play掲載情報が未整備のため、英語LPではApp Storeのみ案内する。
function trackStoreClick(store: "app_store", location: string) {
  if (typeof window !== "undefined" && (window as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as { gtag: (...args: unknown[]) => void }).gtag("event", "store_click", {
      store,
      location,
    });
  }
}

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
          <div className="flex justify-center">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "hero")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Open in App Store
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
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
            What you can do with Still With Me
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

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-orange-400 to-orange-500 py-20 text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-relaxed">
            Start writing letters
            <br />
            with your beloved one.
          </h2>
          <p className="text-white/90 mb-8">
            Download Still With Me and begin today.
          </p>
          <div className="flex justify-center">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "footer")}
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Open in App Store
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center text-sm">
          <p className="font-bold text-white mb-2">Still With Me</p>
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
