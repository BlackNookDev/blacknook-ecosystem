'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MessageSquare, Wrench } from 'lucide-react';
import AccountSection from '@/components/account/AccountSection';
import { apiFetch } from '@/lib/apiUrl';
import { AUTH_IDENTITY_EVENT, getAuthIdentity } from '@/lib/authIdentity';

type MatchRequest = {
  id: number;
  need: string;
  status: string;
  createdAt: string;
  conversationId?: number | null;
  assigned?: { name: string; skills?: string } | null;
};

type InstallRequest = {
  id: number;
  serviceSlug: string;
  serviceName: string;
  companyName: string;
  requirements: string;
  status: string;
  createdAt: string;
};

function statusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Aktif';
    case 'closed':
      return 'Tamamlandı';
    case 'cancelled':
      return 'İptal';
    default:
      return status;
  }
}

function statusClass(status: string) {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/15 text-emerald-300';
    case 'closed':
      return 'bg-zinc-500/20 text-zinc-300';
    case 'cancelled':
      return 'bg-rose-500/15 text-rose-300';
    default:
      return 'bg-white/10 text-zinc-300';
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function ActiveRequestsSection() {
  const [matches, setMatches] = useState<MatchRequest[]>([]);
  const [installs, setInstalls] = useState<InstallRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const user = getAuthIdentity();
    if (!user?.email) {
      setMatches([]);
      setInstalls([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [matchRes, installRes] = await Promise.all([
        apiFetch('/api/match-request?status=all'),
        apiFetch('/api/installation-request'),
      ]);
      const matchData = (await matchRes.json().catch(() => ({}))) as {
        requests?: MatchRequest[];
        error?: string;
      };
      const installData = (await installRes.json().catch(() => ({}))) as {
        requests?: InstallRequest[];
        error?: string;
      };
      if (!matchRes.ok && !installRes.ok) {
        setError(matchData.error || installData.error || 'Talepler yüklenemedi.');
        setMatches([]);
        setInstalls([]);
        return;
      }
      setMatches(matchRes.ok ? matchData.requests || [] : []);
      setInstalls(installRes.ok ? installData.requests || [] : []);
    } catch {
      setError('Talepler yüklenemedi.');
      setMatches([]);
      setInstalls([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const onAuth = () => void load();
    window.addEventListener(AUTH_IDENTITY_EVENT, onAuth);
    window.addEventListener('focus', onAuth);
    return () => {
      window.removeEventListener(AUTH_IDENTITY_EVENT, onAuth);
      window.removeEventListener('focus', onAuth);
    };
  }, [load]);

  return (
    <>
      <AccountSection
        title="Destek talepleri"
        description="Destek talepleriniz. Atanan kişiyle Mesajlar üzerinden yazışın."
      >
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Yükleniyor…
          </div>
        ) : error ? (
          <p className="text-sm text-rose-300">{error}</p>
        ) : matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-8 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-zinc-600" aria-hidden />
            <p className="mt-3 text-sm font-medium text-zinc-300">Destek talebiniz yok</p>
            <p className="mt-1 text-sm text-zinc-500">
              Navbar’daki Destek ile ihtiyacınızı ilettiğinizde burada görünecek.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {matches.map((req) => (
              <li
                key={req.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClass(req.status)}`}
                  >
                    {statusLabel(req.status)}
                  </span>
                  <time className="text-xs text-zinc-500" dateTime={req.createdAt}>
                    {formatDate(req.createdAt)}
                  </time>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-200">{req.need}</p>
                {req.assigned ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    {req.assigned.name === 'Bir geliştirici'
                      ? 'Teknik ekibe bağlandınız'
                      : `Atanan: ${req.assigned.name}${req.assigned.skills ? ` · ${req.assigned.skills}` : ''}`}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500">Ekip inceliyor</p>
                )}
                {req.conversationId ? (
                  <Link
                    href={`/account/messages?c=${req.conversationId}`}
                    className="mt-3 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
                  >
                    Mesaja git
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </AccountSection>

      <AccountSection
        title="Kurulum talepleri"
        description="Servis sayfasından gönderdiğiniz kurulum talepleri."
      >
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Yükleniyor…
          </div>
        ) : installs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-8 text-center">
            <Wrench className="mx-auto h-8 w-8 text-zinc-600" aria-hidden />
            <p className="mt-3 text-sm font-medium text-zinc-300">Kurulum talebiniz yok</p>
            <p className="mt-1 text-sm text-zinc-500">
              Bir servis sayfasından kurulum talebi gönderdiğinizde burada görünecek.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {installs.map((req) => (
              <li
                key={req.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClass(req.status)}`}
                  >
                    {statusLabel(req.status)}
                  </span>
                  <time className="text-xs text-zinc-500" dateTime={req.createdAt}>
                    {formatDate(req.createdAt)}
                  </time>
                </div>
                <p className="mt-3 text-sm font-medium text-zinc-100">
                  <Link href={`/service/${req.serviceSlug}`} className="hover:text-white">
                    {req.serviceName}
                  </Link>
                </p>
                <p className="mt-1 text-xs text-zinc-500">{req.companyName}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{req.requirements}</p>
              </li>
            ))}
          </ul>
        )}
      </AccountSection>
    </>
  );
}
