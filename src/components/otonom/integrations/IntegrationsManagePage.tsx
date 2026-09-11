'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CalendarClock, Loader2, RefreshCw, Send } from 'lucide-react';
import {
  CATEGORY_LABELS,
  CORPORATE_APPS,
  type CompanyIntegration,
  type CorporateAppCategory,
  type IntegrationProvider,
  type IntegrationStatus,
} from '@/lib/companyIntegrations';
import { cn } from '@/lib/utils';
import { ProviderLogo } from '@/components/otonom/integrations/ProviderLogo';
import SetupBookingModal from '@/components/otonom/integrations/SetupBookingModal';

type ApiIntegration = CompanyIntegration & {
  statusLabel?: string;
};

const IT_SYSTEM_OPTIONS = [
  'Logo Tiger / Go3',
  'Mikro ERP',
  'SQL Veritabanı',
  'Yerel Ağ / VPN',
  'Diğer kurumsal sistem',
];

const CATEGORY_FILTERS: Array<'all' | CorporateAppCategory> = [
  'all',
  'isbirligi',
  'crm-destek',
  'ik-isealim',
  'finans-erp',
  'pazarlama',
  'gelistirme-it',
  'belge-depolama',
];

function StatusBadge({ status }: { status: IntegrationStatus }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Aktif
      </span>
    );
  }
  if (status === 'pending_it' || status === 'action_required') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Bekliyor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
      Kapalı
    </span>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-[var(--bn-heading)]">{title}</h2>
      {children}
    </section>
  );
}

export default function IntegrationsManagePage() {
  const [items, setItems] = useState<ApiIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [category, setCategory] = useState<(typeof CATEGORY_FILTERS)[number]>('all');
  const [query, setQuery] = useState('');

  const [itName, setItName] = useState('');
  const [itEmail, setItEmail] = useState('');
  const [systems, setSystems] = useState<string[]>(['Logo Tiger / Go3']);

  const byProvider = useMemo(() => {
    const map = new Map<IntegrationProvider, ApiIntegration>();
    for (const item of items) map.set(item.provider, item);
    return map;
  }, [items]);

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CORPORATE_APPS.filter((app) => {
      if (category !== 'all' && app.category !== category) return false;
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.blurb.toLowerCase().includes(q) ||
        app.id.includes(q)
      );
    });
  }, [category, query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/integrations');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Bağlantılar yüklenemedi.');
      setItems(data.integrations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bağlantılar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const replaceItem = (next: CompanyIntegration) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.provider === next.provider || p.id === next.id);
      if (idx < 0) return [...prev, next];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...next };
      return copy;
    });
  };

  const oauthAction = async (provider: IntegrationProvider, action: 'connect' | 'disconnect') => {
    setBusy(`oauth-${provider}`);
    setNotice(null);
    try {
      const res = await fetch('/api/integrations/oauth/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'İşlem başarısız.');
      if (data.integration) replaceItem(data.integration);
      setNotice(data.message || 'Yetkilendirme güncellendi.');
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'İşlem başarısız.');
    } finally {
      setBusy(null);
    }
  };

  const submitIt = async () => {
    setBusy('it');
    setNotice(null);
    try {
      const res = await fetch('/api/integrations/delegate-it', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itName, itEmail, systems }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Davet gönderilemedi.');
      if (data.integration) replaceItem(data.integration);
      setNotice(data.message || 'Davet gönderildi.');
      setItName('');
      setItEmail('');
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Davet gönderilemedi.');
    } finally {
      setBusy(null);
    }
  };

  const itIntegration = byProvider.get('custom_it');

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--bn-heading)] md:text-3xl">
          Bağlantılar
        </h1>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-400 hover:border-white/20 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Yenile
        </button>
      </div>

      {notice ? (
        <p className="rounded-lg border border-teal-400/20 bg-teal-500/10 px-3 py-2 text-sm text-teal-100">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Yükleniyor…
        </div>
      ) : (
        <>
          <Section title="Kurumsal uygulamalar">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_FILTERS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCategory(id)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                      category === id
                        ? 'bg-white text-zinc-950'
                        : 'text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200'
                    )}
                  >
                    {id === 'all' ? 'Tümü' : CATEGORY_LABELS[id]}
                  </button>
                ))}
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara…"
                className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/25 sm:max-w-xs"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredApps.map((app) => {
                const item = byProvider.get(app.id);
                const connected = item?.status === 'connected';
                const busyKey = `oauth-${app.id}`;
                return (
                  <article
                    key={app.id}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-zinc-950/50 px-3 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <ProviderLogo provider={app.id} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-medium text-white">{app.name}</h3>
                        {item ? <StatusBadge status={item.status} /> : null}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-zinc-500">{app.blurb}</p>
                    </div>
                    <button
                      type="button"
                      disabled={busy === busyKey}
                      onClick={() =>
                        void oauthAction(app.id, connected ? 'disconnect' : 'connect')
                      }
                      className={cn(
                        'shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50',
                        connected
                          ? 'border border-white/10 text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                          : 'bg-white text-zinc-950 hover:bg-zinc-200'
                      )}
                    >
                      {busy === busyKey ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : connected ? (
                        'Kaldır'
                      ) : (
                        'Bağla'
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
            {filteredApps.length === 0 ? (
              <p className="text-sm text-zinc-500">Sonuç yok.</p>
            ) : null}
          </Section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="IT’ye delege et">
              <article className="rounded-xl border border-white/[0.08] bg-zinc-950/50 p-4">
                {itIntegration ? (
                  <div className="mb-3">
                    <StatusBadge status={itIntegration.status} />
                  </div>
                ) : null}
                <div className="space-y-3">
                  <input
                    value={itName}
                    onChange={(e) => setItName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
                    placeholder="IT sorumlusu adı"
                  />
                  <input
                    type="email"
                    value={itEmail}
                    onChange={(e) => setItEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
                    placeholder="Kurumsal e-posta"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {IT_SYSTEM_OPTIONS.map((opt) => {
                      const on = systems.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setSystems((prev) =>
                              on ? prev.filter((s) => s !== opt) : [...prev, opt]
                            )
                          }
                          className={cn(
                            'rounded-md border px-2 py-1 text-[11px]',
                            on
                              ? 'border-amber-400/30 bg-amber-500/10 text-amber-50'
                              : 'border-white/10 text-zinc-500'
                          )}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    disabled={busy === 'it' || !itName || !itEmail || !systems.length}
                    onClick={() => void submitIt()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50"
                  >
                    {busy === 'it' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Kurulum sihirbazı gönder
                  </button>
                </div>
              </article>
            </Section>

            <Section title="Canlı kurulum">
              <article className="flex h-full flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-950/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-500/10 text-teal-200">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-zinc-400">
                    Logo Tiger/Go3 veya yerel veritabanı için Blacknook mühendisleriyle canlı
                    devreye alma.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="mt-4 rounded-lg border border-teal-300/30 bg-teal-500/15 px-3 py-2 text-sm font-semibold text-teal-50 hover:bg-teal-500/25"
                >
                  Randevu al
                </button>
              </article>
            </Section>
          </div>
        </>
      )}

      <SetupBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
