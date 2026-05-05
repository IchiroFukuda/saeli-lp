import React from "react";

const faqItems = [
  {
    q: "ペットロスはいつまで続きますか？",
    a: "個人差が非常に大きく、数週間で日常を取り戻す方もいれば、1年以上深い悲しみが続く方もいます。「何ヶ月で終わる」と決まったゴールはありません。大切なのは、悲しみの感情を否定せず、自分のペースで向き合うことです。半年、1年経っても日常生活に大きな支障が出ている場合は、専門家への相談を検討してください。",
  },
  {
    q: "ペットロスは「症候群」と呼ばれますが、病気ですか？",
    a: "ペットロスは病気そのものではなく、大切な存在を失ったことで起こる正常な悲嘆反応（グリーフ）です。ただし、強い抑うつ状態や身体症状（不眠、食欲不振など）が長期間続く場合は「複雑性悲嘆」と呼ばれる状態に至ることがあり、その場合は心療内科やカウンセリングなどの専門的なサポートが助けになります。",
  },
  {
    q: "周りに理解されないのが辛いです",
    a: "「たかがペット」と言われたり、悲しみを軽く扱われたりして、一人で抱え込んでしまう方は少なくありません。ペットは家族であり、愛する存在を失った悲しみは人を失った悲しみと変わりません。同じ経験をした人と繋がれるオンラインコミュニティや、ペットロス専門のカウンセラーに頼ることも選択肢です。あなたの悲しみは、ちゃんと意味のあるものです。",
  },
  {
    q: "あの子の写真や持ち物を見るのが辛い時、片付けるべき？",
    a: "急いで処分する必要はありません。むしろ、無理に片付けると後悔することが多いです。まずは見える場所に置いておき、見るのが辛い時は布で覆うなど、距離を調整するだけで十分。心が落ち着いてから、少しずつ整理していけば大丈夫です。あの子を思い出せるものを残すことは、悲しみを抱える上で大切なよりどころになります。",
  },
  {
    q: "新しいペットを迎えるべきか迷っています",
    a: "新しい家族を迎えるかどうかは、完全に個人の自由です。「あの子の代わりは作れない」と感じる方もいれば、「また誰かを愛したい」と感じる方もいます。どちらも正しい感情です。ただし、悲しみの真っ只中で衝動的に決めるのではなく、自分の気持ちが落ち着いてから判断することをおすすめします。",
  },
  {
    q: "自分を責める気持ちが消えません",
    a: "「もっと早く病院に連れて行けば」「あの時こうしていれば」という後悔は、ペットを深く愛していた証です。しかし、あなたは精一杯のことをしました。あの子もそれを知っています。後悔の感情は時間とともに、感謝や愛情へと形を変えていきます。今は自分を責めるより、あの子と過ごせた時間を温かく思い出してあげてください。",
  },
  {
    q: "子供がペットロスで落ち込んでいます",
    a: "子供にとってペットの死は、初めて経験する大切な存在の喪失かもしれません。「天国でいつでも見守ってくれているよ」という曖昧な励ましより、「悲しいよね、一緒に泣いていいんだよ」と感情を一緒に受け止めることが大切です。お別れの儀式（お墓を作る、絵を描くなど）を通して、子供なりの整理を手伝ってあげてください。",
  },
  {
    q: "ペットロスを乗り越えるとはどういうことですか？",
    a: "「乗り越える」とは、悲しみを忘れることではありません。あの子を愛し続けながら、自分の人生を歩み続けられるようになることです。深い悲しみが、温かい思い出に変わっていく——それがペットロスの「受容」の段階です。あの子は心の中でずっと一緒にいてくれます。",
  },
];

const stageDetails = [
  {
    name: "否認",
    duration: "数日〜数週間",
    description:
      "「あの子が亡くなった」という事実を、心がまだ受け止められない時期です。頭では理解していても、感情が追いつかない。「いつもの場所に食器を置いてしまう」「散歩の時間になると無意識に立ち上がる」「夢に出てきて、起きた瞬間にまた失う」——これらはすべて、否認の段階の典型的な反応です。\n\nこの段階は、心が一度に大きすぎる悲しみを処理しないように、自分を守っている時期です。「現実逃避」ではなく、心の防衛反応として大切な役割を持っています。無理に「もういないんだ」と言い聞かせる必要はありません。",
  },
  {
    name: "怒り",
    duration: "数週間〜数ヶ月",
    description:
      "「なぜあの子が」「もっと早く病院に連れて行けば」「あの獣医さんが」——やり場のない怒りが、自分や周囲、運命に向けられる時期です。怒りは時に冷静さを欠いた言動を引き起こし、後で自己嫌悪に陥ることもあります。\n\nですが、怒りの裏側にあるのは、深い愛情と無力感です。あの子を救えなかったこと、もっとしてあげられたかもしれないこと——その思いが怒りという形で出てくるのです。怒りを抑え込まず、信頼できる人に話したり、文字に書き出したりして、少しずつ手放していきましょう。",
  },
  {
    name: "取引",
    duration: "数週間〜数ヶ月",
    description:
      "「もう一度だけ会えるなら何でもする」「もし、あの時こうしていれば」という後悔と願望が、頭の中で繰り返される時期です。「if」の世界に何度も戻ってしまい、過去をやり直したい気持ちで苦しくなります。\n\nこの段階は、現実を変えたいという必死の願いの表れです。あなたができたことは、もう全部やったのです。あの子は、最期までそばにいてくれたあなたに感謝しているはずです。「もしも」の世界ではなく、実際にあった温かい時間に、少しずつ目を向けていきましょう。",
  },
  {
    name: "抑うつ",
    duration: "数ヶ月〜半年以上",
    description:
      "深い悲しみと喪失感に包まれ、何も手につかなくなる時期です。食欲がなくなり、眠れず、楽しめていたことが楽しめない。あの子を思い出すたびに涙が止まらない。世界から色が消えたように感じる人もいます。\n\nこの段階は、本当の意味で「失った」という事実を受け止めている時期でもあります。深い悲しみは、深く愛した証です。焦って元気にならなくて大丈夫。心と体の声を聞いて、ゆっくり休んでください。ただし、症状が長期間続いたり、日常生活に支障が出る場合は、一人で抱え込まず専門家に相談しましょう。",
  },
  {
    name: "受容",
    duration: "数ヶ月〜数年（個人差あり）",
    description:
      "深い悲しみを経て、あの子と過ごせた時間に感謝できるようになる時期です。悲しみが消えるわけではなく、形が変わるのです。日常を少しずつ取り戻し、思い出すと涙が出るけれど、その涙の中に温かさが混ざるようになります。\n\n「受容」は、あの子を忘れることでも、悲しみを克服することでもありません。あの子を心の中に置きながら、自分の人生を続けていくこと。あの子は、あなたが幸せに生きることを、誰よりも願っています。あなたの心の中で、あの子はずっと一緒に歩んでくれます。",
  },
];

export default function PetLossArticle() {
  return (
    <article className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* ペットロスとは */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 leading-relaxed">
            ペットロスとは
          </h2>
          <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
            <p>
              ペットロスとは、大切な家族であるペットを失ったことによって起こる、深い悲しみや喪失感のことです。
              愛犬や愛猫だけでなく、うさぎ、鳥、ハムスターなど、種類を問わず、共に過ごした時間が長いほど、その喪失は深い悲しみを伴います。
            </p>
            <p>
              「たかが動物」と言われることもありますが、ペットは家族であり、毎日の暮らしを彩る大切な存在です。
              人を失った時と同じように、心と体に大きな影響を与えるのは自然なこと。
              眠れない、食欲がない、何もする気が起きない——これらはすべて、深く愛していた証拠です。
            </p>
            <p>
              ペットロスは、心理学者キューブラー・ロスが提唱した「死の受容の5段階」を応用すると、
              <strong>否認・怒り・取引・抑うつ・受容</strong>
              という段階を経て、少しずつ変化していくと言われています。
              ただし、すべての人が順番通りに進むわけではなく、行ったり来たり、複数の段階が同時に現れることもあります。
            </p>
          </div>
        </section>

        {/* 5段階の詳細 */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-8 leading-relaxed">
            ペットロスの5段階
          </h2>
          <div className="space-y-10">
            {stageDetails.map((stage, idx) => (
              <div key={stage.name}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-500 text-sm font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {stage.name}の段階
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mb-3 ml-11">
                  目安期間：{stage.duration}
                </p>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line ml-11">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 乗り越えるためにできること */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 leading-relaxed">
            ペットロスを乗り越えるためにできること
          </h2>
          <div className="space-y-6 text-stone-700 text-sm sm:text-base leading-relaxed">
            <div>
              <h3 className="font-bold mb-2 text-stone-900">
                1. 悲しみを否定しない
              </h3>
              <p>
                「いつまでも泣いていてはダメ」と自分を責めないでください。
                悲しみは、あの子を深く愛した証です。涙が出る時は、思い切り泣いていい。
                感情を抑え込むと、かえって長引きます。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-stone-900">
                2. 思い出を形にする
              </h3>
              <p>
                写真をアルバムにする、お墓やメモリアルコーナーを作る、絵を描く、手紙を書く——
                思い出を形にすることで、悲しみが少しずつ整理されていきます。
                「あの子を忘れる」のではなく、「あの子と過ごした時間を残す」ためのものです。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-stone-900">
                3. 同じ経験をした人と繋がる
              </h3>
              <p>
                周りに理解されない時、同じ経験をした人の言葉は何より救いになります。
                ペットロスのオンラインコミュニティ、SNS、専門のカウンセラーなど、
                話せる場所を見つけてみてください。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-stone-900">
                4. あの子との「会話」を続ける
              </h3>
              <p>
                心の中で話しかけたり、日記に語りかけたり——
                あの子との会話は、亡くなった後も続けられます。
                これは現実逃避ではなく、心の整理に役立つ大切な営みです。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-stone-900">
                5. 自分のペースで時間をかける
              </h3>
              <p>
                「いつまで悲しんでいるんだ」と自分を急かさないでください。
                ペットロスを乗り越えるのに、決まった時間はありません。
                数ヶ月で日常を取り戻す人もいれば、1年以上かかる人もいます。
                どれも正常な反応です。
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-8 leading-relaxed">
            よくある質問
          </h2>
          <div className="space-y-6">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border-b border-stone-200 pb-6 last:border-b-0">
                <h3 className="font-bold mb-3 text-stone-900 leading-relaxed">
                  Q. {item.q}
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 専門家相談の注意書き */}
        <section className="bg-stone-50 rounded-2xl p-6 text-sm text-stone-600 leading-relaxed">
          <p className="font-bold text-stone-800 mb-2">
            悲しみが長く続く時は専門家へ
          </p>
          <p>
            半年以上経っても日常生活に支障が出ている、強い抑うつ症状や不眠が続く、自分や他人を傷つけたくなる——
            このような場合は、心療内科やペットロス専門のカウンセラーに相談してください。
            一人で抱え込まないことが、一番大切です。
          </p>
        </section>
      </div>
    </article>
  );
}

// MARK: - 構造化データ（FAQ + Article）

export function PetLossStructuredData() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ペットロス診断 — あなたの心は今、どの段階？",
    description:
      "ペットロスの5段階を10問の質問で診断。否認・怒り・取引・抑うつ・受容、それぞれの段階の詳しい解説と乗り越え方を紹介します。",
    inLanguage: "ja-JP",
    publisher: {
      "@type": "Organization",
      name: "毎日あの子",
      url: "https://saeli.org",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://saeli.org/pet-loss",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
    </>
  );
}
