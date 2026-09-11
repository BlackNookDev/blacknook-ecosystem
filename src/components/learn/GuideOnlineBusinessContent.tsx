'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Code2,
  Lightbulb,
  Megaphone,
  Package,
  PenLine,
  Rocket,
  Store,
  Users,
} from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { duration, easePremium } from '@/components/motion/tokens';

const TOC = [
  { id: 'nedir', label: 'Online işletme nedir?' },
  { id: 'adimlar', label: '6 adımda başlamak' },
  { id: 'fikirler', label: '4 iş modeli' },
  { id: 'saas', label: 'SaaS / yazılım ürünü' },
  { id: 'ipuclari', label: 'Ekstra ipuçları' },
];

const STEPS = [
  {
    title: 'İş fikrini keşfet',
    body: 'İlgi alanların ile güçlü yönlerinin kesiştiği noktayı bul. Satabileceğin bir beceri, öğretebileceğin bir niş veya çözebileceğin net bir problem seç—önce bunu netleştir, sonra ürün ve pazarlamaya geç.',
  },
  {
    title: 'MVP oluştur',
    body: 'Fikri karmaşıklaştırma. Gerçek bir ihtiyacı karşılıyorsan detaylar sonra gelir. Amacın kavramı kanıtlamak: bir hafta sonu çıkarabileceğin en sade ürün veya hizmetle satışa çık.',
  },
  {
    title: 'İlk müşteriyi bul',
    body: 'Aile ve yakın dostlar dışında, gerçek ihtiyacı olan kişilere sat. Erken talep kanıtı, büyüme için en sağlam sinyaldir.',
  },
  {
    title: 'Geri bildirimle rafine et',
    body: 'Seven, sevmeyen veya kayıtsız kalan herkesi dinle; ama her yorumu aynı ağırlıkta alma. Müşteri geri bildirimi ürününü heyecanla alınacak hale getirmenin en iyi yollarından biridir.',
  },
  {
    title: 'Yasal yapı ve finans',
    body: 'Şirket türünü, vergi yükümlülüklerini ve temel gider planını netleştir. Yan iş mi yoksa tam zamanlı mı ölçekleyeceğini baştan düşün.',
  },
  {
    title: 'Büyümeye devam et',
    body: 'Temel oturunca site, SEO, içerik, dağıtım ve teslimat süreçlerini iyileştir. Her işletmenin optimize edilecek bir alanı vardır.',
  },
];

const IDEAS = [
  {
    icon: PenLine,
    title: 'Danışmanlık, freelance veya koçluk',
    body: 'En kolay başlangıç: sen + zamanın. Yazılım, tasarım, içerik veya operasyon becerini hizmet olarak sat; şirketler tam zamanlı işe almadan uzmanlığa ihtiyaç duyar.',
  },
  {
    icon: Store,
    title: 'E-ticaret',
    body: 'Fiziksel veya dijital ürünleri online sat. Marka, lojistik ve keşfedilebilirlik kritiktir; dijital ürünlerde stok sınırı yoktur.',
  },
  {
    icon: Megaphone,
    title: 'İçerik üreticiliği',
    body: 'Bülten, YouTube, podcast veya blog ile niş bir kitle kur. Erişim arttıkça ürün, sponsorluk ve topluluk gelir modelleri açılır.',
  },
  {
    icon: Code2,
    title: 'Yazılım (SaaS) ürünü',
    body: 'Her işletme yazılım kullanır; fırsatlar hâlâ bol. Çekirdek özelliğe odaklan, erken kullanıcı topla, Blacknook gibi pazaryerleriyle lansmanı hızlandır.',
  },
];

const TIPS = [
  {
    icon: Lightbulb,
    title: 'Sorun çöz, fikir peşinde koşma',
    body: 'Dünyayı değiştirecek “büyük fikir” şart değil. Benzersiz beceri ve bilgini müşteri problemlerine bağlamak çoğu zaman yeterli.',
  },
  {
    icon: Package,
    title: 'Önce kanıtla, sonra ölçekle',
    body: 'MVP ve ilk satışlar olmadan markaya, reklam bütçesine veya ekstra özelliğe yatırım yapma.',
  },
  {
    icon: Users,
    title: 'Topluluk ve dağıtım',
    body: 'İlk kullanıcılar genelde soğuk reklamdan değil; niş topluluklar, kişisel ağ ve ekosistem listelerinden gelir.',
  },
  {
    icon: Rocket,
    title: 'Araç seçimini basitleştir',
    body: 'İşini büyütecek yazılımları tek yerden keşfetmek için Blacknook ekosistemini kullan; kurulum talebiyle hızlı başla.',
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

export default function GuideOnlineBusinessContent() {
  const reduce = useReducedMotion();

  return (
    <main className="relative bg-transparent">
      <section className="relative min-h-[48svh] overflow-hidden sm:min-h-[64svh]">
        <Image
          src="/learn/online-isletme-hero.png"
          alt="Online işletme çalışma masası"
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
            <h1 className="font-display text-[clamp(1.65rem,6vw,3.25rem)] font-bold leading-[1.12] tracking-tight text-white">
              Online işletme nasıl başlatılır
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 sm:mt-5 sm:text-base">
              Freelance, e-ticaret, içerik ve SaaS modellerine odaklanarak online iş kurmanın
              pratik adımlarını özetler. Blacknook ekosistemindeki geliştiriciler ve erken aşama
              girişimler için sadeleştirilmiştir.
            </p>
            <ul className="mt-5 hidden space-y-2 text-sm text-zinc-300 sm:mt-6 sm:block">
              <li className="flex gap-2">
                <span className="text-emerald-400" aria-hidden>
                  ✓
                </span>
                Bugün başlayabileceğin 4 online iş modeli
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400" aria-hidden>
                  ✓
                </span>
                6 adımlık yüksek seviye yol haritası
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400" aria-hidden>
                  ✓
                </span>
                SaaS lansmanı ve ekosistem dağıtımı için pratik notlar
              </li>
            </ul>
          </m.div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            İçindekiler
          </p>
          <nav
            aria-label="İçindekiler"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-zinc-400 transition-colors hover:border-white/15 hover:text-zinc-200 lg:rounded-lg lg:border-transparent lg:bg-transparent lg:px-2.5 lg:py-1.5 lg:hover:bg-white/[0.04]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl space-y-16">
          <section id="nedir" className="scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Online işletme nedir?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Bu rehberde online işletmeyi; hizmet veya ürününü <strong className="font-medium text-zinc-200">dijital
              kanallar üzerinden teslim eden</strong> yapılar olarak tanımlıyoruz: e-ticaret, içerik
              markaları, SaaS ve online kurslar. Yalnızca vitrin sitesi olup ürününü yüz yüze
              satan işletmeler bu kapsama girmez.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-zinc-100">Online işletme</h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                  <li>• Düşük başlangıç ve işletme maliyeti</li>
                  <li>• Dünya çapında satış potansiyeli</li>
                  <li>• Esnek / 7-24 çalışma imkânı</li>
                  <li>• Dijital ürünlerde ölçeklenebilirlik</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-zinc-100">Fiziksel işletme</h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                  <li>• Yüksek kira ve sabit giderler</li>
                  <li>• Daha çok yerel müşteri odağı</li>
                  <li>• Sabit çalışma saatleri</li>
                  <li>• Ürünü yerinde deneyimleme avantajı</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="adimlar" className="scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              6 adımda online işletme
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Modele özel detaylara girmeden önce yüksek seviye çerçeve:
            </p>

            <GuideImage
              src="/learn/online-isletme-steps.png"
              alt="Online işletme yol haritası notları"
              caption="Fikir → MVP → ilk müşteri → geri bildirim → yasal yapı → büyüme."
            />

            <ol className="mt-8 space-y-5">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-zinc-50">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="fikirler" className="scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Bugün başlayabileceğin 4 model
            </h2>

            <GuideImage
              src="/learn/online-isletme-models.png"
              alt="Freelance, e-ticaret, içerik ve yazılım modelleri"
              caption="Danışmanlık, e-ticaret, içerik üreticiliği ve SaaS — dört pratik başlangıç modeli."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {IDEAS.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <Icon className="h-4 w-4 text-zinc-200" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="font-display text-base font-semibold text-zinc-50">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="saas" className="scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Yazılım / SaaS ürünü nasıl lansmanlanır?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Blacknook’un odaklandığı model budur: bağımsız geliştiriciler ve indie hacker’lar
              ürünlerini pazara sunar; alıcılar yeni araçlara tek noktadan erişir.
            </p>

            <GuideImage
              src="/learn/online-isletme-saas.png"
              alt="SaaS ürün lansmanı çalışma ortamı"
              caption="Çekirdek özellik, erken kullanıcı ve ekosistem dağıtımı ile lansmanı hızlandırın."
            />

            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-zinc-400">
              <li>
                <strong className="font-medium text-zinc-200">Çekirdek özellik:</strong> Tek net
                problemi çözen MVP ile çık; “her şeyi yapan” ürün ertele.
              </li>
              <li>
                <strong className="font-medium text-zinc-200">Erken kullanıcı:</strong> Niş
                topluluklar, mevcut ağın ve ekosistem listeleri ilk müşteri için en hızlı yoldur.
              </li>
              <li>
                <strong className="font-medium text-zinc-200">Doğrulama:</strong> Satış + geri
                bildirim döngüsü; fiyat ve konumlandırmayı buna göre güncelle.
              </li>
              <li>
                <strong className="font-medium text-zinc-200">Dağıtım:</strong>{' '}
                <Link href="/services" className="text-sky-400 hover:text-sky-300">
                  Blacknook ekosistemi
                </Link>{' '}
                üzerinden görünürlük ve yönetilen kurulum talebi ile büyümeyi hızlandır.
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.07] p-6">
              <h3 className="font-display text-lg font-semibold text-white">
                Blacknook ile bir sonraki adım
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Ajan kataloğunu keşfedin veya Kurulum Talep Et ile onboarding başlatın.
              </p>
              <Link
                href="/services"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Ekosistemi keşfet
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </section>

          <section id="ipuclari" className="scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Bonus ipuçları
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {TIPS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-white/[0.08] p-5">
                  <Icon className="mb-3 h-5 w-5 text-zinc-300" strokeWidth={1.75} aria-hidden />
                  <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-white">Bugün başla</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
              Vizyonun varsa ve işin içine gireceksen, online iş kurmak için daha iyi bir zaman yok.
              Blacknook, ürününü pazara çıkarmak ve doğru araçları bulmak için burada.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Kayıt ol
              </Link>
              <Link
                href="/learn/creator-economy"
                className="inline-flex rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/[0.06]"
              >
                İçerik üreticileri rehberi
              </Link>
              <Link
                href="/about"
                className="inline-flex rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/[0.06]"
              >
                Hakkımızda
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
