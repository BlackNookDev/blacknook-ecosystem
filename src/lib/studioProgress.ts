/** Studio ajan akışı — Cursor-benzeri aktivite günlüğü. */

export const STUDIO_STEPS = [
  {
    id: 'understand',
    label: 'İsteği anla',
    hint: 'Prompt okunuyor',
  },
  {
    id: 'coding',
    label: 'Kod üret',
    hint: 'Model çalışıyor',
  },
  {
    id: 'workspace',
    label: 'Ortam',
    hint: 'Workspace hazırlanıyor',
  },
  {
    id: 'writing',
    label: 'Dosya yaz',
    hint: 'IDE’ye kopyalanıyor',
  },
] as const;

export type StudioStepId = (typeof STUDIO_STEPS)[number]['id'];

export type AgentLogKind = 'think' | 'read' | 'write' | 'tool' | 'status' | 'chat';

export type AgentLogEntry = {
  id: string;
  kind: AgentLogKind;
  text: string;
  path?: string;
  status: 'running' | 'done' | 'error';
  at: number;
  /** Aynı lane → tek satır güncellenir (heartbeat spam olmaz). */
  lane?: string;
};

export type StudioProgressEvent =
  | {
      type: 'progress';
      step: StudioStepId;
      message: string;
    }
  | {
      type: 'agent';
      entry: Omit<AgentLogEntry, 'id' | 'at'> & { id?: string; at?: number };
    }
  | {
      type: 'done';
      ok: true;
      prompt: string;
      generation: {
        title: string;
        summary: string;
        files: { path: string; content: string }[];
        model?: string;
        jobId?: string;
      };
      workspace: {
        id: string;
        name: string;
        status: string;
        accessUrl: string | null;
      } | null;
      written: { paths: string[]; projectDir: string } | null;
      writeError: string | null;
    }
  | {
      type: 'error';
      message: string;
    };

export function stepIndex(id: StudioStepId): number {
  return STUDIO_STEPS.findIndex((s) => s.id === id);
}

export function normalizeAgentEntry(
  entry: Omit<AgentLogEntry, 'id' | 'at'> & { id?: string; at?: number }
): AgentLogEntry {
  return {
    id: entry.id || `a-${Math.random().toString(36).slice(2, 9)}`,
    kind: entry.kind,
    text: entry.text,
    path: entry.path,
    status: entry.status,
    at: entry.at || Date.now(),
    lane: entry.lane,
  };
}

/** Lane varsa aynı satırı güncelle; yoksa ekle. */
export function upsertAgentLog(
  prev: AgentLogEntry[],
  entry: AgentLogEntry
): AgentLogEntry[] {
  if (!entry.lane) return [...prev, entry];
  const idx = prev.findIndex((e) => e.lane === entry.lane);
  if (idx === -1) return [...prev, entry];
  const next = prev.slice();
  next[idx] = {
    ...entry,
    id: prev[idx].id,
  };
  return next;
}

/** Çalışırken gösterilecek tek canlı satır. */
export function getLiveAgentLine(entries: AgentLogEntry[]): AgentLogEntry | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].status === 'running') return entries[i];
  }
  return null;
}

function shortenSummaryText(text: string): string {
  const t = text.trim();
  if (t.length <= 72) return t;
  return `${t.slice(0, 69)}…`;
}

/**
 * Geçmişi Cursor gibi sıkıştır: her kullanıcı isteği + kısa sonuç.
 * Ara adımlar (dosya dosya, heartbeat) düşer.
 */
export function compactAgentHistory(entries: AgentLogEntry[]): AgentLogEntry[] {
  const out: AgentLogEntry[] = [];
  let i = 0;
  while (i < entries.length) {
    const e = entries[i];
    if (e.kind === 'chat') {
      out.push({ ...e, path: undefined });
      i += 1;
      let summary: AgentLogEntry | null = null;
      while (i < entries.length && entries[i].kind !== 'chat') {
        const cur = entries[i];
        if (cur.status === 'done' || cur.status === 'error') {
          summary = cur;
        }
        i += 1;
      }
      if (summary) {
        out.push(
          normalizeAgentEntry({
            kind: 'status',
            text: shortenSummaryText(summary.text),
            status: summary.status,
            lane: 'summary',
          })
        );
      }
      continue;
    }
    let orphan: AgentLogEntry | null = null;
    while (i < entries.length && entries[i].kind !== 'chat') {
      const cur = entries[i];
      if (cur.status === 'done' || cur.status === 'error') orphan = cur;
      i += 1;
    }
    if (orphan) {
      out.push(
        normalizeAgentEntry({
          kind: 'status',
          text: shortenSummaryText(orphan.text),
          status: orphan.status,
          lane: 'summary',
        })
      );
    }
  }
  return out;
}

/** Tur bitince tek satırlık özet. */
export function buildTurnSummary(opts: {
  iterating: boolean;
  fileCount: number;
  writtenCount?: number | null;
  writeError?: string | null;
}): AgentLogEntry {
  let text: string;
  if (opts.writeError) {
    text = opts.iterating
      ? `Güncellendi · IDE yazımı başarısız`
      : `${opts.fileCount} dosya · IDE yazımı başarısız`;
  } else if (opts.writtenCount && opts.writtenCount > 0) {
    text = opts.iterating
      ? `${opts.writtenCount} dosya güncellendi`
      : `${opts.fileCount} dosya hazır · IDE’ye yazıldı`;
  } else {
    text = opts.iterating
      ? `${opts.fileCount} dosya güncellendi`
      : `${opts.fileCount} dosya hazır`;
  }
  return normalizeAgentEntry({
    kind: 'status',
    text,
    status: opts.writeError ? 'error' : 'done',
    lane: 'summary',
  });
}
