'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import SimTabNav from '@/components/simulations/shared/SimTabNav';
import {
  DASHBOARD_CHARTS,
  KPI_CARDS,
  MB_NAV,
  RECENT_QUESTIONS,
  TABLES,
  type MetabaseView,
} from '@/components/simulations/metabase/data';
import './simulation.css';

function MiniChart({ type }: { type: string }) {
  if (type === 'line') {
    return (
      <svg viewBox="0 0 200 60" className="h-full w-full text-[#509EE3]">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points="0,50 30,42 60,38 90,28 120,32 150,18 180,12 200,8"
        />
      </svg>
    );
  }
  if (type === 'pie') {
    return (
      <div className="flex h-full items-center justify-center gap-2">
        <div className="h-16 w-16 rounded-full border-[10px] border-[#509EE3] border-r-[#7BB8F0] border-b-[#A8D4FF]" />
      </div>
    );
  }
  return (
    <div className="flex h-full items-end justify-around gap-1 px-2 pb-1">
      {[40, 65, 45, 80, 55, 70].map((h, i) => (
        <div key={i} className="w-4 rounded-t bg-[#509EE3]/80" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export default function MetabaseSimulation() {
  const [view, setView] = useState<MetabaseView>('home');
  const [sql, setSql] = useState(
    `SELECT date_trunc('month', created_at) AS month,\n       SUM(total) AS revenue\nFROM orders\nWHERE status = 'paid'\nGROUP BY 1\nORDER BY 1 DESC\nLIMIT 12;`
  );

  return (
    <div className="mb-sim flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[var(--bn-card-border)] bg-white text-zinc-900 shadow-[var(--bn-card-shadow)]">
      <div className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-[#509EE3] px-4 py-2.5">
        <span className="text-lg font-bold text-white">Metabase</span>
        <span className="text-sm text-white/80">Blacknook Analytics</span>
      </div>

      <SimTabNav
        tabs={MB_NAV}
        active={view}
        onChange={setView}
        className="border-zinc-200 bg-zinc-50 [&_button]:text-zinc-600 [&_button:hover]:text-zinc-900 [&_button[class*='bg-white']]:bg-white [&_button[class*='bg-white']]:text-[#509EE3] [&_button[class*='bg-white']]:shadow-sm"
      />

      <div className="min-h-0 flex-1 overflow-auto bg-zinc-50">
        {view === 'home' && (
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-800">Günaydın 👋</h2>
            <p className="mt-1 text-sm text-zinc-500">İş zekası panonuz güncel.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {KPI_CARDS.map((k) => (
                <div key={k.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="text-xs text-zinc-500">{k.label}</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{k.value}</p>
                  <p className={cn('mt-1 text-xs font-medium', k.up ? 'text-emerald-600' : 'text-red-500')}>
                    {k.change}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-zinc-700">Son sorular</h3>
              <ul className="mt-2 space-y-1">
                {RECENT_QUESTIONS.map((q) => (
                  <li
                    key={q}
                    className="cursor-pointer rounded-lg border border-transparent px-3 py-2 text-sm text-zinc-600 hover:border-[#509EE3]/30 hover:bg-white"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {view === 'question' && (
          <div className="flex h-full min-h-[400px] flex-col lg:flex-row">
            <div className="flex-1 border-b border-zinc-200 p-4 lg:border-b-0 lg:border-r">
              <div className="mb-2 flex gap-2">
                <button type="button" className="rounded bg-[#509EE3] px-3 py-1 text-xs font-semibold text-white">
                  Native query
                </button>
                <button type="button" className="rounded border border-zinc-300 px-3 py-1 text-xs text-zinc-600">
                  Simple question
                </button>
              </div>
              <textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-900 p-3 font-mono text-xs text-emerald-400"
              />
              <button
                type="button"
                className="mt-3 rounded-lg bg-[#509EE3] px-4 py-2 text-sm font-semibold text-white"
              >
                Çalıştır
              </button>
            </div>
            <div className="w-full shrink-0 p-4 lg:w-80">
              <p className="text-xs font-semibold uppercase text-zinc-500">Sonuç · 12 satır</p>
              <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200 bg-white text-xs">
                <table className="w-full">
                  <thead className="bg-zinc-100">
                    <tr>
                      <th className="px-2 py-1.5 text-left">month</th>
                      <th className="px-2 py-1.5 text-right">revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['2026-03', '₺2.4M'],
                      ['2026-02', '₺2.1M'],
                      ['2026-01', '₺1.9M'],
                    ].map(([m, r]) => (
                      <tr key={m} className="border-t border-zinc-100">
                        <td className="px-2 py-1.5">{m}</td>
                        <td className="px-2 py-1.5 text-right font-medium">{r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Satış performansı</h2>
              <span className="text-xs text-zinc-500">Son güncelleme: 5 dk önce</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {DASHBOARD_CHARTS.map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-zinc-700">{c.title}</p>
                  <div className="mt-3" style={{ height: c.height }}>
                    <MiniChart type={c.type} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'browse' && (
          <div className="p-4">
            <p className="text-sm text-zinc-600">PostgreSQL · blacknook_prod</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {TABLES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  className="rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm hover:border-[#509EE3]"
                >
                  <p className="font-mono font-semibold text-[#509EE3]">{t.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {t.rows} satır · {t.cols} sütun
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="max-w-md space-y-4 p-4">
            {['Kullanıcılar ve izinler', 'Veritabanı bağlantıları', 'E-posta ayarları', 'Embedding'].map(
              (item) => (
                <div
                  key={item}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-[#509EE3]"
                >
                  <span className="text-sm font-medium">{item}</span>
                  <span className="text-zinc-400">→</span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
