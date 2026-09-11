'use client';

import { useMemo, useState } from 'react';
import { ArrowUp, Code2, Eye, MessageSquare, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import StudioGenerationPanel from '@/components/otonom/StudioGenerationPanel';
import StudioAgentFeed from '@/components/otonom/StudioAgentFeed';
import DeveloperWorkspace from '@/components/developers/DeveloperWorkspace';
import type { StudioGeneration } from '@/lib/studioGenerate';
import { buildStudioPreviewHtml, previewBlockedReason } from '@/lib/studioPreview';
import type { AgentLogEntry } from '@/lib/studioProgress';
import { isCoderFeatureEnabled } from '@/lib/coderFeature';

type Tab = 'preview' | 'files' | 'ide' | 'chat';

type Props = {
  generation: StudioGeneration;
  projectName?: string;
  agentLog?: AgentLogEntry[];
  busy?: boolean;
  error?: string | null;
  onIterate?: (message: string) => void;
};

export default function StudioResultView({
  generation,
  projectName = 'agent-studio',
  agentLog = [],
  busy = false,
  error = null,
  onIterate,
}: Props) {
  const coderOn = isCoderFeatureEnabled();
  const previewHtml = useMemo(() => buildStudioPreviewHtml(generation), [generation]);
  const blockedReason = useMemo(() => previewBlockedReason(generation), [generation]);
  const [tab, setTab] = useState<Tab>(previewHtml ? 'preview' : 'files');
  const [draft, setDraft] = useState('');

  const submitChat = () => {
    const msg = draft.trim();
    if (!msg || busy || !onIterate) return;
    setDraft('');
    onIterate(msg);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      <aside className="flex max-h-[40vh] min-h-0 w-full shrink-0 flex-col border-b border-[var(--bn-border)] lg:max-h-none lg:w-[22rem] lg:border-b-0 lg:border-r">
        <StudioAgentFeed
          entries={agentLog}
          busy={busy}
          className="min-h-0 flex-1 rounded-none border-0"
        />
        <div className="shrink-0 border-t border-white/10 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            Yapılandırmayı güncelle
          </p>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submitChat();
            }}
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={busy || !onIterate}
              rows={2}
              placeholder="Örn. Destek ajanına KVKK onay adımı ekle…"
              className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-teal-400/40 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim() || !onIterate}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-zinc-950 transition hover:bg-teal-400 disabled:opacity-40"
              aria-label="Gönder"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
          {error ? (
            <p className="mt-2 text-[11px] text-rose-300" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-1 border-b border-[var(--bn-border)] bg-black/20 px-3 py-2">
          {(
            [
              ['preview', 'Önizleme', Eye, Boolean(previewHtml)] as const,
              ['chat', 'Sohbet', MessageSquare, true] as const,
              ['files', 'Dosyalar', Code2, true] as const,
              ...(coderOn
                ? ([['ide', 'IDE', Terminal, true] as const])
                : []),
            ] as const
          ).map(([id, label, Icon, enabled]) => (
            <button
              key={id}
              type="button"
              disabled={!enabled}
              onClick={() => setTab(id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                tab === id
                  ? 'bg-white text-zinc-950'
                  : enabled
                    ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    : 'cursor-not-allowed text-zinc-600'
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {tab === 'preview' ? (
            previewHtml ? (
              <iframe
                title="Ajan önizlemesi"
                className="h-full w-full border-0 bg-white"
                sandbox="allow-scripts"
                srcDoc={previewHtml}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="max-w-md text-sm text-zinc-300">
                  {blockedReason ||
                    'Önizleme açılamadı. Dosyalar sekmesini kontrol et veya yapılandırmayı güncelle.'}
                </p>
                <button
                  type="button"
                  onClick={() => setTab('files')}
                  className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/[0.08]"
                >
                  Dosyalara git
                </button>
              </div>
            )
          ) : null}

          {tab === 'chat' ? (
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              <p className="text-sm text-zinc-300">
                Soldaki kutuya yazarak ajan yapılandırmasını adım adım güncelleyin.
              </p>
              <StudioAgentFeed entries={agentLog} busy={busy} className="min-h-[12rem] flex-1" />
            </div>
          ) : null}

          {tab === 'files' ? (
            <StudioGenerationPanel generation={generation} className="w-full md:w-full" />
          ) : null}

          {tab === 'ide' && coderOn ? (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <DeveloperWorkspace projectName={projectName} fullscreen autoStart />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
