'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { apiFetch } from '@/lib/apiUrl';
import {
  DEPLOYMENT_OPTIONS,
  type DeploymentOptionId,
} from '@/lib/deploymentOptions';
import { cn } from '@/lib/utils';

const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'En kısa sürede' },
  { id: '2w', label: '2 hafta içinde' },
  { id: '1m', label: '1 ay içinde' },
  { id: 'flex', label: 'Esnek / planlayacağız' },
] as const;

type Props = {
  serviceSlug: string;
  serviceName: string;
  intentHint?: string;
};

export default function InstallRequestForm({
  serviceSlug,
  serviceName,
  intentHint = '',
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const email = session?.user?.email || '';

  const [deploymentType, setDeploymentType] = useState<DeploymentOptionId | ''>('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [timeline, setTimeline] = useState<(typeof TIMELINE_OPTIONS)[number]['id'] | ''>('');
  const [currentStack, setCurrentStack] = useState('');
  const [requirements, setRequirements] = useState(intentHint);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setContactName(session.user.name);
  }, [session?.user?.name]);

  const composedRequirements = useMemo(() => {
    const lines: string[] = [];
    if (requirements.trim()) lines.push(requirements.trim());
    if (contactName.trim()) lines.push(`İlgili kişi: ${contactName.trim()}`);
    if (roleTitle.trim()) lines.push(`Rol: ${roleTitle.trim()}`);
    if (phone.trim()) lines.push(`Telefon: ${phone.trim()}`);
    if (teamSize.trim()) lines.push(`Ekip / kullanıcı sayısı: ${teamSize.trim()}`);
    if (timeline) {
      const label = TIMELINE_OPTIONS.find((t) => t.id === timeline)?.label;
      if (label) lines.push(`Başlangıç tercihi: ${label}`);
    }
    if (currentStack.trim()) lines.push(`Mevcut sistemler: ${currentStack.trim()}`);
    return lines.join('\n');
  }, [
    requirements,
    contactName,
    roleTitle,
    phone,
    teamSize,
    timeline,
    currentStack,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!deploymentType) {
      setError('Kurulum ortamı seçimi gerekli.');
      return;
    }
    if (!companyName.trim() || !requirements.trim()) {
      setError('Şirket adı ve ihtiyaç açıklaması gerekli.');
      return;
    }
    if (!email) {
      setError('Oturum e-postası bulunamadı. Yeniden giriş yapın.');
      return;
    }

    setSending(true);
    try {
      const res = await apiFetch('/api/installation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug,
          serviceName,
          requirements: composedRequirements,
          companyName: companyName.trim(),
          email,
          deploymentType,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Talep gönderilemedi.');
        return;
      }
      setDone(true);
      window.setTimeout(() => router.push('/account/requests'), 1600);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center sm:px-8">
        <p className="text-sm font-medium text-zinc-100">Talebiniz kaydedildi</p>
        <p className="mt-2 text-sm text-zinc-500">
          Operasyon ekibi e-posta ile bilgilendirildi. Talepler listesine yönlendiriliyorsunuz…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Seçilen ajan
        </p>
        <p className="mt-1 font-display text-lg font-semibold text-white">{serviceName}</p>
        <p className="mt-1 text-xs text-zinc-500">{serviceSlug}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Yönetilen kurulum talebi. Blacknook operasyon ekibi süreci uçtan uca yürütür.
        </p>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-zinc-200">Kurulum ortamı</legend>
        <div className="space-y-2">
          {DEPLOYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={cn(
                'flex cursor-pointer gap-3 rounded-xl border px-3 py-3 transition-colors',
                deploymentType === opt.id
                  ? 'border-white/25 bg-white/[0.06]'
                  : 'border-white/10 bg-zinc-950/60 hover:border-white/18'
              )}
            >
              <input
                type="radio"
                name="deploymentType"
                value={opt.id}
                checked={deploymentType === opt.id}
                onChange={() => setDeploymentType(opt.id)}
                className="mt-1"
                required
              />
              <span>
                <span className="block text-sm font-medium text-zinc-100">{opt.label}</span>
                <span className="mt-0.5 block text-xs text-zinc-500">{opt.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="ir-company" className="mb-2 block text-sm font-medium text-zinc-300">
            Şirket adı
          </label>
          <input
            id="ir-company"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
            placeholder="Şirket veya kurum adı"
          />
        </div>
        <div>
          <label htmlFor="ir-contact" className="mb-2 block text-sm font-medium text-zinc-300">
            İlgili kişi
          </label>
          <input
            id="ir-contact"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
            placeholder="Ad soyad"
          />
        </div>
        <div>
          <label htmlFor="ir-role" className="mb-2 block text-sm font-medium text-zinc-300">
            Rol / unvan
          </label>
          <input
            id="ir-role"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
            placeholder="Örn. IT Müdürü"
          />
        </div>
        <div>
          <label htmlFor="ir-phone" className="mb-2 block text-sm font-medium text-zinc-300">
            Telefon (opsiyonel)
          </label>
          <input
            id="ir-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
            placeholder="+90…"
          />
        </div>
        <div>
          <label htmlFor="ir-email" className="mb-2 block text-sm font-medium text-zinc-300">
            E-posta
          </label>
          <input
            id="ir-email"
            type="email"
            value={email}
            readOnly
            className="h-11 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-zinc-400"
          />
        </div>
        <div>
          <label htmlFor="ir-team" className="mb-2 block text-sm font-medium text-zinc-300">
            Kullanıcı / şube sayısı
          </label>
          <input
            id="ir-team"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
            placeholder="Örn. 12 şube, 40 kullanıcı"
          />
        </div>
        <div>
          <label htmlFor="ir-timeline" className="mb-2 block text-sm font-medium text-zinc-300">
            Başlangıç tercihi
          </label>
          <select
            id="ir-timeline"
            value={timeline}
            onChange={(e) =>
              setTimeline(e.target.value as (typeof TIMELINE_OPTIONS)[number]['id'] | '')
            }
            className="h-11 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-zinc-100 outline-none focus:border-white/30"
          >
            <option value="">Seçin…</option>
            {TIMELINE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ir-stack" className="mb-2 block text-sm font-medium text-zinc-300">
            Mevcut sistemler (ERP, muhasebe, WhatsApp vb.)
          </label>
          <input
            id="ir-stack"
            value={currentStack}
            onChange={(e) => setCurrentStack(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
            placeholder="Örn. Logo Tiger, Excel, WhatsApp Business"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ir-need" className="mb-2 block text-sm font-medium text-zinc-300">
            İhtiyaç ve kurulum hedefi
          </label>
          <textarea
            id="ir-need"
            required
            rows={6}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder={`${serviceName} için ne kurmak istediğinizi, süreçlerinizi ve başarı kriterinizi yazın…`}
            className="w-full resize-y rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/account/requests"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-zinc-300 hover:bg-white/[0.04]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Taleplerime dön
        </Link>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-zinc-950 hover:opacity-90 disabled:opacity-50"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Send className="h-4 w-4" aria-hidden />
          )}
          {sending ? 'Gönderiliyor…' : 'Talebi gönder'}
        </button>
      </div>
    </form>
  );
}
