'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { duration, easePremium } from '@/components/motion/tokens';

const DEPARTMENTS = [
  {
    title: 'Ürün & Mühendislik',
    body: 'Otonom paneli, kataloğu ve kurulum hattını birlikte büyütüyorsun.',
  },
  {
    title: 'Satış & Müşteri başarısı',
    body: 'Kurumsal onboarding ve müşteri ilişkilerini şekillendiriyorsun.',
  },
  {
    title: 'Tasarım',
    body: 'Marka, ürün arayüzü ve keşif deneyimini net, sakin bir görsel dilde tutuyorsun.',
  },
  {
    title: 'Operasyon & Destek',
    body: 'Kurulum taleplerinden destek e-postalarına kadar alıcı deneyimini güçlendiriyorsun.',
  },
];

const VALUES = [
  {
    title: 'Meraklı kal',
    body: 'Keşif bizi besler. Sorunları yeni fikir ve pratik denemelere çeviririz.',
  },
  {
    title: 'Dürüst büyü',
    body: 'Ekip olarak çalışır, birbirimizin kazanımlarını görünür kılarız. Gösteriş değil sonuç.',
  },
  {
    title: 'Sade tut',
    body: 'Gereksiz karmaşayı azaltırız. Ürün, metin ve süreçlerde netlik önceliklidir.',
  },
];

const PERKS = [
  {
    title: 'Esnek çalışma',
    body: 'Uzaktan veya hibrit. İyi işin çıkacağı düzeni birlikte kurarız.',
  },
  {
    title: 'Öğrenme bütçesi',
    body: 'Kurs, konferans ve kitap için yıllık destek.',
  },
  {
    title: 'Ekipman',
    body: 'Laptop ve çalışma alanını verimli kılacak temel donanım desteği.',
  },
  {
    title: 'Ürün erişimi',
    body: 'Blacknook ekosistemindeki araçlara erken ve iç görünürlük.',
  },
];

const OPENINGS = [
  {
    dept: 'Ürün & Mühendislik',
    title: 'Full-stack Developer',
    loc: 'Uzaktan · Türkiye',
  },
  {
    dept: 'Satış & Müşteri başarısı',
    title: 'Customer Success Associate',
    loc: 'İstanbul / Uzaktan',
  },
  {
    dept: 'Tasarım',
    title: 'Product Designer',
    loc: 'Uzaktan · Türkiye',
  },
];

export default function CareersContent() {
  const reduce = useReducedMotion();

  return (
    <main className="relative bg-transparent">
      <section className="relative min-h-[70svh] overflow-hidden">
        <Image
          src="/careers/hero.jpg"
          alt="Blacknook ekibi birlikte çalışırken"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bn-bg,#161618)] via-black/55 to-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-end px-6 pb-16 pt-32">
          <m.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.scene, ease: easePremium }}
          >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
              Blacknook · Kariyer
            </p>
            <h1 className="font-display max-w-3xl text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-white">
              Birlikte büyüyelim
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Yazılımı keşfedilir kılan ekibe katıl. Müşteriler ve ekipler için sakin, güçlü bir
              yazılım ekosistemi inşa ediyoruz.
            </p>
            <a
              href="#acil-roller"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black hover:opacity-90"
            >
              Açık roller
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </m.div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Departmanlar
          </p>
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Neye tutku duyuyorsun?
          </h2>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2">
            {DEPARTMENTS.map((d) => (
              <li key={d.title} className="border-t border-white/[0.08] pt-6">
                <h3 className="font-display text-xl font-semibold text-white">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/careers/craft.jpg"
              alt="Ürün taslağı üzerinde çalışan ekip üyesi"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Neden Blacknook?
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Girişimci araçları herkese açık olsun
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-zinc-500 sm:text-base">
              Bağımsız geliştiriciler ve erken aşama ekiplerin ürünlerini doğru kitleye ulaştırmasına
              yardım ediyoruz. Ekip olarak sade süreçler, dürüst geri bildirim ve uzun vadeli ürün
              düşüncesi peşindeyiz.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            İlkelerimiz
          </h2>
          <ul className="mt-14 grid gap-10 sm:grid-cols-3">
            {VALUES.map((v) => (
              <li key={v.title}>
                <h3 className="font-display text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Çalışma hayatı
            </h2>
            <ul className="mt-10 space-y-6">
              {PERKS.map((p) => (
                <li key={p.title}>
                  <h3 className="text-sm font-semibold text-zinc-100">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
            <Image
              src="/careers/culture.jpg"
              alt="Blacknook ekip kültürü"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section id="acil-roller" className="scroll-mt-24 border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Açık pozisyonlar
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-zinc-500">
            Seni heyecanlandıran bir rol görürsen kısa bir not ve portföyünle yaz.
          </p>
          <ul className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {OPENINGS.map((job) => (
              <li key={job.title} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    {job.dept}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-white">{job.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-zinc-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {job.loc}
                  </p>
                </div>
                <a
                  href={`mailto:careers@blacknook.com?subject=${encodeURIComponent(job.title)}`}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-zinc-100 hover:bg-white/[0.05]"
                >
                  Başvur
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20 text-center sm:py-28">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Hayalindeki rol burada olabilir
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-500">
          Açık pozisyon yoksa bile güçlü bir portföy gönder. Uygun olduğunda dönüş yaparız.
        </p>
        <a
          href="mailto:careers@blacknook.com"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-black hover:opacity-90"
        >
          careers@blacknook.com
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </section>
    </main>
  );
}
