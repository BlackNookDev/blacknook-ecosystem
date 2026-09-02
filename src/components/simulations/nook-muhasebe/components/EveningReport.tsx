import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { CHEQUE_AMOUNT } from '../data'
import { formatTRY } from '../lib/format'
import { PanelHeading } from './PanelHeading'

type EveningReportProps = {
  open: boolean
  spend: number
}

export function EveningReport({ open, spend }: EveningReportProps) {
  const [expanded, setExpanded] = useState(false)
  const interacted = useRef(false)

  useEffect(() => {
    if (!open) {
      setExpanded(false)
      interacted.current = false
      return
    }

    interacted.current = false
    setExpanded(false)
    const timer = window.setTimeout(() => {
      if (!interacted.current) setExpanded(true)
    }, 2200)
    return () => window.clearTimeout(timer)
  }, [open])

  const toggle = () => {
    interacted.current = true
    setExpanded((value) => !value)
  }

  return (
    <div className="flex h-full min-h-0 flex-col px-2.5 py-3">
      <PanelHeading className="mb-2" label="Yönetici WhatsApp Özeti" done={open} />

      <div className="mx-auto flex min-h-0 w-full max-w-[360px] flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col rounded-[36px] border border-indigo-100 bg-white p-2.5 shadow-[0_20px_50px_rgba(79,70,229,0.12)]">
          <div className="absolute top-3 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900" />

          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] bg-[#1a1630]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#312e81_0%,#1e1b4b_38%,#0f172a_100%)]" />
            <div className="absolute inset-x-8 top-10 h-28 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative flex min-h-0 flex-1 flex-col px-3.5 pt-8">
              <p className="text-center text-[10px] font-medium tracking-[0.18em] text-white/55 uppercase">
                Yönetici
              </p>
              <p className="mt-2 text-center text-[40px] leading-none font-semibold tracking-tight text-white">
                19:00
              </p>
              <p className="mt-1.5 text-center text-[12px] text-white/60">Salı, 25 Ağustos</p>

              <AnimatePresence>
                {open && (
                  <motion.button
                    type="button"
                    onClick={toggle}
                    aria-expanded={expanded}
                    initial={{ y: -36, opacity: 0, scale: 0.96 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 22,
                      delay: 0.35,
                    }}
                    className="mt-5 w-full cursor-pointer rounded-[22px] border border-white/20 bg-white p-3 text-left shadow-[0_16px_36px_rgba(0,0,0,0.35)] transition hover:bg-zinc-50"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#25D366] text-white shadow-sm">
                        <WhatsAppGlyph />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold text-zinc-900">NOOK</p>
                          <p className="text-[10px] text-zinc-500">şimdi</p>
                        </div>
                        <p className="text-[12px] font-medium text-zinc-800">Günlük mali özet</p>
                        <p className="truncate text-[11px] text-zinc-600">
                          {formatTRY(spend, 0)} · 3 proje
                        </p>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-1.5 border-t border-zinc-200 pt-3 text-[12px] leading-relaxed text-zinc-700">
                            <p>Toplam şantiye harcaması: {formatTRY(spend, 0)}</p>
                            <p>Kadıköy Rezidans · Maslak Ticari</p>
                            <p className="font-semibold text-amber-700">
                              Yarın vadeli çek: {formatTRY(CHEQUE_AMOUNT, 0)}
                            </p>
                          </div>
                          <span className="mt-2.5 block text-center text-[10px] font-semibold tracking-wide text-indigo-700">
                            Küçült
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12.04 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.32A10 10 0 1 0 12.04 2Zm5.8 14.2c-.24.68-1.4 1.26-1.94 1.3-.5.04-1.13.06-1.82-.11-.42-.11-.96-.31-1.66-.6-2.92-1.26-4.82-4.2-4.97-4.4-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.4.24-.26.64-.38.86-.38h.62c.2 0 .47-.04.73.56.28.64.94 2.22 1.02 2.38.08.16.14.34.03.54-.1.2-.16.34-.32.52-.16.18-.33.4-.47.54-.16.16-.32.33-.14.64.18.32.8 1.32 1.72 2.14 1.18 1.06 2.18 1.4 2.5 1.56.32.16.5.14.68-.08.2-.24.8-.92 1.02-1.24.22-.32.44-.26.74-.16.3.1 1.9.9 2.22 1.06.32.16.54.24.62.38.08.14.08.8-.16 1.48Z" />
    </svg>
  )
}
