import { motion } from 'framer-motion'
import { MessageCircle, User } from 'lucide-react'
import { PanelHeading } from './PanelHeading'
import type { DemoScene, FlowiseStep } from '../types'

type ChatPanelProps = {
  scene: DemoScene
  step: FlowiseStep
}

export function ChatPanel({ scene, step }: ChatPanelProps) {
  const showQuestion = step !== 'idle'
  const done = step === 'answering' || step === 'done'

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-950/80">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <PanelHeading label="Kullanıcı Sohbeti" done={done} />
        <span className="flex items-center gap-1 text-[10px] text-zinc-500">
          <MessageCircle className="h-3 w-3" />
          HR Asistan
        </span>
      </div>

      <div className="flow-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        <div className="rounded-lg bg-zinc-900/60 px-2.5 py-2 text-[11px] text-zinc-400">
          Merhaba! İK politikaları hakkında sorularınızı yanıtlayabilirim.
        </div>

        {showQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="ml-auto max-w-[92%] rounded-xl rounded-tr-sm border border-violet-500/30 bg-violet-500/10 px-3 py-2"
          >
            <div className="mb-1 flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-zinc-500">{scene.time}</span>
              <User className="h-3 w-3 text-violet-400" />
            </div>
            <p className="text-right text-[12px] leading-relaxed text-zinc-100">{scene.question}</p>
          </motion.div>
        )}

        {(step === 'flowing' || step === 'retrieving') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[11px] text-zinc-500"
          >
            <span className="inline-flex gap-0.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:240ms]" />
            </span>
            Flowise akışı çalışıyor…
          </motion.div>
        )}
      </div>
    </section>
  )
}
