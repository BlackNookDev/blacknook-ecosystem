import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import { PanelHeading } from './PanelHeading'
import type { DemoScene, FlowiseStep } from '../types'

type ResponsePanelProps = {
  scene: DemoScene
  step: FlowiseStep
  typedAnswer: string
}

export function ResponsePanel({ scene, step, typedAnswer }: ResponsePanelProps) {
  const showMetrics = step === 'retrieving' || step === 'answering' || step === 'done'
  const showAnswer = step === 'answering' || step === 'done'
  const done = step === 'done'

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-950/80">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <PanelHeading label="RAG Yanıtı" done={done} />
        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
      </div>

      <div className="flow-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        {showMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-2"
          >
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2 py-1.5">
              <p className="text-[9px] uppercase tracking-wider text-zinc-500">Gecikme</p>
              <p className="text-sm font-semibold text-violet-300">{scene.latencyMs} ms</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2 py-1.5">
              <p className="text-[9px] uppercase tracking-wider text-zinc-500">Token</p>
              <p className="text-sm font-semibold text-violet-300">{scene.tokens}</p>
            </div>
          </motion.div>
        )}

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-violet-500/25 bg-violet-500/5 px-3 py-2.5"
          >
            <p className="text-[12px] leading-relaxed text-zinc-100">
              {typedAnswer}
              {step === 'answering' && (
                <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-violet-400 align-middle" />
              )}
            </p>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1.5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Kaynaklar</p>
            {scene.sources.map((source) => (
              <div
                key={source}
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-2 py-1.5 text-[11px] text-zinc-300"
              >
                <FileText className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                {source}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
