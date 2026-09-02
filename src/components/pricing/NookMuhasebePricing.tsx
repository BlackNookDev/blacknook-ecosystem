'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X } from 'lucide-react';
import {
  formatTry,
  NOOK_MCP_PRICING_PLANS,
  type NookPricingPlan,
} from '@/lib/nookMuhasebePricing';

type BillingPeriod = 'monthly' | 'annual';

type Props = {
  variant?: 'button' | 'panel';
  className?: string;
  ctaHref?: string;
  buttonClassName?: string;
  buttonStyle?: 'pill' | 'chip' | 'link';
};

function periodLabel(period: BillingPeriod) {
  return period === 'monthly' ? 'Aylık' : 'Yıllık';
}

function recurringFee(plan: NookPricingPlan, period: BillingPeriod) {
  return period === 'monthly' ? plan.monthlyFee : plan.annualFee;
}

function planCtaHref(base: string, planId: string) {
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}plan=${planId}`;
}

function BillingToggle({
  period,
  onChange,
}: {
  period: BillingPeriod;
  onChange: (next: BillingPeriod) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-xs"
      role="tablist"
      aria-label="Faturalama dönemi"
    >
      {(['monthly', 'annual'] as const).map((key) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={period === key}
          onClick={() => onChange(key)}
          className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
            period === key ? 'bg-white text-black' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {periodLabel(key)}
        </button>
      ))}
    </div>
  );
}

function PlanButton({
  plan,
  period,
  ctaHref,
  onSelect,
}: {
  plan: NookPricingPlan;
  period: BillingPeriod;
  ctaHref: string;
  onSelect?: () => void;
}) {
  const highlighted = Boolean(plan.popular);
  const fee = recurringFee(plan, period);

  return (
    <Link
      href={planCtaHref(ctaHref, plan.id)}
      onClick={onSelect}
      className={`block min-w-[15rem] shrink-0 rounded-xl border p-4 text-left transition-[border-color,background-color,transform] hover:scale-[1.01] active:scale-[0.99] sm:min-w-[16.5rem] ${
        highlighted
          ? 'border-emerald-400/40 bg-emerald-500/[0.07] shadow-[0_0_24px_rgba(16,185,129,0.08)] hover:border-emerald-400/55'
          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
      }`}
    >
      {plan.badge ? (
        <span className="mb-2 inline-flex rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          {plan.badge}
        </span>
      ) : null}
      <p className="text-sm font-semibold text-white">{plan.name}</p>
      <p className="mt-1 text-[11px] text-zinc-500">{plan.target}</p>
      <p className="mt-3 font-display text-2xl font-bold text-white">{formatTry(fee)}</p>
      <p className="text-[11px] text-zinc-500">
        {periodLabel(period)} · Kurulum {formatTry(plan.setupFee)}
      </p>
    </Link>
  );
}

function PricingPanel({
  ctaHref,
  onPlanSelect,
}: {
  ctaHref: string;
  onPlanSelect?: () => void;
}) {
  const [period, setPeriod] = useState<BillingPeriod>('monthly');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">NOOK MCP şantiye ve ERP paketleri</p>
        <BillingToggle period={period} onChange={setPeriod} />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NOOK_MCP_PRICING_PLANS.map((plan) => (
          <PlanButton
            key={plan.id}
            plan={plan}
            period={period}
            ctaHref={ctaHref}
            onSelect={onPlanSelect}
          />
        ))}
      </div>
      <ul className="grid gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
        {NOOK_MCP_PRICING_PLANS.map((plan) => (
          <li key={plan.id} className="text-xs text-zinc-500">
            <span className="font-medium text-zinc-300">{plan.name}:</span>{' '}
            {plan.features[0]}
          </li>
        ))}
      </ul>
      <p className="text-center text-[11px] text-zinc-500">Fiyatlar KDV hariçtir.</p>
    </div>
  );
}

function PricingModal({
  open,
  onClose,
  ctaHref,
}: {
  open: boolean;
  onClose: () => void;
  ctaHref: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Fiyatlandırmayı kapat"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="nook-pricing-modal-title"
        className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/10 bg-[var(--bn-elevated,#1c1c1f)] p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="nook-pricing-modal-title" className="font-display text-lg font-semibold text-white">
              Fiyatlandırma
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Paket seçerek teklif alabilirsiniz.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <PricingPanel ctaHref={ctaHref} onPlanSelect={onClose} />
      </div>
    </div>,
    document.body
  );
}

const pillButtonClass =
  'mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 py-3.5 text-sm font-semibold text-emerald-50 transition-[border-color,background-color] duration-premium ease-premium hover:border-emerald-300/55 hover:bg-emerald-500/20';

const chipButtonClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-[var(--bn-border)] bg-[var(--bn-chip-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--bn-chip-text)] transition hover:border-emerald-400/30 hover:text-emerald-200';

const linkButtonClass =
  'w-full py-1 text-center text-xs font-medium text-emerald-300/90 transition-colors hover:text-emerald-200';

export default function NookMuhasebePricing({
  variant = 'button',
  className = '',
  ctaHref = '/service/nook-muhasebe-mcp?openInstall=1',
  buttonClassName = '',
  buttonStyle = 'pill',
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (variant === 'panel') {
    return (
      <div className={className}>
        <PricingPanel ctaHref={ctaHref} />
      </div>
    );
  }

  const triggerClass =
    buttonClassName ||
    (buttonStyle === 'chip'
      ? chipButtonClass
      : buttonStyle === 'link'
        ? linkButtonClass
        : pillButtonClass);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${triggerClass} ${className}`}>
        Fiyatlandırma
      </button>
      {mounted ? (
        <PricingModal open={open} onClose={() => setOpen(false)} ctaHref={ctaHref} />
      ) : null}
    </>
  );
}
