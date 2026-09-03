'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Check,
  Mail,
  Megaphone,
  MessageSquare,
  Rocket,
  Shield,
  Users,
  X,
} from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { duration, easePremium } from '@/components/motion/tokens';

const BENEFITS = [
  {
    icon: Mail,
    title: 'Doğrudan keşif',
    body: 'Kataloğumuzdaki girişimci ve ekip alıcılarına ürününüzü görünür kılın.',
    note: 'Organik + öne çıkan yerleşimler',
  },
  {
    icon: Megaphone,
    title: 'Lansman desteği',
    body: 'Listeleme, plan yapısı ve kurulum mesajlarını birlikte netleştiririz.',
    note: 'Başvurudan yayına eşlik',
  },
  {
    icon: Users,
    title: 'Hedef kitle örtüşmesi',
    body: 'SaaS, otomasyon, CMS ve geliştirici araçları arayan profesyonellere ulaşın.',
    note: 'İş odaklı alıcılar',
  },
  {
    icon: MessageSquare,
    title: 'Gerçek kullanıcı geri bildirimi',
    body: 'Kurulum talepleri ve eşleşmelerle ürün yol haritanızı güçlendirin.',
    note: 'Doğrudan sinyal',
  },
  {
    icon: Shield,
    title: 'Güvenilir vitrin',
    body: 'Doğrulanmış sağlayıcı rozeti ve net ürün sayfalarıyla güven inşa edin.',
    note: 'Moderasyonlu hub',
  },
  {
    icon: Rocket,
    title: 'Büyüme kaldıraçı',
    body: 'Erken kullanıcı, görünürlük ve tekrar ziyaret için sürdürülebilir bir kanal.',
    note: 'Lansman sonrası devam',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Programı inceleyin',
    body: 'Blacknook partner programını okuyun; uygunluk kriterlerini kontrol edin.',
  },
  {
    n: '02',
    title: 'Ürün oluşturun',
    body: 'Tek formda ürün, medya, özellikler, fiyat ve hikayeyi doldurup incelemeye gönderin.',
  },
  {
    n: '03',
    title: 'Onay alın',
    body: 'Başvurunuz incelenir. Onay sonrası partner paneli açılır; ürün moderasyona düşer.',
  },
  {
    n: '04',
    title: 'Yayınlayın ve büyütün',
    body: 'Onaylanan ürün kataloğa girer. Yeni ürünler için aynı formu kullanırsınız.',
  },
];

const FIT = [
  'Çalışan, kullanıma hazır bir ürün',
  'Uzun vadeli destek ve güncelleme planı',
  'Girişimci / küçük ekip odaklı değer',
  'İncelemelere ve taleplere yanıt vermeye hazır olmak',
];

const NOT_FIT = [
  'Yalnızca “yakında” veya vaporware',
  'Destek planı olmayan tek seferlik denemeler',
  'Kısa vadeli nakit odaklı, ürüne bağlı olmayan teklifler',
  'İş aracı olmayan tüketici eğlence uygulamaları',
];

const FAQ = [
  {
    q: 'Listelemek ücretli mi?',
    a: 'Başvuru ücretsizdir. Gelir paylaşımı ve plan yapısı ürününüze göre birlikte belirlenir; peşin zorunlu maliyet yoktur.',
  },
  {
    q: 'Kimler başvurabilir?',
    a: 'Bağımsız geliştiriciler, indie ekipler ve erken aşama SaaS girişimleri. Çalışan bir ürün ve destek kapasitesi bekleriz.',
  },
  {
    q: 'Süreç ne kadar sürer?',
    a: 'Başvuru incelemesi ve liste hazırlığı ürün olgunluğuna göre değişir. Onay sonrası yayın takvimi birlikte planlanır.',
  },
  {
    q: 'Ömür boyu lisans zorunlu mu?',
    a: 'Hayır. Lifetime, yıllık veya kademeli planlar mümkün. Size uygun yapıyı plan tablosunda tanımlarsınız.',
  },
];

export default function SellContent() {
  const reduce = useReducedMotion();

  return (
    <main className="relative bg-transparent">
      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:pb-24 sm:pt-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bn-bg,#161618)] to-transparent" />
        </div>

        <m.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.scene, ease: easePremium }}
        >
          <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-zinc-900/80 shadow-lg">
            <Image
              src="/bn-mark.png"
              alt="Blacknook"
              width={28}
              height={28}
              className="h-7 w-7 object-contain brightness-0 invert"
              priority
            />
          </div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Blacknook · Partner
          </p>
          <h1 className="font-display text-[clamp(2.1rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white">
            Yazılımınızı doğru kitleye
            <span className="mt-1 block text-zinc-400">sunun. Peşin maliyet yok.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg">
            Blacknook, ürününüze odaklanmanız için görünürlük ve lansman kanalı sağlar. Kazandığınızda
            birlikte kazanırız.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/developers/apply"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              Geliştirici ol
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="#nasil-calisir"
              className="inline-flex h-12 items-center rounded-xl border border-white/15 bg-white/[0.03] px-6 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/[0.07]"
            >
              Nasıl çalışır?
            </a>
          </div>
          <p className="mt-5 text-sm text-zinc-600">
            Zaten başvurdunuz mu?{' '}
            <Link
              href="/developers/status"
              className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
            >
              Başvuru durumu
            </Link>
            {' · '}
            <Link
              href="/partners/overview"
              className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
            >
              Geliştirici paneli
            </Link>
          </p>
        </m.div>
      </section>

      <m.section
        className="border-y border-white/[0.06] bg-white/[0.02] px-6 py-10"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3">
          {[
            { k: 'Moderasyonlu', v: 'Kalite odaklı hub' },
            { k: 'Ücretsiz başvuru', v: 'Peşin listeleme ücreti yok' },
            { k: 'Plan esnekliği', v: 'Lifetime, yıllık veya kademeli' },
          ].map((item) => (
            <div key={item.k} className="text-center">
              <p className="font-display text-lg font-semibold text-white">{item.k}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.v}</p>
            </div>
          ))}
        </div>
      </m.section>

      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sizin için büyüme kanalı
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-500 sm:text-base">
            Pazarlama motorunu Blacknook üstlenir; siz ürünü ve müşteri deneyimini güçlendirirsiniz.
          </p>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.title}>
                  <Icon className="h-5 w-5 text-zinc-400" strokeWidth={1.75} aria-hidden />
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{b.body}</p>
                  <p className="mt-3 text-xs font-medium text-zinc-600">{b.note}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="nasil-calisir" className="scroll-mt-24 border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Başvurudan gelire dört adım
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-zinc-500 sm:text-base">
            Seçiciyiz. Bu yüzden hub’daki her ürün değer taşır.
          </p>
          <ol className="mt-14 space-y-0">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                className="grid gap-4 border-t border-white/[0.06] py-8 sm:grid-cols-[5rem_1fr] sm:gap-10"
              >
                <span className="font-display text-2xl font-bold tabular-nums text-zinc-600">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">{step.body}</p>
                  {i === 1 ? (
                    <p className="mt-3 text-xs text-zinc-600">Tek form · /partners/self-submission</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ciddi yazılım ekipleri arıyoruz
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-500 sm:text-base">
            Her başvuruyu işlevsellik, istikrar, pazar uyumu ve topluluk değeri üzerinden değerlendiririz.
          </p>
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400/90">
                Uygun
              </h3>
              <ul className="space-y-4">
                {FIT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-rose-400/90">
                Uygun değil
              </h3>
              <ul className="space-y-4">
                {NOT_FIT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/80" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sık sorulanlar
          </h2>
          <dl className="mt-12 space-y-8">
            {FAQ.map((item) => (
              <div key={item.q} className="border-t border-white/[0.06] pt-8 first:border-t-0 first:pt-0">
                <dt className="font-display text-lg font-semibold text-white">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-500">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <m.section
        className="relative overflow-hidden border-t border-white/[0.06] px-6 py-20 sm:py-28"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: easePremium }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(255,255,255,0.06),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sonraki kullanıcılarınıza ulaşmaya hazır mısınız?
          </h2>
          <p className="mt-4 text-sm text-zinc-500 sm:text-base">
            Başvuru yaklaşık birkaç dakika sürer. Ücretsizdir; peşin maliyet yoktur.
          </p>
          <Link
            href="/developers/apply"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Geliştirici ol
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="mt-5 text-sm text-zinc-600">
            Özel lansman mı arıyorsunuz?{' '}
            <Link href="/select" className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200">
              Blacknook Select programı
            </Link>
            {' · '}
            <Link
              href="/developers/status"
              className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
            >
              Başvuru durumu
            </Link>
            {' · '}
            <Link
              href="/partners/overview"
              className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
            >
              Geliştirici paneli
            </Link>
          </p>
        </div>
      </m.section>
    </main>
  );
}
