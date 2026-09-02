import { AnimatePresence, motion } from 'framer-motion'
import { CheckCheck, Mic, Paperclip, Smile, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { AIResponseCard } from './AIResponseCard'
import { SiteGroupAvatar } from './SiteGroupAvatar'
import { PanelHeading } from './PanelHeading'
import { ReceiptMock } from './ReceiptMock'
import type { DemoScene, DemoStep } from '../types'

type WhatsAppPanelProps = {
  step: DemoStep
  scene: DemoScene
  composer: string
}

export function WhatsAppPanel({ step, scene, composer }: WhatsAppPanelProps) {
  const threadRef = useRef<HTMLDivElement>(null)
  const showMessage = step !== 'idle' && step !== 'chiefTyping'
  const showReceipt =
    step === 'receipt' ||
    step === 'analyzing' ||
    step === 'analyzed' ||
    step === 'syncing' ||
    step === 'synced'
  const scanning = step === 'analyzing'
  const showAi =
    step === 'analyzed' || step === 'syncing' || step === 'synced'

  useEffect(() => {
    const node = threadRef.current
    if (!node) return
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' })
  }, [step])

  return (
    <div className="flex h-full min-h-0 flex-col px-2.5 py-3">
      <PanelHeading
        className="mb-2"
        label="Şantiye WhatsApp İş Akışı"
        done={step === 'analyzed' || step === 'syncing' || step === 'synced'}
      />

      <div className="mx-auto flex min-h-0 w-full max-w-[360px] flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col rounded-[36px] border border-indigo-100 bg-white p-2.5 shadow-[0_20px_50px_rgba(79,70,229,0.12)]">
          <div className="absolute top-3 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900" />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] bg-wa-chat">
            <div className="flex items-center gap-3 bg-wa-header px-3 py-2.5 pt-6">
              <SiteGroupAvatar className="h-9 w-9 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">
                  Kadıköy Şantiye Grubu
                </p>
                <p className="text-[11px] text-emerald-100">
                  {step === 'chiefTyping' ? 'Mehmet K. yazıyor…' : 'Çevrimiçi · 6 katılımcı'}
                </p>
              </div>
            </div>

            <div
              ref={threadRef}
              className="erp-scroll min-h-0 flex-1 space-y-3 overflow-y-auto bg-wa-chat px-3 py-3"
            >
              <p className="text-center text-[10px] text-slate-400">Bugün {scene.time}</p>

              <AnimatePresence>
                {step === 'chiefTyping' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wa-teal text-[9px] font-semibold text-white">
                      MK
                    </div>
                    <div className="rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-sm">
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <IncomingBubble name="Şantiye Şefi · Mehmet K." time={scene.time}>
                      {scene.message}
                    </IncomingBubble>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showReceipt && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="ml-9 max-w-[240px]"
                  >
                    <ReceiptMock
                      scanning={scanning}
                      vendor={scene.receipt.vendor}
                      vkn={scene.receipt.vkn}
                      slipNo={scene.slipNo}
                      slipTime={scene.slipTime}
                      date={scene.receipt.date}
                      lines={scene.lines}
                      subtotal={scene.receipt.subtotal}
                      tax={scene.receipt.tax}
                      total={scene.receipt.total}
                    />
                    <p className="mt-1 text-right text-[10px] text-slate-400">{scene.time}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showAi && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="flex justify-end"
                  >
                    <div className="w-[92%]">
                      <div className="mb-1 flex items-center justify-end gap-1.5 text-[10px] text-emerald-700">
                        <Sparkles className="h-3 w-3" strokeWidth={2.2} />
                        NOOK Muhasebe Ajanı
                      </div>
                      <AIResponseCard receipt={scene.receipt} />
                      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                        {scene.time}
                        <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 bg-[#F0F2F5] px-2 py-2">
              <Smile className="h-5 w-5 shrink-0 text-slate-400" />
              <div className="flex min-h-[36px] min-w-0 flex-1 items-center rounded-full bg-white px-3 text-[12px] text-slate-600">
                <ComposerLabel step={step} composer={composer} />
              </div>
              <Paperclip className="h-5 w-5 shrink-0 text-slate-400" />
              <Mic className="h-5 w-5 shrink-0 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComposerLabel({ step, composer }: { step: DemoStep; composer: string }) {
  if (step === 'analyzing' || step === 'syncing') {
    return (
      <span className="flex items-center gap-2 text-emerald-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        {composer}
      </span>
    )
  }

  if (step === 'analyzed' || step === 'synced') {
    return <span className="font-medium text-emerald-700">{composer}</span>
  }

  return <span className="text-slate-400">{composer}</span>
}

function IncomingBubble({
  name,
  time,
  children,
}: {
  name: string
  time: string
  children: string
}) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wa-teal text-[9px] font-semibold tracking-wide text-white">
        MK
      </div>
      <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm">
        <p className="text-[10px] font-semibold text-emerald-700">{name}</p>
        <p className="text-[12.5px] leading-relaxed text-slate-800">{children}</p>
        <p className="mt-1 text-right text-[10px] text-slate-400">{time}</p>
      </div>
    </div>
  )
}
