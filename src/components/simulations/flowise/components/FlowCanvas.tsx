import { FLOW_NODES } from '../data'
import type { FlowNodeId, FlowiseStep } from '../types'
import { PanelHeading } from './PanelHeading'

type FlowCanvasProps = {
  step: FlowiseStep
  activeNode: FlowNodeId | null
}

const EDGES: [FlowNodeId, FlowNodeId][] = [
  ['input', 'loader'],
  ['input', 'embeddings'],
  ['loader', 'vector'],
  ['embeddings', 'vector'],
  ['vector', 'chain'],
  ['chain', 'output'],
]

function nodePos(id: FlowNodeId) {
  const node = FLOW_NODES.find((n) => n.id === id)
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
}

export function FlowCanvas({ step, activeNode }: FlowCanvasProps) {
  const done = step === 'done'
  const showFlow = step === 'flowing' || step === 'retrieving' || step === 'answering' || step === 'done'

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-950/80">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <PanelHeading label="Flowise Canvas" done={done} />
        <span className="text-[10px] text-zinc-500">RAG Agent · v1.4</span>
      </div>

      <div className="relative min-h-0 flex-1 p-3">
        <svg className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]" viewBox="0 0 100 80" preserveAspectRatio="none">
          {EDGES.map(([from, to]) => {
            const a = nodePos(from)
            const b = nodePos(to)
            const lit = showFlow && (activeNode === from || activeNode === to)
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={lit ? '#a78bfa' : '#3f3f46'}
                strokeWidth={lit ? 0.55 : 0.35}
                strokeDasharray={lit ? '0' : '1.2 1.2'}
              />
            )
          })}
        </svg>

        {FLOW_NODES.map((node) => {
          const active = activeNode === node.id
          return (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-2 py-1.5 text-center transition-all ${
                active
                  ? 'node-glow border-violet-400 bg-violet-500/15 text-violet-100'
                  : 'border-zinc-700 bg-zinc-900/90 text-zinc-400'
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%`, minWidth: '5.5rem' }}
            >
              <p className="text-[9px] font-medium leading-tight">{node.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
