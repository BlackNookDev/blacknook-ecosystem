'use client';

import { Code2, Copy } from 'lucide-react';
import { useState } from 'react';
import { EMBED_SNIPPET, HOST } from '@/components/simulations/cal-com/data';

export default function EmbedView() {
  const [copied, setCopied] = useState(false);

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(EMBED_SNIPPET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="cal-scroll h-full overflow-auto p-5">
      <h2 className="font-display text-lg font-bold text-[var(--bn-heading)]">Embed & özelleştirme</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Rezervasyon sayfanızı web sitenize birkaç tıkla gömün; markanıza uygun özelleştirin.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-zinc-200">Kısa rezervasyon linki</h3>
          <p className="mt-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-emerald-200">
            cal/{HOST.username}/discovery
          </p>
          <p className="mt-3 text-xs text-zinc-500">
            Özelleştirilebilir slug · 65+ dil desteği · gizlilik odaklı barındırma
          </p>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-zinc-200">Gömme modları</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>· Inline embed (sayfa içi)</li>
            <li>· Popup widget</li>
            <li>· Yeni sekme / yönlendirme</li>
            <li>· Cal Atoms (React bileşenleri)</li>
          </ul>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-zinc-500" aria-hidden />
            <h3 className="text-sm font-semibold text-zinc-200">Embed kodu</h3>
          </div>
          <button
            type="button"
            onClick={() => void copySnippet()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/[0.05]"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden />
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>
        </div>
        <pre className="cal-scroll mt-3 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-zinc-400">
          {EMBED_SNIPPET}
        </pre>
      </section>

      <div className="mt-4 rounded-2xl border border-dashed border-white/15 p-5 text-center">
        <p className="text-sm font-medium text-zinc-300">Önizleme (simülasyon)</p>
        <div className="mx-auto mt-4 max-w-md rounded-xl border border-white/10 bg-zinc-950 p-4 text-left">
          <p className="text-xs text-zinc-500">Gömülü rezervasyon widget</p>
          <p className="mt-2 text-sm font-semibold text-white">Keşif görüşmesi · 30 dk</p>
          <button
            type="button"
            disabled
            className="mt-4 w-full rounded-lg bg-white py-2 text-xs font-semibold text-zinc-950 opacity-80"
          >
            Zaman seç
          </button>
        </div>
      </div>
    </div>
  );
}
