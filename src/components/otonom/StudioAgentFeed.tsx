'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Bot, Check, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  compactAgentHistory,
  getLiveAgentLine,
  type AgentLogEntry,
} from '@/lib/studioProgress';

type Props = {
  entries: AgentLogEntry[];
  busy?: boolean;
  className?: string;
  compact?: boolean;
};

export default function StudioAgentFeed({
  entries,
  busy,
  className,
  compact,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  const history = useMemo(() => compactAgentHistory(entries), [entries]);
  const live = useMemo(
    () => (busy ? getLiveAgentLine(entries) : null),
    [busy, entries]
  );

  // Canlı satır varken son özeti gizle (çift satır olmasın)
  const visibleHistory = useMemo(() => {
    if (!live || !busy) return history;
    const last = history[history.length - 1];
    if (last?.kind === 'chat') return history;
    return history.slice(0, -1);
  }, [history, live, busy]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [visibleHistory.length, live?.text, busy]);

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40',
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2">
        <Bot className="h-3.5 w-3.5 text-teal-400" aria-hidden />
        <p className="text-[11px] font-semibold text-zinc-300">Ajan</p>
        {busy ? (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-teal-300/90">
            <Loader2 className="h-3 w-3 animate-spin" />
            çalışıyor
          </span>
        ) : (
          <span className="ml-auto text-[10px] font-medium text-zinc-500">hazır</span>
        )}
      </div>

      <ul
        className={cn(
          'min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-1.5',
          compact ? 'max-h-48' : ''
        )}
      >
        {visibleHistory.length === 0 && !live ? (
          <li className="px-2 py-5 text-center text-xs text-zinc-500">
            Prompt yazınca ilerleme burada tek satırda görünür.
          </li>
        ) : (
          visibleHistory.map((e) => {
            const isChat = e.kind === 'chat';
            return (
              <li
                key={e.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1 text-[12px] leading-snug',
                  e.status === 'error' && 'text-rose-300',
                  isChat ? 'text-zinc-200' : 'text-zinc-400'
                )}
              >
                <span className="shrink-0 text-zinc-500">
                  {isChat ? (
                    <MessageSquare className="h-3 w-3" />
                  ) : e.status === 'error' ? (
                    <span className="text-rose-400">!</span>
                  ) : (
                    <Check className="h-3 w-3 text-emerald-400/90" />
                  )}
                </span>
                <p className="min-w-0 flex-1 truncate">{e.text}</p>
              </li>
            );
          })
        )}

        {live ? (
          <li className="flex items-center gap-2 rounded-lg bg-teal-500/[0.07] px-2 py-1.5 text-[12px] leading-snug text-zinc-100">
            <Loader2 className="h-3 w-3 shrink-0 animate-spin text-teal-400" />
            <p
              key={live.text}
              className="min-w-0 flex-1 truncate transition-opacity duration-200"
            >
              {live.path ? `${live.text} · ${live.path}` : live.text}
            </p>
          </li>
        ) : null}

        <div ref={endRef} />
      </ul>
    </div>
  );
}
