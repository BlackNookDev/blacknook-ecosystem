'use client';

import { useEffect, useState } from 'react';
import AgentStudioHome from '@/components/otonom/AgentStudioHome';
import StudioResultView from '@/components/otonom/StudioResultView';
import StudioAgentFeed from '@/components/otonom/StudioAgentFeed';
import { subscribeSimulationSplash } from '@/lib/simulationSplash';
import type { StudioGeneration } from '@/lib/studioGenerate';
import { ensurePreviewableGeneration } from '@/lib/studioPreview';
import { isCoderFeatureEnabled } from '@/lib/coderFeature';
import {
  buildTurnSummary,
  compactAgentHistory,
  normalizeAgentEntry,
  upsertAgentLog,
  type AgentLogEntry,
  type StudioProgressEvent,
} from '@/lib/studioProgress';
import { cn } from '@/lib/utils';

type Mode = 'home' | 'workspace';

const PROMPT_KEY = 'bn-studio-prompt';
const GEN_KEY = 'bn-studio-generation';
const LOG_KEY = 'bn-studio-agent-log';

async function runStudioStream(
  body: Record<string, unknown>,
  onEvent: (event: StudioProgressEvent) => void
): Promise<Extract<StudioProgressEvent, { type: 'done' }>> {
  const res = await fetch('/api/studio/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/x-ndjson',
    },
    body: JSON.stringify({ ...body, stream: true }),
  });

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(errBody.error || 'Üretim başarısız.');
  }
  if (!res.body) throw new Error('Sunucu yanıtı boş.');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let doneEvent: Extract<StudioProgressEvent, { type: 'done' }> | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let event: StudioProgressEvent;
      try {
        event = JSON.parse(trimmed) as StudioProgressEvent;
      } catch {
        continue;
      }
      onEvent(event);
      if (event.type === 'error') throw new Error(event.message);
      if (event.type === 'done') doneEvent = event;
    }
  }

  if (buffer.trim()) {
    try {
      const event = JSON.parse(buffer.trim()) as StudioProgressEvent;
      onEvent(event);
      if (event.type === 'error') throw new Error(event.message);
      if (event.type === 'done') doneEvent = event;
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw e;
    }
  }

  if (!doneEvent?.generation?.files?.length) {
    throw new Error('Üretim boş döndü.');
  }
  return doneEvent;
}

export default function AgentStudioPage() {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>('home');
  const [prompt, setPrompt] = useState('');
  const [generation, setGeneration] = useState<StudioGeneration | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentLog, setAgentLog] = useState<AgentLogEntry[]>([]);

  useEffect(() => {
    return subscribeSimulationSplash((splash) => {
      setReady(!splash.visible);
    });
  }, []);

  const pushAgent = (partial: Parameters<typeof normalizeAgentEntry>[0]) => {
    setAgentLog((prev) => upsertAgentLog(prev, normalizeAgentEntry(partial)));
  };

  const openWorkspace = (
    nextPrompt: string,
    nextGen?: StudioGeneration | null,
    logs?: AgentLogEntry[]
  ) => {
    const gen = nextGen ? ensurePreviewableGeneration(nextGen, nextPrompt) : null;
    setPrompt(nextPrompt);
    setGeneration(gen);
    if (logs) setAgentLog(logs);
    try {
      sessionStorage.setItem(PROMPT_KEY, nextPrompt);
      if (gen) sessionStorage.setItem(GEN_KEY, JSON.stringify(gen));
      else sessionStorage.removeItem(GEN_KEY);
      if (logs?.length) sessionStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-80)));
    } catch {
      /* ignore */
    }
    setMode('workspace');
  };

  const createFromPrompt = async (
    nextPrompt: string,
    opts?: { previous?: StudioGeneration | null }
  ) => {
    const value = nextPrompt.trim() || 'Yeni Blacknook sistemi';
    const previous = opts?.previous ?? null;
    setError(null);
    setGenerating(true);

    const chatEntry = normalizeAgentEntry({
      kind: 'chat',
      text: previous ? `Geliştir: ${value}` : `Yeni proje: ${value}`,
      status: 'done',
    });

    let baseLogs: AgentLogEntry[] = [chatEntry];
    setAgentLog((prev) => {
      const history = previous ? compactAgentHistory(prev) : [];
      baseLogs = [...history, chatEntry];
      return baseLogs;
    });

    let streamLogs: AgentLogEntry[] = [];

    try {
      const done = await runStudioStream(
        {
          prompt: value,
          previous: previous
            ? {
                title: previous.title,
                summary: previous.summary,
                files: previous.files,
                model: previous.model,
              }
            : undefined,
          applyToWorkspace: isCoderFeatureEnabled(),
        },
        (event) => {
          if (event.type === 'agent') {
            const entry = normalizeAgentEntry(event.entry);
            streamLogs = upsertAgentLog(streamLogs, entry);
            // Çalışırken: geçmiş + chat + tek canlı satır
            setAgentLog([...baseLogs, ...streamLogs]);
          }
        }
      );

      if (done.writeError) {
        setError(`Üretim tamam; IDE yazımı: ${done.writeError}`);
      }

      const fileCount = done.generation?.files?.length || 0;
      const summary = buildTurnSummary({
        iterating: Boolean(previous),
        fileCount,
        writtenCount: done.written?.paths?.length ?? null,
        writeError: done.writeError,
      });
      // Bitince ara adımları at — sadece chat + kısa özet
      const finalLogs = compactAgentHistory([...baseLogs, summary]);

      // Iterate'de üst başlıkta orijinal proje istemi kalsın
      openWorkspace(
        previous ? prompt || value : value,
        done.generation as StudioGeneration,
        finalLogs
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Üretim başarısız.');
      pushAgent({
        kind: 'status',
        text: e instanceof Error ? e.message : 'Üretim başarısız.',
        status: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  if (!ready) return null;

  if (mode === 'home') {
    const showAgentPanel = generating || agentLog.length > 0;
    return (
      <div className="fixed inset-0 z-20 flex h-[100dvh] overflow-hidden bg-[#07090f]">
        <div
          className={cn(
            'min-h-0 min-w-0 flex-1 overflow-hidden transition-[max-width] duration-300',
            showAgentPanel && 'lg:max-w-[calc(100%-22rem)]'
          )}
        >
          <AgentStudioHome
            error={error}
            busy={generating}
            onCreate={(nextPrompt) => {
              void createFromPrompt(nextPrompt);
            }}
            onOpenWorkspace={(nextPrompt) => openWorkspace(nextPrompt, null, [])}
          />
        </div>

        {showAgentPanel ? (
          <aside
            className={cn(
              'flex min-h-0 w-full flex-col border-white/10 bg-zinc-950/95',
              'lg:relative lg:flex lg:w-[22rem] lg:shrink-0 lg:border-l',
              'absolute inset-x-0 bottom-0 z-30 max-h-[42vh] border-t lg:static lg:max-h-none'
            )}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5">
              <p className="text-xs font-semibold text-zinc-200">
                {generating ? 'Ajan çalışıyor' : 'Ajan'}
              </p>
              {!generating ? (
                <button
                  type="button"
                  onClick={() => setAgentLog([])}
                  className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-300"
                >
                  Temizle
                </button>
              ) : null}
            </div>
            <StudioAgentFeed
              entries={agentLog}
              busy={generating}
              className="min-h-0 flex-1 rounded-none border-0 bg-transparent"
            />
          </aside>
        ) : null}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-20 flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--bn-bg)]">
      {generation ? (
        <StudioResultView
          generation={generation}
          agentLog={agentLog}
          busy={generating}
          error={error}
          onIterate={(message) => {
            void createFromPrompt(message, { previous: generation });
          }}
        />
      ) : (
        <AgentStudioHome
          busy={generating}
          error={error}
          onOpenWorkspace={(p) => openWorkspace(p)}
          onCreate={(p) => {
            void createFromPrompt(p);
          }}
        />
      )}
    </div>
  );
}
