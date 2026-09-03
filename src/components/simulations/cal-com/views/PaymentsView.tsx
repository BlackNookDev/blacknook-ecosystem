'use client';

import { CreditCard } from 'lucide-react';
import { PAYMENT_SETTINGS } from '@/components/simulations/cal-com/data';
import { PaytrTrustRow } from '@/components/PaytrLogo';

export default function PaymentsView() {
  return (
    <div className="cal-scroll h-full overflow-auto p-5">
      <h2 className="font-display text-lg font-bold text-[var(--bn-heading)]">Ödemeler</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Stripe entegrasyonu ile rezervasyonlarda ücret tahsilatı (Cal Payments).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Stripe durumu', value: PAYMENT_SETTINGS.stripeConnected ? 'Bağlı' : 'Kapalı' },
          { label: 'Para birimi', value: PAYMENT_SETTINGS.currency },
          { label: 'Bu ay tahsilat', value: PAYMENT_SETTINGS.collectedThisMonth },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
          >
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className="mt-2 text-lg font-bold text-zinc-100">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-zinc-500" aria-hidden />
          <h3 className="text-sm font-semibold text-zinc-200">Stripe Checkout</h3>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Ücretli etkinliklerde rezervasyon öncesi veya sonrası ödeme alın. Kart bilgileri Stripe
          üzerinde işlenir; Cal kart saklamaz.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Varsayılan ücret</dt>
            <dd className="text-zinc-200">{PAYMENT_SETTINGS.defaultPrice}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Ödeme zorunlu</dt>
            <dd className="text-zinc-200">{PAYMENT_SETTINGS.requirePayment ? 'Evet' : 'Hayır'}</dd>
          </div>
        </dl>
        <PaytrTrustRow className="mt-5" />
      </section>
    </div>
  );
}
