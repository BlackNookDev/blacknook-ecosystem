'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Wrench } from 'lucide-react';
import AccountSection from '@/components/account/AccountSection';
import { apiFetch } from '@/lib/apiUrl';
import { AUTH_IDENTITY_EVENT, getAuthIdentity } from '@/lib/authIdentity';

type InstallRequest = {
  id: number;
  serviceSlug: string;
  serviceName: string;
  companyName: string;
  requirements: string;
  deploymentLabel?: string;
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
  const [installs, setInstalls] = useState<InstallRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const user = getAuthIdentity();
    if (!user?.email) {
      setInstalls([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const installRes = await apiFetch('/api/installation-request');
      const installData = (await installRes.json().catch(() => ({}))) as {
        requests?: InstallRequest[];
        error?: string;
      };
      if (!installRes.ok) {
        setError(installData.error || 'Talepler yüklenemedi.');
        setInstalls([]);
        return;
      }
      setInstalls(installData.requests || []);
    } catch {
      setError('Talepler yüklenemedi.');
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
    <AccountSection
      title="Kurulum talepleri"
      description="Gönderdiğiniz kurulum talepleri. Operasyon ekibi e-posta ile de bilgilendirilir."
    >
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Yükleniyor…
        </div>
      ) : error ? (
        <p className="text-sm text-rose-300">{error}</p>
      ) : installs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-8 text-center">
          <Wrench className="mx-auto h-8 w-8 text-zinc-600" aria-hidden />
          <p className="mt-3 text-sm font-medium text-zinc-300">Kurulum talebiniz yok</p>
          <p className="mt-1 text-sm text-zinc-500">
            Katalogdan bir ajan seçip “Kurulum Talep Et” deyin. Giriş yoksa kayıt ekranına
            yönlendirilirsiniz; ardından detaylı formu doldurursunuz.
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
              {req.deploymentLabel ? (
                <p className="mt-1 text-xs text-teal-300/80">{req.deploymentLabel}</p>
              ) : null}
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{req.requirements}</p>
            </li>
          ))}
        </ul>
      )}
    </AccountSection>
  );
}
