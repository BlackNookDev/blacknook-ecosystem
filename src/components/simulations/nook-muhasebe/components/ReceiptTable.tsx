import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ReceiptItem } from '../types'
import {
  abbreviateProject,
  abbreviateVendor,
  formatDateShort,
  formatTRYCompact,
} from '../lib/format'

type ReceiptTableProps = {
  receipts: ReceiptItem[]
  highlightId: string | null
  onApprove: (id: string) => void
}

export function ReceiptTable({ receipts, highlightId, onApprove }: ReceiptTableProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[var(--bn-border)] bg-[var(--bn-elevated)]">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--bn-border)] px-3 py-2">
        <div>
          <p className="text-[11px] font-semibold text-[var(--bn-heading)]">ERP Taslak Fiş Listesi</p>
          <p className="text-[9px] text-[var(--bn-muted)]">Logo Tiger / Mikro · entegrasyon ızgarası</p>
        </div>
        <span className="rounded-md border border-[var(--bn-border)] bg-[var(--bn-chip-bg)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--bn-muted)]">
          {receipts.length} kayıt
        </span>
      </div>

      <div className="erp-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-left text-[10px]">
          <colgroup>
            <col className="w-[9%]" />
            <col className="w-[14%]" />
            <col className="w-[30%]" />
            <col className="w-[17%]" />
            <col className="w-[14%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-[var(--bn-surface)] text-[9px] font-semibold tracking-wide text-[var(--bn-muted)] uppercase">
            <tr className="border-b border-[var(--bn-border)]">
              <th className="px-1.5 py-2">Tarih</th>
              <th className="px-1.5 py-2">Proje</th>
              <th className="px-1.5 py-2">Tedarikçi</th>
              <th className="px-1.5 py-2 text-right">Tutar</th>
              <th className="px-1.5 py-2 text-right">KDV</th>
              <th className="px-1 py-2 text-center" aria-label="İşlem">
                <span className="sr-only">İşlem</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {receipts.map((row) => {
                const highlighted = row.id === highlightId
                return (
                  <motion.tr
                    key={row.id}
                    layout
                    initial={
                      highlighted
                        ? { opacity: 0, y: -10, backgroundColor: 'rgba(37,211,102,0.16)' }
                        : false
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      backgroundColor: highlighted
                        ? 'rgba(37,211,102,0.1)'
                        : 'rgba(36,36,40,0.35)',
                    }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={`border-b border-[var(--bn-border)] ${highlighted ? 'row-glow' : ''}`}
                  >
                    <td className="px-1.5 py-2 whitespace-nowrap text-[var(--bn-muted)]">
                      {formatDateShort(row.date)}
                    </td>
                    <td
                      className="truncate px-1.5 py-2 font-medium text-[var(--bn-text)]"
                      title={row.project}
                    >
                      {abbreviateProject(row.project)}
                    </td>
                    <td className="px-1.5 py-2">
                      <p className="truncate font-medium text-[var(--bn-heading)]" title={row.vendor}>
                        {abbreviateVendor(row.vendor)}
                        {highlighted && (
                          <span className="ml-1 rounded-full bg-wa-accent/20 px-1 py-px text-[8px] font-bold tracking-wide text-emerald-200 uppercase">
                            Yeni
                          </span>
                        )}
                      </p>
                      <p className="truncate text-[9px] text-[var(--bn-faint)]">{row.vkn}</p>
                    </td>
                    <td className="px-1.5 py-2 text-right font-semibold text-[var(--bn-heading)]">
                      {formatTRYCompact(row.total)}
                    </td>
                    <td className="px-1.5 py-2 text-right text-[var(--bn-muted)]">
                      {formatTRYCompact(row.tax)}
                    </td>
                    <td className="px-1 py-2 text-center">
                      {row.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => onApprove(row.id)}
                          aria-label="Onayla"
                          title="Onayla"
                          className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-wa-accent text-white transition hover:bg-wa-headerLight"
                        >
                          <Check className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center text-[11px] text-wa-accent">
                          ✓
                        </span>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
