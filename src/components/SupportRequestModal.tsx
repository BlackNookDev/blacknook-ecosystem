'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { AnimatePresence, m } from 'framer-motion';
import {
  Loader2,
  Send,
  Shield,
  UserRound,
  X,
} from 'lucide-react';
import { duration, easePremium } from '@/components/motion/tokens';
import { apiFetch } from '@/lib/apiUrl';
import { supportSuccessTitle } from '@/lib/supportDisplay';
import {
  buildSupportNeedSummary,
  summarizeChatForTicket,
  type SupportCategory,
  type SupportChatMessage,
  type SupportUrgency,
} from '@/lib/supportAssistant';
import { useLocale, useTranslations } from '@/components/LocaleProvider';

type Phase = 'chat' | 'escalate' | 'matching' | 'done' | 'error';

type Assigned = {
  name: string;
  skills?: string;
  initials: string;
  color: string;
  role?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const URGENCY_OPTIONS: SupportUrgency[] = ['today', '48h', 'week'];
const CATEGORY_OPTIONS: SupportCategory[] = [
  'incident',
  'security',
  'install',
  'integration',
  'advisory',
  'other',
];

export default function SupportRequestModal({ open, onClose }: Props) {
  const { data: session } = useSession();
  const { t: ts } = useTranslations('support');
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('chat');
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [urgency, setUrgency] = useState<SupportUrgency | undefined>('48h');
  const [category, setCategory] = useState<SupportCategory | undefined>();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestCompany, setGuestCompany] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [assigned, setAssigned] = useState<Assigned | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setPhase('chat');
      setMessages([]);
      setInput('');
      setSending(false);
      setUrgency('48h');
      setCategory(undefined);
      setGuestName('');
      setGuestEmail('');
      setGuestCompany('');
      setSubmitError('');
      setAssigned(null);
      setConversationId(null);
      setRequestId(null);
      return;
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setMessages([{ role: 'assistant', content: ts('welcome') }]);

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, ts]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase, sending]);

  const sendChat = useCallback(async () => {
    const text = input.trim();
    if (!text || sending || phase !== 'chat') return;

    const nextMessages: SupportChatMessage[] = [...messages, { role: 'user', content: text }];
    setInput('');
    setMessages(nextMessages);
    setSending(true);
    setSubmitError('');

    try {
      const res = await apiFetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setSubmitError(data.error || 'Asistan yanıt veremedi.');
        setMessages(nextMessages);
        return;
      }
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setSubmitError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  }, [input, messages, phase, sending]);

  const startEscalate = () => {
    if (messages.filter((m) => m.role === 'user').length === 0) {
      setSubmitError(ts('writeFirst'));
      return;
    }
    setSubmitError('');
    if (isLoggedIn) {
      void submitToTeam();
      return;
    }
    setPhase('escalate');
  };

  const submitToTeam = async () => {
    if (phase === 'matching' || phase === 'done') return;

    const email = isLoggedIn
      ? session?.user?.email || ''
      : guestEmail.trim().toLowerCase();
    const name = isLoggedIn
      ? session?.user?.name || 'Kullanıcı'
      : guestName.trim();

    if (!isLoggedIn) {
      if (!name || !email) {
        setSubmitError('Ad ve e-posta gerekli.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setSubmitError('Geçerli bir e-posta girin.');
        return;
      }
    }

    setSubmitError('');
    setPhase('matching');

    const chatSummary = summarizeChatForTicket(messages);
    const need = buildSupportNeedSummary({
      urgency,
      category,
      chatSummary,
    });

    try {
      const res = await apiFetch('/api/support/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          need,
          name: isLoggedIn ? undefined : name,
          email: isLoggedIn ? session?.user?.email : email,
          companyName: guestCompany.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setSubmitError(data.error || ts('failed'));
        setPhase(isLoggedIn ? 'chat' : 'escalate');
        return;
      }
      setRequestId(null);
      setAssigned({
        name: 'Blacknook Destek',
        initials: 'BN',
        color: '#14B8A6',
        role: 'E-posta',
      });
      setConversationId(null);
      setPhase('done');
    } catch {
      setSubmitError(ts('failed'));
      setPhase(isLoggedIn ? 'chat' : 'escalate');
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[220] flex flex-col bg-[var(--bn-bg,#050505)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easePremium }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-title"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute left-1/2 top-1/4 h-[50vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.08),transparent_65%)] blur-2xl" />
          </div>

          <div className="relative flex items-center justify-between border-b border-[var(--bn-card-border)] px-5 py-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <Shield className="h-4 w-4 shrink-0 text-teal-400" aria-hidden />
              <div className="min-w-0">
                <p id="support-title" className="truncate text-sm font-semibold text-[var(--bn-heading)]">
                  {ts('title')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--bn-card-border)] text-[var(--bn-subtitle)] transition-colors hover:bg-[var(--bn-hover-surface)] hover:text-[var(--bn-heading)]"
              aria-label={ts('close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {(phase === 'chat' || phase === 'escalate') && (
            <div className="relative border-b border-[var(--bn-card-border)] px-4 py-3 sm:px-8">
              <div className="mx-auto flex max-w-2xl flex-wrap gap-2">
                {URGENCY_OPTIONS.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgency(u)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      urgency === u
                        ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/30'
                        : 'bn-chip text-[var(--bn-chip-text)] hover:opacity-90'
                    }`}
                  >
                    {ts(`urgency.${u}`)}
                  </button>
                ))}
              </div>
              <div className="mx-auto mt-2 flex max-w-2xl flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(category === c ? undefined : c)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      category === c
                        ? 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/25'
                        : 'bn-chip text-[var(--bn-chip-text)] hover:opacity-90'
                    }`}
                  >
                    {ts(`category.${c}`)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative flex min-h-0 flex-1 flex-col">
            {(phase === 'chat' || phase === 'escalate') && (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-4 py-5 sm:px-8"
                >
                  <div className="mx-auto flex max-w-2xl flex-col gap-4">
                    {messages.map((msg, i) => (
                      <div
                        key={`${msg.role}-${i}`}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-[var(--bn-cta-bg)] text-[var(--bn-cta-text)]'
                              : 'border border-[var(--bn-card-border)] bg-[var(--bn-chip-bg)] text-[var(--bn-text)]'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {sending && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-2 rounded-2xl border border-[var(--bn-card-border)] bg-[var(--bn-chip-bg)] px-4 py-3 text-sm text-[var(--bn-subtitle)]">
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          {ts('connecting')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {phase === 'escalate' && (
                  <div className="border-t border-[var(--bn-card-border)] bg-[var(--bn-surface)] px-4 py-4 sm:px-8">
                    <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
                      <label className="block sm:col-span-2">
                        <span className="mb-1 block text-xs font-medium text-[var(--bn-subtitle)]">
                          {ts('guestName')}
                        </span>
                        <input
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full rounded-xl border border-[var(--bn-card-border)] bg-[var(--bn-chip-bg)] px-3 py-2 text-sm text-[var(--bn-text)] outline-none focus:border-teal-400/40"
                          autoComplete="name"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-[var(--bn-subtitle)]">
                          {ts('guestEmail')}
                        </span>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full rounded-xl border border-[var(--bn-card-border)] bg-[var(--bn-chip-bg)] px-3 py-2 text-sm text-[var(--bn-text)] outline-none focus:border-teal-400/40"
                          autoComplete="email"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-[var(--bn-subtitle)]">
                          {ts('guestCompany')}
                        </span>
                        <input
                          value={guestCompany}
                          onChange={(e) => setGuestCompany(e.target.value)}
                          className="w-full rounded-xl border border-[var(--bn-card-border)] bg-[var(--bn-chip-bg)] px-3 py-2 text-sm text-[var(--bn-text)] outline-none focus:border-teal-400/40"
                        />
                      </label>
                    </div>
                    <div className="mx-auto mt-3 flex max-w-2xl gap-2">
                      <button
                        type="button"
                        onClick={() => setPhase('chat')}
                        className="h-11 flex-1 rounded-xl border border-[var(--bn-card-border)] text-sm font-semibold text-[var(--bn-text)]"
                      >
                        {ts('back')}
                      </button>
                      <button
                        type="button"
                        onClick={() => void submitToTeam()}
                        className="h-11 flex-[2] rounded-xl bg-teal-500 text-sm font-bold text-black hover:bg-teal-400"
                      >
                        {ts('submitRequest')}
                      </button>
                    </div>
                  </div>
                )}

                {phase === 'chat' && (
                  <div className="border-t border-[var(--bn-card-border)] px-4 py-4 sm:px-8">
                    {submitError && (
                      <p className="mx-auto mb-2 max-w-2xl text-center text-xs text-red-400">
                        {submitError}
                      </p>
                    )}
                    <form
                      className="mx-auto flex max-w-2xl gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void sendChat();
                      }}
                    >
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={ts('placeholder')}
                        disabled={sending}
                        className="min-w-0 flex-1 rounded-xl border border-[var(--bn-card-border)] bg-[var(--bn-chip-bg)] px-4 py-3 text-sm text-[var(--bn-text)] outline-none placeholder:text-[var(--bn-faint)] focus:border-teal-400/40"
                      />
                      <button
                        type="submit"
                        disabled={sending || !input.trim()}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bn-cta-bg)] text-[var(--bn-cta-text)] disabled:opacity-50"
                        aria-label={ts('send')}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                    <button
                      type="button"
                      onClick={startEscalate}
                      className="mx-auto mt-3 flex h-11 w-full max-w-2xl items-center justify-center gap-2 rounded-xl border border-teal-400/30 bg-teal-500/10 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-500/15"
                    >
                      <UserRound className="h-4 w-4" aria-hidden />
                      {ts('escalate')}
                    </button>
                  </div>
                )}
              </>
            )}

            {(phase === 'matching' || phase === 'done' || phase === 'error') && (
              <div className="flex flex-1 items-center justify-center px-5 py-10">
                <m.div
                  className="w-full max-w-md rounded-2xl border border-[var(--bn-card-border)] bg-[var(--bn-chip-bg)] p-8 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {phase === 'matching' ? (
                    <>
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-400" />
                      <p className="mt-4 font-display text-lg font-semibold text-[var(--bn-heading)]">
                        Talep iletiliyor…
                      </p>
                      <p className="mt-2 text-sm text-[var(--bn-subtitle)]">
                        Talebiniz e-posta ile ekibe iletiliyor…
                      </p>
                    </>
                  ) : phase === 'done' ? (
                    <>
                      <Shield className="mx-auto h-10 w-10 text-teal-400" />
                      <p className="mt-4 font-display text-lg font-semibold text-[var(--bn-heading)]">
                        {assigned
                          ? supportSuccessTitle(assigned.name)
                          : ts('doneReceived')}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--bn-subtitle)]">
                        Talebiniz e-posta ile ekibe iletildi. Kurulum için ürün
                        sayfasından “Kurulum Talep Et” kullanın.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-6 h-11 rounded-xl border border-[var(--bn-card-border)] px-6 text-sm font-semibold text-[var(--bn-text)]"
                      >
                        {ts('close')}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-lg font-semibold text-[var(--bn-heading)]">
                        {ts('failed')}
                      </p>
                      <p className="mt-2 text-sm text-[var(--bn-subtitle)]">{submitError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitError('');
                          setPhase('chat');
                        }}
                        className="mt-6 h-11 rounded-xl bg-[var(--bn-cta-bg)] px-6 text-sm font-semibold text-[var(--bn-cta-text)]"
                      >
                        {ts('retry')}
                      </button>
                    </>
                  )}
                </m.div>
              </div>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
