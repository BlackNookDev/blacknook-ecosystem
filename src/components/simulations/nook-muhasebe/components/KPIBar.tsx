import type { ReactNode } from 'react'
import { Banknote, TrendingUp } from 'lucide-react'
import { CHEQUE_AMOUNT, INITIAL_SPEND } from '../data'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { formatTRY } from '../lib/format'

type KPIBarProps = {
  spend: number
}

export function KPIBar({ spend }: KPIBarProps) {
  const animatedSpend = useAnimatedNumber(spend)

  return (
    <div className="grid grid-cols-2 gap-2">
      <KpiCard
        icon={<TrendingUp className="h-4 w-4" strokeWidth={2.2} />}
        label="Bugünkü Şantiye Masrafı"
        value={formatTRY(animatedSpend, 0)}
        hint={spend > INITIAL_SPEND ? '+₺4.850 OCR fişi eklendi' : 'Şantiye toplamı'}
        accent={spend > INITIAL_SPEND}
      />
      <KpiCard
        icon={<Banknote className="h-4 w-4" strokeWidth={2.2} />}
        label="Yaklaşan Çek / Ödeme (Yarın)"
        value={formatTRY(CHEQUE_AMOUNT, 0)}
        hint="Vade uyarısı aktif"
        warn
      />
    </div>
  )
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  accent = false,
  warn = false,
}: {
  icon: ReactNode
  label: string
  value: string
  hint: string
  accent?: boolean
  warn?: boolean
}) {
  return (
    <div
      className={`rounded-xl border bg-[var(--bn-elevated)] px-3 py-2.5 ${
        accent
          ? 'border-wa-accent/40 shadow-[0_0_20px_rgba(37,211,102,0.12)]'
          : warn
            ? 'border-amber-400/30'
            : 'border-[var(--bn-border)]'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
            accent
              ? 'bg-wa-accent text-white'
              : warn
                ? 'bg-amber-500/15 text-amber-300'
                : 'bg-wa-header/30 text-emerald-200'
          }`}
        >
          {icon}
        </span>
        <span className="text-[9px] font-semibold tracking-wider text-[var(--bn-muted)] uppercase">
          {label}
        </span>
      </div>
      <p
        className={`text-[18px] leading-none font-bold tracking-tight ${
          accent ? 'text-emerald-200' : warn ? 'text-amber-200' : 'text-[var(--bn-heading)]'
        }`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[10px] text-[var(--bn-muted)]">{hint}</p>
    </div>
  )
}
