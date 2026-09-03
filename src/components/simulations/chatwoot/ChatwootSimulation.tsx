'use client';

import { useMemo, useState, type ComponentType } from 'react';
import {
  Bot,
  Inbox,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Smile,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import SimTabNav from '@/components/simulations/shared/SimTabNav';
import {
  AGENT_PERFORMANCE,
  AI_SUGGESTIONS,
  CHANNEL_META,
  CONVERSATIONS,
  CW_NAV,
  INBOX_FILTERS,
  MACROS,
  REPORT_STATS,
  type ChatwootView,
  type Conversation,
  type Message,
} from '@/components/simulations/chatwoot/data';
import './simulation.css';

export default function ChatwootSimulation() {
  const [view, setView] = useState<ChatwootView>('inbox');
  const [filter, setFilter] = useState<(typeof INBOX_FILTERS)[number]>('Tümü');
  const [activeId, setActiveId] = useState(CONVERSATIONS[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const [threads, setThreads] = useState<Record<string, Message[]>>(() =>
    Object.fromEntries(CONVERSATIONS.map((c) => [c.id, c.messages]))
  );

  const conversations = useMemo(() => {
    return CONVERSATIONS.filter((c) => {
      if (filter === 'Bana atanan') return c.assignee === 'Siz';
      if (filter === 'Atanmamış') return !c.assignee;
      if (filter === 'Açık') return c.status === 'open';
      return true;
    });
  }, [filter]);

  const active = CONVERSATIONS.find((c) => c.id === activeId) ?? conversations[0];
  const messages = active ? threads[active.id] ?? [] : [];
  const suggestions = active ? AI_SUGGESTIONS[active.id] ?? [] : [];

  const sendMessage = (text: string) => {
    if (!active || !text.trim()) return;
    const msg: Message = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      name: 'Siz',
      text: text.trim(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };
    setThreads((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), msg],
    }));
    setDraft('');
  };

  if (view === 'reports') {
    return (
      <div className="cw-sim flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[var(--bn-card-border)] bg-white text-zinc-900 shadow-[var(--bn-card-shadow)]">
        <Header />
        <SimTabNav
          tabs={CW_NAV}
          active={view}
          onChange={setView}
          className="border-zinc-200 bg-zinc-50 [&_button]:text-zinc-600 [&_button[class*='bg-white']]:text-[#1F93FF]"
        />
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {REPORT_STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-zinc-200 p-4">
                <p className="text-xs text-zinc-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-emerald-600">{stat.change}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-zinc-200">
            <p className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold">Temsilci performansı</p>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-zinc-500">
                <tr>
                  <th className="px-4 py-2">Temsilci</th>
                  <th className="px-4 py-2">Çözülen</th>
                  <th className="px-4 py-2">Ort. yanıt</th>
                </tr>
              </thead>
              <tbody>
                {AGENT_PERFORMANCE.map((row) => (
                  <tr key={row.name} className="border-t border-zinc-100">
                    <td className="px-4 py-2.5 font-medium">{row.name}</td>
                    <td className="px-4 py-2.5">{row.resolved}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{row.avgReply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'macros') {
    return (
      <div className="cw-sim flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[var(--bn-card-border)] bg-white text-zinc-900 shadow-[var(--bn-card-shadow)]">
        <Header />
        <SimTabNav
          tabs={CW_NAV}
          active={view}
          onChange={setView}
          className="border-zinc-200 bg-zinc-50 [&_button]:text-zinc-600 [&_button[class*='bg-white']]:text-[#1F93FF]"
        />
        <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4 sm:p-6">
          {MACROS.map((macro) => (
            <div key={macro.id} className="rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{macro.title}</p>
                <code className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{macro.shortcut}</code>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{macro.body}</p>
              <button
                type="button"
                onClick={() => {
                  setView('inbox');
                  setDraft(macro.body);
                }}
                className="mt-3 text-xs font-semibold text-[#1F93FF] hover:underline"
              >
                Gelen kutusunda kullan →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cw-sim flex h-full min-h-0 w-full overflow-hidden rounded-2xl border border-[var(--bn-card-border)] bg-white text-zinc-900 shadow-[var(--bn-card-shadow)]">
      <aside className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-zinc-200 bg-[var(--cw-sidebar)] py-4 sm:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F93FF] text-white">
          <MessageSquare className="h-4 w-4" />
        </span>
        <NavIcon icon={Inbox} active />
        <NavIcon icon={Bot} />
        <NavIcon icon={Tag} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <SimTabNav
          tabs={CW_NAV}
          active={view}
          onChange={setView}
          className="border-zinc-200 bg-zinc-50 [&_button]:text-zinc-600 [&_button[class*='bg-white']]:text-[#1F93FF]"
        />

        <div className="flex min-h-0 flex-1">
          <div className="flex w-full min-w-0 flex-col border-r border-zinc-200 md:w-72 lg:w-80">
            <div className="border-b border-zinc-200 p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  placeholder="Konuşma ara…"
                  className="w-full rounded-lg border border-zinc-200 py-2 pl-8 pr-3 text-xs outline-none focus:border-[#1F93FF]"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {INBOX_FILTERS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      filter === item
                        ? 'bg-[#1F93FF] text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conversation={conv}
                  active={conv.id === active?.id}
                  onSelect={() => setActiveId(conv.id)}
                />
              ))}
            </ul>
          </div>

          <div className="hidden min-w-0 flex-1 flex-col md:flex">
            {active ? (
              <>
                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                  <div>
                    <p className="font-semibold">{active.customer}</p>
                    <p className="text-xs text-zinc-500">
                      {active.company ?? CHANNEL_META[active.channel].label} · {active.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {active.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700"
                      >
                        {label}
                      </span>
                    ))}
                    <button
                      type="button"
                      className="rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600"
                    >
                      Çözüldü
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[var(--cw-panel)] p-4">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                </div>

                {suggestions.length > 0 ? (
                  <div className="border-t border-zinc-200 bg-violet-50/50 px-4 py-2">
                    <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                      <Sparkles className="h-3 w-3" />
                      AI yanıt önerisi
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setDraft(suggestion)}
                          className="max-w-full rounded-lg border border-violet-200 bg-white px-2.5 py-1.5 text-left text-xs text-zinc-700 hover:border-violet-300"
                        >
                          {suggestion.length > 90 ? `${suggestion.slice(0, 90)}…` : suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="border-t border-zinc-200 p-3">
                  <div className="flex items-end gap-2 rounded-xl border border-zinc-200 bg-white p-2">
                    <button type="button" className="p-1 text-zinc-400" aria-label="Emoji">
                      <Smile className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-1 text-zinc-400" aria-label="Dosya">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={2}
                      placeholder="Yanıtınızı yazın… (/kargo, /api)"
                      className="min-h-[2.5rem] flex-1 resize-none text-sm outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(draft);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => sendMessage(draft)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F93FF] text-white hover:opacity-90"
                      aria-label="Gönder"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
                Bir konuşma seçin
              </div>
            )}
          </div>

          {active ? (
            <aside className="hidden w-56 shrink-0 border-l border-zinc-200 bg-zinc-50 p-4 lg:block">
              <div className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-600">
                  <User className="h-5 w-5" />
                </span>
                <p className="mt-2 font-semibold">{active.customer}</p>
                {active.company ? <p className="text-xs text-zinc-500">{active.company}</p> : null}
              </div>
              <dl className="mt-4 space-y-2 text-xs">
                <div>
                  <dt className="text-zinc-500">Kanal</dt>
                  <dd className="font-medium">{CHANNEL_META[active.channel].label}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Atanan</dt>
                  <dd className="font-medium">{active.assignee ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Durum</dt>
                  <dd className="font-medium capitalize">{active.status}</dd>
                </div>
              </dl>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#1F93FF]">Chatwoot</span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          Blacknook Destek
        </span>
      </div>
      <p className="text-xs text-zinc-500">3 temsilci çevrimiçi</p>
    </div>
  );
}

function NavIcon({
  icon: Icon,
  active,
}: {
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
}) {
  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
        active ? 'bg-white/15 text-white' : 'text-zinc-400'
      }`}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

function ConversationRow({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
}) {
  const channel = CHANNEL_META[conversation.channel];
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        data-active={active}
        className="cw-conv-item flex w-full gap-2 border-b border-zinc-100 px-3 py-3 text-left"
      >
        <span className="cw-channel-dot mt-1.5" style={{ backgroundColor: channel.color }} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className={`truncate text-sm ${conversation.unread ? 'font-bold' : 'font-medium'}`}>
              {conversation.customer}
            </span>
            <span className="shrink-0 text-[10px] text-zinc-400">{conversation.time}</span>
          </span>
          <span className="mt-0.5 block truncate text-xs text-zinc-500">{conversation.preview}</span>
        </span>
        {conversation.unread ? (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1F93FF]" aria-hidden />
        ) : null}
      </button>
    </li>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.sender === 'system') {
    return <p className="cw-bubble-system py-1">{message.text}</p>;
  }

  const isAgent = message.sender === 'agent';
  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isAgent ? 'cw-bubble-agent rounded-br-md' : 'cw-bubble-customer rounded-bl-md'
        }`}
      >
        {!isAgent ? <p className="mb-0.5 text-[10px] font-semibold text-zinc-500">{message.name}</p> : null}
        <p>{message.text}</p>
        <p className={`mt-1 text-[10px] ${isAgent ? 'text-blue-100' : 'text-zinc-400'}`}>{message.time}</p>
      </div>
    </div>
  );
}
