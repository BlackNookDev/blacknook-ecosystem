'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import InstallRequestForm from '@/components/account/InstallRequestForm';

export default function NewInstallRequestClient() {
  const searchParams = useSearchParams();
  const slug = (searchParams.get('slug') || '').trim();
  const name = (searchParams.get('name') || '').trim();
  const hint = (searchParams.get('hint') || '').trim();

  if (!slug || !name) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-10 text-center">
        <p className="text-sm font-medium text-zinc-200">Önce bir ajan seçin</p>
        <p className="mt-2 text-sm text-zinc-500">
          Detaylı kurulum formu, katalog veya ürün sayfasındaki “Kurulum Talep Et” ile açılır.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-zinc-950 hover:opacity-90"
        >
          Ajan kataloğuna git
        </Link>
      </div>
    );
  }

  return (
    <InstallRequestForm serviceSlug={slug} serviceName={name} intentHint={hint} />
  );
}
