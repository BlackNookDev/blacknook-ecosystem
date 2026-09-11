'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Code2,
  ExternalLink,
  Loader2,
  Play,
  RefreshCw,
  Square,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type WorkspaceState = {
  id: string;
  name: string;
  status: string;
  healthy: boolean;
  accessUrl: string | null;
};

type ApiPayload = {
  configured?: boolean;
  coderUrl?: string;
  workspace?: WorkspaceState | null;
  message?: string;
  error?: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Bekliyor',
  starting: 'Başlatılıyor',
  running: 'Çalışıyor',
  stopping: 'Durduruluyor',
  stopped: 'Durduruldu',
  failed: 'Hata',
  canceling: 'İptal ediliyor',
  canceled: 'İptal',
  unknown: 'Bilinmiyor',
};

type Props = {
  projectName?: string;
  className?: string;
  /** Tam ekran uygulama modu — sidebar/panel dışında */
  fullscreen?: boolean;
  /** Workspace yoksa otomatik oluştur / başlat */
  autoStart?: boolean;
};

export default function DeveloperWorkspace({
  projectName = 'default',
  className,
  fullscreen = false,
  autoStart = false,
}: Props) {
  const [configured, setConfigured] = useState(true);
  const [coderUrl, setCoderUrl] = useState('http://127.0.0.1:7080');
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const autoStartedRef = useRef(false);

  const applyPayload = useCallback((data: ApiPayload) => {
    setConfigured(data.configured !== false);
    if (data.coderUrl) setCoderUrl(data.coderUrl);
    setWorkspace(data.workspace ?? null);
    setMessage(data.message || null);
  }, []);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const q = workspace?.id
        ? `?workspaceId=${encodeURIComponent(workspace.id)}`
        : `?project=${encodeURIComponent(projectName)}`;
      const res = await fetch(`/api/workspace${q}`, { cache: 'no-store' });
      const data = (await res.json()) as ApiPayload;
      if (!res.ok) throw new Error(data.error || 'Durum alınamadı');
      applyPayload(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Durum alınamadı');
    } finally {
      setLoading(false);
    }
  }, [applyPayload, projectName, workspace?.id]);

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  useEffect(() => {
    if (!autoStart || autoStartedRef.current || loading || busy || !configured) return;
    if (workspace && !['stopped', 'failed', 'canceled'].includes(workspace.status)) {
      autoStartedRef.current = true;
      return;
    }
    autoStartedRef.current = true;
    void runAction(workspace ? 'start' : 'create');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot autostart
  }, [autoStart, loading, configured, workspace?.id, workspace?.status, busy]);

  useEffect(() => {
    if (!workspace) return;
    const active = ['starting', 'stopping', 'pending'].includes(workspace.status);
    if (!active) return;
    const t = setInterval(() => {
      void refresh();
    }, 4000);
    return () => clearInterval(t);
  }, [workspace, refresh]);

  const runAction = async (action: 'create' | 'start' | 'stop') => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          projectName,
          workspaceId: workspace?.id,
        }),
      });
      const data = (await res.json()) as ApiPayload & { workspace?: WorkspaceState };
      if (!res.ok) throw new Error(data.error || 'İşlem başarısız');
      if (data.workspace) setWorkspace(data.workspace);
      if (data.coderUrl) setCoderUrl(data.coderUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'İşlem başarısız');
    } finally {
      setBusy(false);
      void refresh();
    }
  };

  const status = workspace?.status || 'stopped';
  const isRunning = status === 'running';
  const isTransitioning = ['starting', 'stopping', 'pending'].includes(status);
  const iframeSrc =
    isRunning && workspace?.accessUrl ? workspace.accessUrl : null;

  return (
    <div className={cn(fullscreen ? 'flex h-full min-h-0 flex-col' : 'space-y-6', className)}>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-950',
          fullscreen ? 'rounded-none border-0' : 'rounded-2xl border border-white/[0.08]'
        )}
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="inline-flex items-center gap-2 text-sm text-zinc-200">
            <Code2 className="h-4 w-4 text-teal-400" aria-hidden />
            Blacknook Studio
            {workspace ? (
              <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs text-zinc-400">
                {STATUS_LABEL[status] || status}
                {workspace.healthy && isRunning ? ' · sağlıklı' : ''}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={busy || loading}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
              aria-label="Yenile"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>

            {!workspace || status === 'stopped' || status === 'failed' || status === 'canceled' ? (
              <button
                type="button"
                disabled={busy || !configured || isTransitioning}
                onClick={() => void runAction(workspace ? 'start' : 'create')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-teal-400 disabled:opacity-40"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden />
                )}
                {workspace ? 'Başlat' : 'Kendi sistemini oluştur'}
              </button>
            ) : (
              <button
                type="button"
                disabled={busy || !isRunning}
                onClick={() => void runAction('stop')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-3.5 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.12] disabled:opacity-40"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Square className="h-3.5 w-3.5" aria-hidden />
                )}
                Durdur
              </button>
            )}

            {workspace?.accessUrl ? (
              <a
                href={workspace.accessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/[0.1] hover:text-white"
              >
                Yeni sekme
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : (
              <a
                href={coderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/[0.1]"
              >
                Coder
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
          </div>
        </div>

        {iframeSrc ? (
          <iframe
            title="Blacknook Developer Workspace"
            src={iframeSrc}
            className={cn(
              'w-full flex-1 bg-zinc-900',
              fullscreen ? 'min-h-0' : 'h-[min(70vh,720px)]'
            )}
            allow="clipboard-read; clipboard-write"
          />
        ) : (
          <div
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center',
              fullscreen ? 'min-h-0' : 'min-h-[280px]'
            )}
          >
            <Terminal className="h-10 w-10 text-zinc-600" aria-hidden />
            <p className="max-w-md text-sm text-zinc-400">
              {loading
                ? 'Workspace durumu yükleniyor…'
                : !configured
                  ? 'Coder API yapılandırması eksik. Token ve şablon ID ayarlandıktan sonra workspace oluşturabilirsiniz.'
                  : isTransitioning
                    ? 'Ortam hazırlanıyor…'
                    : 'İzole geliştirici ortamınızı başlatın. Node.js, Python ve code-server hazır gelir.'}
            </p>
          </div>
        )}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      {message && !configured ? (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          {message}
        </p>
      ) : null}

      {!fullscreen ? (
        <ul className="grid gap-3 text-sm text-zinc-500 sm:grid-cols-3">
          <li className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="text-zinc-300">Altyapı</span>
            <p className="mt-1">Coder v2 · Docker izole konteyner</p>
          </li>
          <li className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="text-zinc-300">Kaynak</span>
            <p className="mt-1">2 vCPU · 2 GiB RAM</p>
          </li>
          <li className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="text-zinc-300">Stack</span>
            <p className="mt-1">Node LTS · Python 3 · Git · code-server</p>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
