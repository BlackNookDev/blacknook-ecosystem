'use client';

import StudioAgentFeed from '@/components/otonom/StudioAgentFeed';
import type { AgentLogEntry } from '@/lib/studioProgress';

type Props = {
  entries: AgentLogEntry[];
  busy?: boolean;
  title?: string;
};

/** Tam ekran ajan paneli — üretim sırasında Cursor hissi. */
export default function StudioProgressCard({ entries, busy, title }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md sm:px-6">
      <div className="flex h-[min(34rem,85dvh)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="shrink-0 border-b border-white/10 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-white">
            {title || 'Blacknook ajanı çalışıyor'}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            İlerleme tek satırda; bitince kısa özet
          </p>
        </div>
        <div className="min-h-0 flex-1 p-3">
          <StudioAgentFeed entries={entries} busy={busy} className="h-full border-0 bg-transparent" />
        </div>
      </div>
    </div>
  );
}
