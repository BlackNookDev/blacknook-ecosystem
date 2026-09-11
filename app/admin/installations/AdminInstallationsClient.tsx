'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/apiUrl';
import { cn } from '@/lib/utils';

type RequestRow = {
  id: number;
  serviceSlug: string;
  serviceName: string;
  companyName: string;
  email: string;
  requirements: string;
  deploymentType: string | null;
  deploymentLabel: string;
  status: string;
  createdAt: string;
};

export default function AdminInstallationsClient() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('active');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs =
        filter === 'all'
          ? 'scope=admin'
          : `scope=admin&status=${filter}`;
      const res = await apiFetch(`/api/installation-request?${qs}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Yüklenemedi.');
        setRows([]);
        return;
      }
      setRows(Array.isArray(data.requests) ? data.requests : []);
    } catch {
      setError('Bağlantı hatası.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: number, status: 'active' | 'closed' | 'cancelled') => {
    setBusyId(id);
    try {
      const res = await apiFetch('/api/installation-request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === 'string' ? data.error : 'Güncellenemedi.');
        return;
      }
      await load();
    } catch {
      setError('Güncelleme başarısız.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ['active', 'Aktif'],
            ['closed', 'Kapalı'],
            ['all', 'Tümü'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              filter === id
                ? 'bg-white text-zinc-950'
                : 'border border-white/10 text-zinc-400 hover:text-zinc-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mb-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Yükleniyor…
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-zinc-500">Kayıt yok.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-zinc-50">
                    #{row.id} · {row.serviceName}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {row.companyName} · {row.email} ·{' '}
                    {new Date(row.createdAt).toLocaleString('tr-TR')}
                  </p>
                  <p className="mt-2 text-sm text-teal-200/90">{row.deploymentLabel}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                    row.status === 'active'
                      ? 'bg-teal-500/15 text-teal-200'
                      : 'bg-white/10 text-zinc-400'
                  )}
                >
                  {row.status}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {row.requirements}
              </p>
              {row.status === 'active' ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => void setStatus(row.id, 'closed')}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-zinc-950 disabled:opacity-50"
                  >
                    Tamamlandı / kapat
                  </button>
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => void setStatus(row.id, 'cancelled')}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-zinc-300 disabled:opacity-50"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => void setStatus(row.id, 'active')}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-zinc-300 disabled:opacity-50"
                  >
                    Yeniden aç
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
