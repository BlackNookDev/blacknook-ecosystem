'use client';

import { CreditCard, FileText, MapPin } from 'lucide-react';
import AccountSection from '@/components/account/AccountSection';
import { PaytrTrustRow } from '@/components/PaytrLogo';

const SUMMARY = [
  { label: 'Bekleyen ödeme', value: '₺0,00' },
  { label: 'Bu ay harcama', value: '₺0,00' },
  { label: 'Son fatura', value: '—' },
] as const;

const BILLING_FIELDS = [
  { label: 'Ünvan / Ad soyad', value: '—' },
  { label: 'Vergi no / TCKN', value: '—' },
  { label: 'Adres', value: '—' },
  { label: 'İl / İlçe', value: '—' },
  { label: 'Ülke', value: 'Türkiye' },
] as const;

export default function AccountBillingContent() {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
          >
            <p className="text-xs font-medium text-zinc-500">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <AccountSection
        title="Ödeme yöntemi"
        description="Kayıtlı kart veya otomatik ödeme yönteminiz."
        action={
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-500 opacity-60"
          >
            Kart ekle
          </button>
        }
      >
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-500">
              <CreditCard className="h-5 w-5" aria-hidden />
            </span>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <p className="text-sm font-medium text-zinc-200">Kayıtlı ödeme yöntemi yok</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                Ödeme yöntemi eklendiğinde burada görünecek. Kart bilgileri PayTR altyapısında
                işlenir; Blacknook kart numarası saklamaz.
              </p>
            </div>
          </div>
          <PaytrTrustRow className="mt-6 justify-center sm:justify-start" />
        </div>
      </AccountSection>

      <AccountSection
        title="Fatura bilgileri"
        description="Faturalarda kullanılacak fatura adresi ve vergi bilgileri."
        action={
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-500 opacity-60"
          >
            Düzenle
          </button>
        }
      >
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="mb-4 flex items-center gap-2 text-zinc-500">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-xs font-medium uppercase tracking-[0.12em]">Fatura adresi</span>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {BILLING_FIELDS.map((field) => (
              <div key={field.label}>
                <dt className="text-xs text-zinc-500">{field.label}</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-200">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </AccountSection>

      <AccountSection title="Fatura geçmişi" description="Ödenmiş ve bekleyen faturalarınız.">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="hidden grid-cols-[1fr_8rem_8rem_6rem] gap-4 border-b border-white/[0.06] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 sm:grid">
            <span>Fatura</span>
            <span>Tarih</span>
            <span>Tutar</span>
            <span>Durum</span>
          </div>
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-500">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-medium text-zinc-200">Henüz fatura yok</p>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-zinc-500">
              Satın alma veya abonelik faturaları oluştuğunda bu listede görünecek.
            </p>
          </div>
        </div>
      </AccountSection>
    </div>
  );
}
