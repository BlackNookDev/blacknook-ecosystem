import type { Metadata } from 'next';
import { Suspense } from 'react';
import { buildPageMetadata } from '@/lib/seo';
import NewInstallRequestClient from '@/components/account/NewInstallRequestClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'Kurulum talebi | Hesabım',
  description: 'Yönetilen kurulum için detaylı talep formu.',
  path: '/account/requests/new',
  noIndex: true,
});

export default function NewInstallRequestPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Kurulum talebi
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
        Ortam tercihinizi ve ihtiyaçlarınızı doldurun. Operasyon ekibi talebi e-posta ve admin
        panelinden takip eder.
      </p>
      <div className="mt-10 max-w-3xl">
        <Suspense fallback={<p className="text-sm text-zinc-500">Yükleniyor…</p>}>
          <NewInstallRequestClient />
        </Suspense>
      </div>
    </div>
  );
}
