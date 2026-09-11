import type { StudioFile, StudioGeneration } from '@/lib/studioGenerate';

/** Gerçek UI HTML mi — JSON zarfı / ham model çıktısı değil mi? */
export function isUsableHtmlContent(content: string): boolean {
  const t = content.trim();
  if (t.length < 40) return false;
  // Çift sarmalanmış Studio JSON — önizlemeye asla koyma
  if (t.startsWith('{') && /"files"\s*:\s*\[/.test(t)) return false;
  if (t.startsWith('{') && /"title"\s*:/.test(t) && /"path"\s*:/.test(t)) return false;
  return /<(?:!DOCTYPE\s+html|html[\s>]|body[\s>]|main[\s>]|div[\s>]|section[\s>]|header[\s>]|h[1-3][\s>]|button[\s>])/i.test(
    t
  );
}

export function previewBlockedReason(generation: StudioGeneration): string | null {
  const htmlFile =
    generation.files.find((f) => /(^|\/)index\.html$/i.test(f.path)) ||
    generation.files.find((f) => /\.html?$/i.test(f.path));
  if (!htmlFile) return 'Önizleme için HTML dosyası yok — Dosyalar sekmesine bak.';
  if (!isUsableHtmlContent(htmlFile.content)) {
    return 'HTML bozuk veya JSON zarfı gibi görünüyor. Sohbetten yeniden iste veya IDE’de düzelt.';
  }
  return null;
}

/** Üretilen dosyalardan tek HTML önizleme belgesi (css/js gömülü). */
export function buildStudioPreviewHtml(generation: StudioGeneration): string | null {
  const files = generation.files;
  const htmlFile =
    files.find((f) => /(^|\/)index\.html$/i.test(f.path)) ||
    files.find((f) => /\.html?$/i.test(f.path) && isUsableHtmlContent(f.content));

  if (!htmlFile || !isUsableHtmlContent(htmlFile.content)) return null;

  let html = htmlFile.content;
  const css = files
    .filter((f) => /\.css$/i.test(f.path))
    .map((f) => f.content)
    .join('\n');
  const js = files
    .filter((f) => /\.js$/i.test(f.path))
    .map((f) => f.content)
    .join('\n');

  if (css) {
    if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `<style>${css}</style></head>`);
    } else {
      html = `<style>${css}</style>${html}`;
    }
  }
  if (js) {
    if (/<\/body>/i.test(html)) {
      html = html.replace(/<\/body>/i, `<script>${js}</script></body>`);
    } else {
      html = `${html}<script>${js}</script>`;
    }
  }

  if (!/<html/i.test(html)) {
    html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${escapeHtml(generation.title)}</title></head><body>${html}</body></html>`;
  }

  return html;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function hasRenderableUi(generation: StudioGeneration): boolean {
  return Boolean(buildStudioPreviewHtml(generation));
}

/** Model arayüz üretmezse kullanıcıya gösterilecek çalışan simülasyon. */
export function buildFallbackSimulation(prompt: string): StudioFile {
  const p = prompt.toLowerCase();
  const whatsapp = /whatsapp|wp|grup/.test(p);
  const ocr = /ocr|fiş|fis|receipt/.test(p);
  const crm = /crm|müşteri|musteri|satis|satış/.test(p);

  const title =
    whatsapp && ocr && crm
      ? 'WhatsApp · OCR · CRM önizlemesi'
      : 'Blacknook ürün önizlemesi';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: dark; --bg:#0b1220; --panel:#121a2b; --line:#243047; --text:#e8eefc; --muted:#9aa8c7; --accent:#14b8a6; --wa:#128c7e; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; background:var(--bg); color:var(--text); }
    header { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 18px; border-bottom:1px solid var(--line); background:#0e1626; }
    header h1 { margin:0; font-size:15px; font-weight:700; }
    header p { margin:2px 0 0; font-size:12px; color:var(--muted); }
    .badge { font-size:11px; font-weight:700; color:#042f2e; background:var(--accent); padding:6px 10px; border-radius:999px; }
    .grid { display:grid; grid-template-columns: 1fr; gap:12px; padding:12px; min-height: calc(100vh - 64px); }
    @media (min-width: 960px) { .grid { grid-template-columns: 1.1fr 1fr 1fr; } }
    .card { background:var(--panel); border:1px solid var(--line); border-radius:16px; overflow:hidden; display:flex; flex-direction:column; min-height:320px; }
    .card h2 { margin:0; padding:12px 14px; font-size:13px; border-bottom:1px solid var(--line); background:rgba(255,255,255,0.02); }
    .body { padding:12px; display:flex; flex-direction:column; gap:10px; flex:1; }
    .msg { background:#0a1f1c; border:1px solid #1c3d37; border-radius:12px; padding:10px 12px; font-size:13px; line-height:1.45; }
    .msg small { display:block; color:var(--muted); margin-top:6px; font-size:11px; }
    .row { display:flex; gap:8px; flex-wrap:wrap; }
    button, .btn { appearance:none; border:0; border-radius:10px; padding:10px 12px; font-weight:700; font-size:12px; cursor:pointer; }
    .primary { background:var(--accent); color:#042f2e; }
    .ghost { background:rgba(255,255,255,0.06); color:var(--text); }
    .field { display:flex; flex-direction:column; gap:4px; font-size:12px; color:var(--muted); }
    .field input, .field textarea { width:100%; border-radius:10px; border:1px solid var(--line); background:#0b1322; color:var(--text); padding:10px; font:inherit; }
    table { width:100%; border-collapse:collapse; font-size:12px; }
    th, td { text-align:left; padding:8px 6px; border-bottom:1px solid var(--line); }
    th { color:var(--muted); font-weight:600; }
    .ok { color:#5eead4; }
    .hint { font-size:11px; color:var(--muted); line-height:1.4; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>${escapeHtml(title)}</h1>
      <p>Blacknook Studio · canlı önizleme (simülasyon)</p>
    </div>
    <span class="badge">Önizleme</span>
  </header>
  <div class="grid">
    <section class="card">
      <h2>${whatsapp ? 'WhatsApp grubu' : 'Gelen kanal'}</h2>
      <div class="body" id="feed">
        <div class="msg">Ahmet: Fiş fotoğrafı attım, işler misiniz?<small>şimdi · grup</small></div>
        <div class="msg">Zeynep: [görsel] market_fis.jpg<small>1 dk önce</small></div>
        <div class="hint">Bu panel gerçek WhatsApp değildir; simülasyondur.</div>
        <div class="row">
          <button class="primary" id="btnSample">Örnek fiş mesajı ekle</button>
          <button class="ghost" id="btnClear">Temizle</button>
        </div>
      </div>
    </section>
    <section class="card">
      <h2>${ocr ? 'OCR · Fiş okuma' : 'Belge işleme'}</h2>
      <div class="body">
        <div class="field"><span>Ham görüntü / metin</span>
          <textarea id="raw" rows="5">MARKET XYZ
Tarih: 04.09.2026
Toplam: 1.245,90 TL
KDV: %20</textarea>
        </div>
        <button class="primary" id="btnOcr">OCR çalıştır (simüle)</button>
        <div class="field"><span>Çıkarılan alanlar</span>
          <textarea id="parsed" rows="5" readonly placeholder="Henüz işlenmedi"></textarea>
        </div>
      </div>
    </section>
    <section class="card">
      <h2>${crm ? 'CRM kaydı' : 'Kayıt defteri'}</h2>
      <div class="body">
        <table>
          <thead><tr><th>Müşteri</th><th>Tutar</th><th>Durum</th></tr></thead>
          <tbody id="crmBody">
            <tr><td colspan="3" class="hint">OCR sonrası kayıtlar burada görünür.</td></tr>
          </tbody>
        </table>
        <p class="hint">Prompt: ${escapeHtml(prompt.slice(0, 180))}</p>
      </div>
    </section>
  </div>
  <script>
    const feed = document.getElementById('feed');
    const raw = document.getElementById('raw');
    const parsed = document.getElementById('parsed');
    const crmBody = document.getElementById('crmBody');
    let n = 1;
    document.getElementById('btnSample').onclick = () => {
      const el = document.createElement('div');
      el.className = 'msg';
      el.innerHTML = 'Operasyon: Yeni fiş #' + (++n) + ' yüklendi.<small>şimdi · bot</small>';
      feed.insertBefore(el, feed.children[feed.children.length - 3]);
    };
    document.getElementById('btnClear').onclick = () => {
      [...feed.querySelectorAll('.msg')].forEach((m, i) => { if (i > 1) m.remove(); });
    };
    document.getElementById('btnOcr').onclick = () => {
      const text = raw.value;
      const totalMatch = text.match(/([0-9]+[.,][0-9]{2})\\s*TL/i);
      const dateMatch = text.match(/(\\d{2}[./-]\\d{2}[./-]\\d{4})/);
      const total = totalMatch ? totalMatch[1] : '0,00';
      const date = dateMatch ? dateMatch[1] : '—';
      parsed.value = JSON.stringify({ magaza: 'MARKET XYZ', tarih: date, toplam: total + ' TL', kaynak: 'whatsapp-ocr-sim' }, null, 2);
      const row = document.createElement('tr');
      row.innerHTML = '<td>MARKET XYZ</td><td>' + total + ' TL</td><td class="ok">CRM kaydedildi</td>';
      const empty = crmBody.querySelector('[colspan]');
      if (empty) empty.remove();
      crmBody.prepend(row);
    };
  </script>
</body>
</html>`;

  return { path: 'index.html', content: html };
}

/** HTML yoksa veya içerik boşsa fallback ekler. */
export function ensurePreviewableGeneration(
  generation: StudioGeneration,
  prompt: string
): StudioGeneration {
  if (hasRenderableUi(generation)) return generation;
  const fallback = buildFallbackSimulation(prompt);
  const rest = generation.files.filter((f) => !/(^|\/)index\.html$/i.test(f.path));
  return {
    ...generation,
    title:
      generation.title === 'Üretilen iskelet' ||
      generation.title === 'Taslak çıktı' ||
      !generation.title?.trim()
        ? 'Ürün önizlemesi'
        : generation.title,
    summary:
      'Model tam arayüz üretmedi; çalışan bir simülasyon önizlemesi eklendi. IDE’de düzenleyebilirsin.',
    files: [fallback, ...rest],
  };
}
