'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Inbox, Loader2, Send } from 'lucide-react';
import { apiFetch } from '@/lib/apiUrl';
import { cn } from '@/lib/utils';

type Peer = {
  id: number;
  name: string;
  initials: string;
  color: string;
  skills: string;
};

type InboxItem = {
  id: number;
  matchNeed: string;
  peer: Peer;
  lastMessage: { body: string; createdAt: string; senderId: number } | null;
  unread: number;
  updatedAt: string;
};

type ThreadMessage = {
  id: number;
  senderId: number;
  body: string;
  createdAt: string;
  mine: boolean;
};

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function MessagesInbox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = Number(searchParams.get('c') || 0) || null;

  const [items, setItems] = useState<InboxItem[]>([]);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [matchNeed, setMatchNeed] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) || null,
    [items, selectedId]
  );

  const loadList = useCallback(async () => {
    try {
      const res = await apiFetch('/api/messages');
      const data = (await res.json().catch(() => ({}))) as {
        conversations?: InboxItem[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || 'Mesajlar yüklenemedi.');
        return;
      }
      setItems(data.conversations || []);
      setError('');
    } catch {
      setError('Mesajlar yüklenemedi.');
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadThread = useCallback(async (id: number, silent = false) => {
    if (!silent) setLoadingThread(true);
    try {
      const res = await apiFetch(`/api/messages?conversationId=${id}`);
      const data = (await res.json().catch(() => ({}))) as {
        conversation?: {
          matchNeed?: string;
          peer?: Peer | null;
          messages?: ThreadMessage[];
        };
      };
      if (!res.ok || !data.conversation) return;
      setPeer(data.conversation.peer || null);
      setMatchNeed(data.conversation.matchNeed || '');
      setMessages(data.conversation.messages || []);
    } finally {
      if (!silent) setLoadingThread(false);
    }
  }, []);

  useEffect(() => {
    void loadList();
    const id = window.setInterval(() => void loadList(), 8000);
    return () => window.clearInterval(id);
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      setPeer(null);
      setMatchNeed('');
      return;
    }
    void loadThread(selectedId);
    const id = window.setInterval(() => void loadThread(selectedId, true), 3000);
    return () => window.clearInterval(id);
  }, [selectedId, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, selectedId]);

  const openConversation = (id: number) => {
    router.replace(`/account/messages?c=${id}`, { scroll: false });
  };

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedId || !draft.trim() || sending) return;
    const text = draft.trim();
    setSending(true);
    setDraft('');
    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedId, body: text }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: ThreadMessage;
      };
      if (!res.ok) {
        setDraft(text);
        setError(data.error || 'Gönderilemedi.');
        return;
      }
      if (data.message) {
        setMessages((prev) => [...prev, data.message!]);
      }
      void loadList();
    } catch {
      setDraft(text);
      setError('Gönderilemedi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid min-h-[32rem] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] lg:grid-cols-[18rem_1fr]">
      <aside className={cn('border-white/[0.08] lg:border-r', selectedId ? 'hidden lg:block' : 'block')}>
        {loadingList ? (
          <div className="flex items-center gap-2 px-4 py-8 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Yükleniyor…
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Inbox className="mx-auto h-8 w-8 text-zinc-600" aria-hidden />
            <p className="mt-3 text-sm font-medium text-zinc-300">Henüz konuşma yok</p>
            <p className="mt-1 text-sm text-zinc-500">
              Navbar’daki Destek ile bir talep gönderince sohbet burada açılır.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {items.map((item) => {
              const active = item.id === selectedId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openConversation(item.id)}
                    className={cn(
                      'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors',
                      active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                    )}
                  >
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-black"
                      style={{ backgroundColor: item.peer.color }}
                    >
                      {item.peer.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-zinc-100">
                          {item.peer.name}
                        </span>
                        {item.unread > 0 ? (
                          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                            {item.unread}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-zinc-500">
                        {item.lastMessage?.body || item.matchNeed || 'Yeni destek talebi'}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <section className={cn('flex min-h-[32rem] flex-col', selectedId ? 'flex' : 'hidden lg:flex')}>
        {!selectedId ? (
          <div className="flex flex-1 items-center justify-center px-6 text-sm text-zinc-500">
            Soldan bir konuşma seçin.
          </div>
        ) : loadingThread && !messages.length ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Konuşma yükleniyor…
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
              <button
                type="button"
                onClick={() => router.replace('/account/messages', { scroll: false })}
                className="text-xs font-medium text-zinc-500 lg:hidden"
              >
                ← Liste
              </button>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-black"
                style={{ backgroundColor: (peer || selected?.peer)?.color }}
              >
                {(peer || selected?.peer)?.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {(peer || selected?.peer)?.name}
                </p>
                {(peer || selected?.peer)?.skills ? (
                  <p className="truncate text-xs text-zinc-500">{(peer || selected?.peer)?.skills}</p>
                ) : null}
              </div>
            </header>

            {matchNeed ? (
              <p className="border-b border-white/[0.06] px-4 py-2 text-xs text-zinc-500">
                Talep: {matchNeed}
              </p>
            ) : null}

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.mine ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                      msg.mine
                        ? 'bg-white text-black'
                        : 'border border-white/10 bg-white/[0.05] text-zinc-100'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.body}</p>
                    <p className={cn('mt-1 text-[10px]', msg.mine ? 'text-black/50' : 'text-zinc-500')}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {error ? <p className="px-4 text-xs text-rose-300">{error}</p> : null}

            <form onSubmit={onSend} className="flex gap-2 border-t border-white/[0.08] p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={4000}
                placeholder="Mesaj yazın…"
                className="h-11 flex-1 rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Gönder
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
