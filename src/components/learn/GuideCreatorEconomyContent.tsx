'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Mail,
  Megaphone,
  Package,
  Radio,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { duration, easePremium } from '@/components/motion/tokens';

const TOC = [
  { id: 'nedir', label: 'Creator economy nedir?' },
  { id: 'baslamak', label: 'Nasıl başlanır?' },
  { id: 'platformlar', label: 'Platform seçimi' },
  { id: 'rutin', label: 'Yayın rutini' },
  { id: 'gelir', label: 'Gelir modelleri' },
  { id: 'markalar', label: 'Marka iş birlikleri' },
  { id: 'gelecek', label: '2026 ve sonrası' },
  { id: 'araclar', label: 'Araç önerileri' },
];

const LEARN_OUTCOMES = [
  'Creator economy’nin nasıl işlediğini ve kimleri kapsadığını',
  'Niş seçimi ve “1.000 gerçek hayran” yaklaşımını',
  'Sahip olunan vs ödünç alınan platform farkını',
  'Affiliate, dijital ürün, abonelik ve sponsorluk modellerini',
  'Markalarla çalışırken netleştirmen gereken noktaları',
  'Blacknook ekosistemindeki araçlarla üretimi hızlandırmayı',
];

const CREATOR_TYPES = [
  'Kısa video üreticileri (TikTok, Reels, Shorts)',
  'Uzun form YouTuber’lar ve eğitim kanalı sahipleri',
  'Bülten yazarları ve bağımsız blogcular',
  'Podcast yayıncıları',
  'Twitch / canlı yayıncılar',
  'LinkedIn’de uzman içerik üreten profesyoneller',
  'Şablon, kurs veya mikro-SaaS satan indie üreticiler',
];

const NICHE_QUESTIONS = [
  'Bütün gün konuşabileceğim konular hangileri?',
  'Arkadaşlarım benden sıkça neyi çözmemi veya anlatmamı ister?',
  'Başkalarının zorlandığı ama benim doğal bulduğum beceriler neler?',
  'Düzenli öğrendiğim / takipdiğim konular hangileri?',
  'Hangi nişte “ortalama içerik” yerine derin deneyim sunabilirim?',
];

const PLATFORMS = [
  {
    name: 'YouTube',
    fit: 'Derin anlatım, tutorial, ürün sunumu',
    pros: ['Platform içi reklam geliri', 'Arama ile evergreen keşif', 'Kendi listenize dönüşüm'],
    cons: ['Yüksek üretim yükü', 'Ekipman ve montaj öğrenme eğrisi'],
  },
  {
    name: 'Bülten / e-posta',
    fit: 'Sahip olunan kitle, yüksek dönüşüm',
    pros: ['Algoritmaya bağımlı değil', 'Ürün ve sponsorluk satışı güçlü', 'Kalite > miktar'],
    cons: ['Liste büyütmek zaman alır', 'İlk abone kaynağı gerekir'],
  },
  {
    name: 'LinkedIn',
    fit: 'B2B, kariyer, SaaS, freelancer',
    pros: ['Yüksek satın alma gücü', 'Haftada 2–3 post yeterli olabilir', 'Ağ etkisi'],
    cons: ['Günlük kullanım düşük olabilir', 'Niş dışı kitleye hitap etmek zor'],
  },
  {
    name: 'Kısa video',
    fit: 'Hızlı keşif, marka farkındalığı',
    pros: ['Yeni hesaplar da büyüyebilir', 'Düşük giriş bariyeri', 'Trend yakalama'],
    cons: ['Dışarıya dönüşüm zor', 'Sık yayın ister', 'Ödünç platform riski'],
  },
  {
    name: 'Blog + SEO',
    fit: 'Uzun vadeli organik trafik',
    pros: ['Tek yazı yıllarca trafik getirebilir', 'Ürün sayfalarına doğrudan bağlanır'],
    cons: ['Sonuçlar aylar sürebilir', 'Teknik SEO öğrenimi'],
  },
  {
    name: 'Podcast',
    fit: 'Derin ilişki, uzman konumlandırma',
    pros: ['Dinleyici dikkat süresi yüksek', 'Kendi formatınızı siz belirlersiniz'],
    cons: ['Keşif için başka kanallar gerekir', 'Prodüksiyon disiplini'],
  },
];

const MONEY = [
  {
    icon: Megaphone,
    title: 'Affiliate / ortaklık satışları',
    body: 'Kullandığınız ve güvendiğiniz araçları özel link veya kodla önerin. Özellikle bülten, podcast ve niş YouTube’da güçlüdür. Komisyonlar ürüne göre %10–%40+ olabilir.',
    steps: [
      'Kitlenizin gerçekten ihtiyaç duyduğu markaları listeleyin',
      '“Marka + affiliate program” diye arayın veya partner formuna başvurun',
      'İçerikte dürüst bağlam kurun; sadece link yapıştırmayın',
      'Dönüşümü ölçün, en iyi ürünlere odaklanın',
    ],
  },
  {
    icon: Users,
    title: 'Abonelik ve özel topluluk',
    body: 'Ücretsiz içerikle güven oluşturun; ardından Q&A, şablonlar, kapalı sohbet veya erken erişim gibi ekstra değeri ücretli katmana taşıyın.',
    steps: [
      'Ücretsiz içerikle düzenli değer verin',
      'Kitlenin tekrar sorduğu problemleri not edin',
      'Tek net teklifle ücretli katmanı açın',
      'Ücretsiz + ücretli dengesini koruyun',
    ],
  },
  {
    icon: Package,
    title: 'Dijital ürünler',
    body: 'Kurs, şablon, checklist, Notion kitleri, e-kitap veya mikro araçlar. Stok yok, marj yüksek; niş bilgiyi ürünleştirmek creator economy’nin en sürdürülebilir yollarından biri.',
    steps: [
      'Anket veya yorumlardan ürün fikrini doğrulayın',
      'Tek sonucu vaat eden dar kapsam seçin',
      'Beta kullanıcıdan testimonial alın',
      'Landing + ekosistem listesiyle satışa çıkın',
    ],
  },
  {
    icon: Sparkles,
    title: 'Sponsorluk ve marka iş birliği',
    body: 'Medya kiti (kitleniz, niş, örnek içerik, fiyat aralığı) hazırlayın. Küçük ama bağlı kitle, büyük ama soğuk kitleden daha değerlidir.',
    steps: [
      'Medya kitinizi güncel tutun',
      'Markayla uyum ve açıklama (disclosure) kurallarını netleştirin',
      'Teslimat kapsamını sözleşmede yazın',
      'Tek seferlik işi uzun vadeli partnerliğe çevirmeye çalışın',
    ],
  },
];

const TOOL_GROUPS = [
  {
    icon: Video,
    title: 'Üretim',
    items: ['Kayıt: OBS, CapCut, Descript', 'Görsel: Figma, Canva', 'Ses: iyi bir dinamik mikrofon'],
  },
  {
    icon: Calendar,
    title: 'Planlama',
    items: ['İçerik takvimi (Notion / Sheets)', 'Tekrar kullanım: uzun → kısa → bülten', 'Batch kayıt günleri'],
  },
  {
    icon: Mail,
    title: 'Sahip olunan kanal',
    items: ['Bülten platformu', 'Basit site / landing', 'Analitik (kaynak + dönüşüm)'],
  },
  {
    icon: Radio,
    title: 'Blacknook ekosistemi',
    items: [
      'İş araçlarını ve ajanları kataloğumuzdan keşfedin',
      'Kurulum Talep Et ile yönetilen onboarding başlatın',
      'Departman panelinde (/agent) ajanları işletin',
    ],
  },
];

function GuideImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-10 overflow-hidden rounded-2xl border border-white/[0.08]">
      <div className="relative aspect-[16/9] w-full bg-zinc-900">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
      </div>
      {caption ? (
        <figcaption className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs text-zinc-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default function GuideCreatorEconomyContent() {
  const reduce = useReducedMotion();

  return (
    <main className="relative bg-transparent">
      <section className="relative min-h-[48svh] overflow-hidden sm:min-h-[64svh]">
        <Image
          src="/learn/creator-economy-hero.png"
          alt="İçerik üreticisi çalışma masası"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bn-bg,#161618)] via-black/65 to-black/40" />
        <div className="relative z-10 mx-auto flex min-h-[48svh] max-w-3xl flex-col justify-end px-4 pb-10 pt-28 sm:min-h-[64svh] sm:px-6 sm:pb-16 sm:pt-32">
          <m.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.scene, ease: easePremium }}
          >
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Rehber · Öğren
            </p>
            <h1 className="font-display text-[clamp(1.65rem,5.5vw,3.25rem)] font-bold leading-[1.2] tracking-tight text-white">
              Creator economy nedir?
            </h1>
            <p className="mt-3 max-w-xl text-base font-medium leading-snug text-zinc-300 sm:text-lg">
              Trendler, gelir modelleri ve pratik ipuçları
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 sm:mt-5 sm:text-base">
              Bağımsız üreticiler, bülten yazarları, eğitimciler ve mikro-SaaS kurucuları için
              Blacknook perspektifinden kapsamlı bir başlangıç rehberi.
            </p>
          </m.div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 pb-24">
        <m.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: easePremium, delay: 0.08 }}
        >
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Bu rehber; e-ticaret sahipleri, freelancer’lar, SaaS girişimcileri ve tam zamanlı içerik
            üreticilerinin gerçek büyüme yollarından yola çıkarak hazırlandı. Amaç: hype değil,
            uygulanabilir bir çerçeve vermek.
          </p>

          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
            <p className="text-sm font-semibold text-zinc-200">Bu rehberin sonunda şunları netleştireceksin:</p>
            <ul className="mt-3 space-y-2">
              {LEARN_OUTCOMES.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-zinc-500">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400/80" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="İçindekiler"
            className="mt-10 rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              İçindekiler
            </p>
            <ol className="mt-3 columns-1 gap-x-8 sm:columns-2">
              {TOC.map((item, i) => (
                <li key={item.id} className="mb-2 break-inside-avoid">
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    <span className="mr-2 tabular-nums text-zinc-600">{i + 1}.</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <section id="nedir" className="mt-16 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Creator economy nedir?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Creator economy; insanların önemsedikleri konularda düzenli içerik üreterek, bir niş
              kitle kurarak ve bu kitleyi çeşitli kanallarla gelir modeline çevirerek geçimlerini
              (veya yan gelirlerini) inşa ettiği büyüyen ekosistemdir.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              “Gig economy” anlık hizmet sunmayı anlatıyorsa, creator economy düzenli yayın + kitle +
              monetizasyon üçlüsünü anlatır. Birçok kişi “influencer” der; tanım aslında daha geniştir:
            </p>
            <ul className="mt-5 space-y-2">
              {CREATOR_TYPES.map((t) => (
                <li key={t} className="flex gap-2 text-sm text-zinc-400">
                  <span className="text-zinc-600">·</span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Kısaca: her platformda, her sektörde, her formatta üretici var. Blacknook açısından
              özellikle kritik olan kısım ise şu: içerik üreticileri yalnızca “reklam yüzü” değil;
              kendi dijital ürünlerini, şablonlarını ve yazılım araçlarını da pazarlayan bağımsız
              girişimciler haline geliyor.
            </p>

            <h3 className="mt-10 font-display text-xl font-semibold text-white">
              Nasıl buraya geldik?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              1990’ların sonu ve 2000’lerin başında web’in ilk üreticileri çoğunlukla bloglardı.
              Keşfedilebilirlik zordu; RSS, forum ve e-posta listeleriyle yayılıyordu. Facebook,
              YouTube ve Twitter gibi platformlar teknik bariyeri düşürdü. 2010’ların ortasından
              itibaren marka ortaklıkları normal bir gelir kalemi oldu. Son yıllarda kısa video
              keşfi hızlandırdı; ama başarı hâlâ tek bir uygulamaya bağlı değil.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Bugün on milyonlarca bağımsız üretici bu ekonomide yer alıyor. Kolektif dikkatleri,
              klasik medya şirketlerinin tek başına taşıdığından daha dağıtık ve çoğu zaman daha
              niş. İyi haber: hâlâ yer var — özellikle derin nişlerde ve B2B / yazılım alanında.
            </p>
          </section>

          <section id="baslamak" className="mt-16 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              İçerik üreticisi olarak nasıl başlanır?
            </h2>
            <h3 className="mt-8 font-display text-xl font-semibold text-white">
              1.000 gerçek hayran
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Kevin Kelly’nin klasik “1,000 True Fans” çerçevesi hâlâ geçerli: yılda size 100 birim
              ödeyen 1.000 gerçek hayran, sürdürülebilir bir gelir tabanı demektir. Milyonlarca
              takipçi şart değil. Gerekli olan; sizi bilinçli tercih eden, nişinizde güvenen bir
              çekirdek kitle.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Büyük stüdyolar geniş kitleye hitap etmek zorundadır çünkü prodüksiyon pahalıdır. Siz
              ise sevdiğiniz dar bir konuda uzmanlaşarak yaşayabilir bir iş kurabilirsiniz. “Nişte
              zenginlik vardır” klişesi, burada operasyonel bir gerçektir.
            </p>

            <h3 className="mt-8 font-display text-xl font-semibold text-white">Niş nasıl seçilir?</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              En iyi başlangıç: anlamlı bulduğunuz ve tekrar tekrar üretebileceğiniz konular. Şu
              sorularla daraltın:
            </p>
            <ul className="mt-4 space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              {NICHE_QUESTIONS.map((q) => (
                <li key={q} className="text-sm text-zinc-400">
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              “Gezegen üzerinde bunu önemseyen tek kişi benim” hissi çoğu zaman yanıltıcıdır.
              Spesifik konu, benzer düşünen insanları mıknatıs gibi çeker.
            </p>
          </section>

          <section id="platformlar" className="mt-16 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Doğru platformları seçmek
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Başlangıçta her yerde olmak zorunda değilsiniz. Bir ana yayın kanalı + bir sahip
              olunan kanal (çoğu zaman e-posta) yeterli bir iskelettir.
            </p>

            <div className="mt-6 rounded-2xl border border-teal-400/20 bg-teal-500/[0.06] p-5">
              <p className="text-sm font-semibold text-teal-100">İpucu: sahip olunan kanal kurun</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Sosyal hesaplar “ödünç”tür; platform kapanabilir, algoritma değişebilir, hesap
                kilitlenebilir. Vine’ı hatırlayın. Bülten, SMS veya kendi siteniz ise sizin
                varlığınızdır. Sosyal medyayı keşif hunisi, e-postayı ise eviniz gibi düşünün.
              </p>
            </div>

            <GuideImage
              src="/learn/creator-economy-platforms.png"
              alt="İçerik üretimi için kamera ve telefon kurulumu"
              caption="Keşif için sosyal / video kanalları; sadakat için sahip olunan platform."
            />

            <div className="mt-8 grid gap-4">
              {PLATFORMS.map((p) => (
                <article
                  key={p.name}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-white">{p.name}</h3>
                    <p className="text-xs text-zinc-500">{p.fit}</p>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400/80">
                        Artılar
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-zinc-500">
                        {p.pros.map((x) => (
                          <li key={x}>· {x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400/70">
                        Eksiler
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-zinc-500">
                        {p.cons.map((x) => (
                          <li key={x}>· {x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="rutin" className="mt-16 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Düzenli yayın rutini
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Creator economy’nin kalbi tutarlılıktır. En iyi üreticiler kalite ile miktarı bilinçli
              dengeler. James Clear’ın blogu, haftada iki kez “iyi ya da kötü, yayınla” disipliniyle
              büyümüştü: mükemmellikten önce tempo.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Genel kural: içerik ne kadar uzun ve yoğunsa, o kadar seyrek yayınlayabilirsiniz.
              2.000 kelimelik teknik yazı haftada bir olabilir; 15 saniyelik kısa video için çok daha
              sık tempo gerekir. Kendinize gerçekçi bir takvim seçin ve tutun.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-400">
              <li>· İçerik takvimi tutun (konu, format, kanal, durum)</li>
              <li>· Uzun formu kısa kliplere ve bültene parçalayın (repurposing)</li>
              <li>· “Batch” günleri ayırın: bir günde 4–5 taslak</li>
              <li>· Analitiği haftalık bakın; günlük takıntı üretimi öldürür</li>
            </ul>
          </section>

          <section id="gelir" className="mt-16 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Creator’lar online nasıl para kazanır?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Başta tek bir kanalı monetize etmek, her şeyi aynı anda denemekten daha sağlıklıdır.
              Kitle büyüdükçe modelleri katmanlayın.
            </p>

            <GuideImage
              src="/learn/creator-economy-monetize.png"
              alt="Dijital ürün ve bülten çalışması için laptop"
              caption="Gelir: affiliate, abonelik, dijital ürün ve sponsorluk katmanları."
            />

            <div className="mt-8 space-y-5">
              {MONEY.map(({ icon: Icon, title, body, steps }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 sm:p-6"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <Icon className="h-4 w-4 text-zinc-200" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
                  <ol className="mt-4 space-y-2">
                    {steps.map((s, i) => (
                      <li key={s} className="flex gap-3 text-sm text-zinc-400">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-zinc-300">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Fiziksel merch (tişört, sticker) kişisel markalar için bağ kurar; nakit sıkıysa stok
              tutmadan print-on-demand tercih edin. Yazılım üreticileri için ise doğal adım mikro
              araç veya şablon satmak — tam da Blacknook’un güçlendirdiği alan.
            </p>
          </section>

          <section id="markalar" className="mt-16 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Markalar ve pazarlamacılarla çalışmak
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Sponsorluk “ücret karşılığı içerik” değildir yalnızca; kitlenizin güvenini kiralamaktır.
              Uyumsuz ürün önermek uzun vadede daha pahalıya patlar.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-400">
              <li>
                <strong className="font-medium text-zinc-200">Medya kiti:</strong> niş, demografik
                özet, örnek içerikler, geçmiş iş birlikleri, paket fiyatları.
              </li>
              <li>
                <strong className="font-medium text-zinc-200">Sözleşme:</strong> teslimat adedi,
                revizyon hakkı, kullanım süresi, ödeme tarihi, exclusivity.
              </li>
              <li>
                <strong className="font-medium text-zinc-200">Şeffaflık:</strong> reklam / iş birliği
                olduğunu açıkça belirtin (yasal ve etik zorunluluk).
              </li>
              <li>
                <strong className="font-medium text-zinc-200">Ölçüm:</strong> tıklama, kayıt, kupon
                kullanımı — markanın anlayacağı metrikleri önceden konuşun.
              </li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Uzun oyun: tek seferlik sponsorluk yerine, ürünü gerçekten kullandığınız markalarla
              sürekli affiliate veya elçi ilişkisi kurmak genelde daha sağlıklıdır.
            </p>
          </section>

          <section id="gelecek" className="mt-16 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              2026 ve sonrası: ne değişiyor?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Kısa video keşfi güçlü kalacak; ama platform riski arttıkça sahip olunan kanallar ve
              kendi ürünleri daha kritik. Yapay zekâ üretimi hızlandırıyor — ayırt edici olan ise
              deneyim, kürasyon ve güven. B2B creator’lar (özellikle yazılım, no-code, otomasyon)
              büyümeye devam ediyor: şirketler “eğiten ve gösteren” üreticilerden satın alıyor.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Blacknook’un iddiası da burada kesişiyor: içerik + ürün. Kitle kuran üreticiler dijital
              araç satıyor; araç üreten ekipler ise creator kanallarıyla dağıtım buluyor.
            </p>
          </section>

          <section id="araclar" className="mt-16 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Başlangıç için araç önerileri
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Araç yığını şişmesin. Üretim, planlama ve sahip olunan kanal üçlüsüyle başlayın; iş
              yazılımı ihtiyacınız büyüdükçe Blacknook kataloğundan ekleyin.
            </p>

            <GuideImage
              src="/learn/creator-economy-tools.png"
              alt="Yazılım ve içerik üretimi için çalışma alanı"
              caption="Araçlar üretimi hızlandırır; niş ve rutin ise işi büyütür."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {TOOL_GROUPS.map(({ icon: Icon, title, items }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <Icon className="h-4 w-4 text-zinc-200" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">{title}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-zinc-500">
                    {items.map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold text-white">
                Blacknook ile sonraki adım
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                İşinizi büyütecek yazılımları keşfedin veya kendi dijital ürününüzü ekosistemde
                listeleyin. Online işletme kurma rehberimizle birlikte okuyun.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
                >
                  Ekosistemi keşfet
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/learn/online-isletme"
                  className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
                >
                  Online işletme rehberi
                </Link>
                <Link
                  href="/agent"
                  className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
                >
                  Departman paneli
                </Link>
              </div>
            </div>
          </section>

          <aside className="mt-14 rounded-2xl border border-white/[0.08] bg-zinc-950/50 p-5 text-sm text-zinc-500">
            <p className="font-semibold text-zinc-300">TL;DR</p>
            <p className="mt-2 leading-relaxed">
              Niş seç → bir ana kanal + sahip olunan liste kur → düzenli yayınla → tek gelir
              modeliyle başla → güveni bozmadan ölçekle. Creator economy bir takipçi yarışı değil;
              değer üreten bir iş kurma biçimidir.
            </p>
          </aside>
        </m.div>
      </div>
    </main>
  );
}
