'use client';

import { useState } from 'react';
import SimTabNav from '@/components/simulations/shared/SimTabNav';
import {
  PL_NAV,
  SOURCES,
  STATS,
  TOP_PAGES,
  type PlausibleView,
} from '@/components/simulations/plausible/data';
import './simulation.css';

export default function PlausibleSimulation() {
  const [view, setView] = useState<PlausibleView>('dashboard');
  const [range, setRange] = useState('30d');

  return (
    <div className="pl-sim flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[var(--bn-card-border)] bg-white text-zinc-900 shadow-[var(--bn-card-shadow)]">
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#5850EC]">Plausible</span>
          <span className="text-sm text-zinc-500">blacknook.com</span>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-lg border border-zinc-300 px-2 py-1 text-xs"
        >
          <option value="7d">Son 7 gün</option>
          <option value="30d">Son 30 gün</option>
          <option value="12m">Son 12 ay</option>
        </select>
      </div>

      <SimTabNav
        tabs={PL_NAV}
        active={view}
        onChange={setView}
        className="border-zinc-200 bg-zinc-50 [&_button]:text-zinc-600 [&_button[class*='bg-white']]:text-[#5850EC]"
      />

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        {view === 'dashboard' && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs text-zinc-500">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold">{s.value}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">{s.change}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-700">Ziyaretçi trendi</p>
              <div className="mt-4 flex h-32 items-end gap-0.5">
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-[#5850EC]/70"
                    style={{ height: `${30 + Math.sin(i / 3) * 25 + (i % 5) * 8}%` }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'pages' && (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-zinc-500">
              <tr>
                <th className="pb-2">Sayfa</th>
                <th className="pb-2">Görüntüleme</th>
                <th className="pb-2">Hemen çıkma</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PAGES.map((p) => (
                <tr key={p.path} className="border-t border-zinc-100">
                  <td className="py-2.5 font-mono text-xs">{p.path}</td>
                  <td className="py-2.5">{p.views.toLocaleString('tr-TR')}</td>
                  <td className="py-2.5 text-zinc-500">{p.bounce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {view === 'sources' && (
          <div className="space-y-3">
            {SOURCES.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-24 text-sm">{s.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-[#5850EC]" style={{ width: s.share }} />
                </div>
                <span className="w-10 text-right text-xs text-zinc-500">{s.share}</span>
              </div>
            ))}
          </div>
        )}

        {view === 'goals' && (
          <div className="space-y-3">
            {[
              { name: 'Simülasyon başlat', conv: '4.2%', count: 521 },
              { name: 'Kayıt ol', conv: '1.8%', count: 224 },
              { name: 'İletişim formu', conv: '0.9%', count: 112 },
            ].map((g) => (
              <div key={g.name} className="rounded-xl border border-zinc-200 p-4">
                <p className="font-medium">{g.name}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {g.count} dönüşüm · {g.conv}
                </p>
              </div>
            ))}
          </div>
        )}

        {view === 'settings' && (
          <div className="space-y-2 text-sm text-zinc-600">
            <p>Çerezsiz analitik · GDPR uyumlu</p>
            <p>Snippet: &lt;script defer data-domain=&quot;blacknook.com&quot; src=&quot;…&quot;&gt;</p>
            <p>Ekip erişimi: 3 kullanıcı</p>
          </div>
        )}
      </div>
    </div>
  );
}
