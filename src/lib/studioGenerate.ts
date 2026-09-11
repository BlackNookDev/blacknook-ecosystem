/**
 * Studio üretim — RunPod çıktısını proje dosya şemasına çevirir.
 */

import { runpodGenerate, isRunpodConfigured } from '@/lib/runpodGenerate';
import {
  ensurePreviewableGeneration,
  isUsableHtmlContent,
} from '@/lib/studioPreview';

export type StudioFile = {
  path: string;
  content: string;
};

export type StudioGeneration = {
  title: string;
  summary: string;
  files: StudioFile[];
  model?: string;
  rawText?: string;
  jobId?: string;
};

const MAX_FILE_BYTES = 120_000;
const GEN_MAX_TOKENS = 8192;
const ITERATE_MAX_TOKENS = 6144;

export const STUDIO_SYSTEM_PROMPT = `Sen Blacknook kurumsal ajan yapılandırma asistanısın.
Görevin: şirketin bir departmanı için otonom ajan kurulum önizlemesi üretmek (serbest uygulama değil).

ÇIKTI KURALLARI (zorunlu):
1) Yanıtının İLK karakteri { olmalı.
2) Yanıtının SON karakteri } olmalı.
3) Markdown yok. Kod çiti (\`\`\`) yok. Açıklama cümlesi yok.
4) SADECE aşağıdaki JSON şeması:

{"title":"kısa ad","summary":"1 cümle Türkçe","files":[{"path":"index.html","content":"..."},{"path":"styles.css","content":"..."},{"path":"app.js","content":"..."},{"path":"README.md","content":"..."}]}

İçerik kuralları:
- 2-6 dosya (index.html + styles.css + app.js zorunlu).
- path göreli (index.html gibi); .. yok.
- content string; kaçışları JSON kurallarına uygun yap.
- content içinde ASLA dış JSON zarfı (title/files) olmasın — yalnızca o dosyanın ham kodu.
- Tek başına açılabilir HTML/CSS/JS ajan önizlemesi.
- UI metinleri Türkçe.
- Mutlaka çalışan bir arayüz üret: departman paneli, KPI, örnek iş kuyruğu, MCP bağlantı durumu.
- Simülasyon ise (WhatsApp, OCR, CRM, destek vb.) üç panelli önizleme ekranı kur.
- Genel amaçlı SaaS/landing üretme; odak ajan operasyon önizlemesi.`;

const STUDIO_REPAIR_PROMPT = `Aşağıdaki metni SADECE geçerli JSON'a çevir.
İlk karakter {, son karakter } olmalı. Markdown yok.
Şema: {"title":"","summary":"","files":[{"path":"index.html","content":""},{"path":"styles.css","content":""},{"path":"app.js","content":""}]}
Her file.content yalnız o dosyanın kodu olsun; iç içe JSON zarfı yok.

METİN:
`;

const STUDIO_ITERATE_PROMPT = `Sen Blacknook Studio ajanısın.
Kullanıcı mevcut bir projeyi konuşarak geliştiriyor.

ÇIKTI: SADECE JSON. İlk karakter {, son }. Markdown yok.
Şema: {"title":"kısa ad","summary":"1 cümle","files":[{"path":"styles.css","content":"..."}]}

Kurallar:
- files dizisine SADECE değişen veya yeni dosyaları koy (tam içerik).
- Değişmeyen dosyaları tekrar yazma.
- En fazla 4 dosya.
- content içinde dış JSON zarfı (title/files) olmasın.
- HTML dosyası güncelliyorsan geçerli HTML üret (<!DOCTYPE html> veya <html> ile).
- UI Türkçe.`;

function sanitizePath(raw: string): string | null {
  const path = raw.trim().replace(/^\/+/, '').replace(/\\/g, '/');
  if (!path || path.length > 180) return null;
  if (!/^[a-zA-Z0-9._@+-]+(?:\/[a-zA-Z0-9._@+-]+)*$/.test(path)) return null;
  return path;
}

/** Model bazen gerçek satır sonu yerine literal \\n basar. */
export function repairEscapedContent(content: string): string {
  const realNewlines = (content.match(/\n/g) || []).length;
  const escapedNewlines = (content.match(/\\n/g) || []).length;
  if (escapedNewlines >= 3 && realNewlines <= 2) {
    return content
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\"/g, '"');
  }
  return content;
}

/** Dosya içeriği Studio JSON zarfı gibi mi? (çift sarmalama) */
export function looksLikeStudioEnvelope(content: string): boolean {
  const t = content.trim();
  if (!t.startsWith('{')) return false;
  return /"files"\s*:\s*\[/.test(t) || (/"title"\s*:/.test(t) && /"content"\s*:/.test(t));
}

function filesFromParsedData(data: {
  title?: unknown;
  summary?: unknown;
  files?: unknown;
}): StudioGeneration | null {
  if (!Array.isArray(data.files) || data.files.length === 0) return null;

  const files: StudioFile[] = [];
  for (const item of data.files.slice(0, 8)) {
    if (!item || typeof item !== 'object') continue;
    const path = sanitizePath(String((item as { path?: unknown }).path ?? ''));
    const content = (item as { content?: unknown }).content;
    if (!path || typeof content !== 'string') continue;
    files.push({
      path,
      content: repairEscapedContent(content).slice(0, MAX_FILE_BYTES),
    });
  }
  if (files.length === 0) return null;

  return {
    title:
      typeof data.title === 'string' && data.title.trim()
        ? data.title.trim().slice(0, 120)
        : files[0].path,
    summary:
      typeof data.summary === 'string' && data.summary.trim()
        ? data.summary.trim().slice(0, 500)
        : 'Üretilen iskelet hazır.',
    files,
  };
}

/**
 * index.html content'ine tüm JSON gömülmüşse yeniden parse et.
 * Derinlik sınırlı — sonsuz döngü yok.
 */
export function unwrapNestedEnvelopes(
  generation: StudioGeneration,
  depth = 0
): StudioGeneration {
  if (depth > 3) return generation;

  for (const file of generation.files) {
    const repaired = repairEscapedContent(file.content);
    if (!looksLikeStudioEnvelope(repaired)) continue;

    const nested = parseStudioGenerationOnce(repaired);
    if (nested?.files?.length) {
      return unwrapNestedEnvelopes(
        {
          title: nested.title || generation.title,
          summary: nested.summary || generation.summary,
          files: nested.files,
          rawText: generation.rawText,
          model: generation.model,
          jobId: generation.jobId,
        },
        depth + 1
      );
    }
  }

  return {
    ...generation,
    files: generation.files.map((f) => ({
      ...f,
      content: repairEscapedContent(f.content).slice(0, MAX_FILE_BYTES),
    })),
  };
}

/** Tek adım JSON parse (çit / brace); nested unwrap yok. */
function parseStudioGenerationOnce(raw: string): StudioGeneration | null {
  const text = raw.trim();
  if (!text) return null;

  const candidates: string[] = [text];
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) candidates.unshift(fence[1].trim());
  const brace = text.match(/\{[\s\S]*\}/);
  if (brace?.[0]) candidates.push(brace[0]);

  for (const candidate of candidates) {
    try {
      const data = JSON.parse(candidate) as {
        title?: unknown;
        summary?: unknown;
        files?: unknown;
      };
      const parsed = filesFromParsedData(data);
      if (parsed) return { ...parsed, rawText: text };
    } catch {
      /* try next */
    }
  }
  return null;
}

/** Model metninden JSON proje çıkarır (çit / ön-son metin + nested unwrap). */
export function parseStudioGeneration(raw: string): StudioGeneration | null {
  const once = parseStudioGenerationOnce(raw);
  if (once) return unwrapNestedEnvelopes(once);
  return parseStudioGenerationFromFences(raw);
}

const FENCE_LANG_TO_PATH: Record<string, string> = {
  html: 'index.html',
  htm: 'index.html',
  css: 'styles.css',
  js: 'app.js',
  javascript: 'app.js',
  ts: 'app.ts',
  typescript: 'app.ts',
  md: 'README.md',
  markdown: 'README.md',
  json: 'data.json',
};

/** JSON yoksa ```dil kod çitlerinden dosya derler. */
export function parseStudioGenerationFromFences(raw: string): StudioGeneration | null {
  const re = /```([a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/g;
  const files: StudioFile[] = [];
  const used = new Set<string>();
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(raw)) && files.length < 8) {
    const lang = (match[1] || '').toLowerCase();
    const content = repairEscapedContent((match[2] || '').trim());
    if (!content) continue;
    let path = FENCE_LANG_TO_PATH[lang];
    if (!path) {
      if (content.includes('<html') || content.includes('<!DOCTYPE')) path = 'index.html';
      else continue;
    }
    if (used.has(path)) {
      const stem = path.replace(/(\.[^.]+)$/, '');
      const ext = path.slice(stem.length);
      path = `${stem}-${++i}${ext}`;
    }
    used.add(path);
    files.push({ path, content: content.slice(0, MAX_FILE_BYTES) });
  }
  if (files.length === 0) {
    const htmlOnly = repairEscapedContent(raw.trim());
    if (isUsableHtmlContent(htmlOnly)) {
      return {
        title: 'Üretilen sayfa',
        summary: 'Tek HTML çıktısı dosyaya alındı.',
        files: [{ path: 'index.html', content: htmlOnly.slice(0, MAX_FILE_BYTES) }],
        rawText: raw,
      };
    }
    return null;
  }
  return unwrapNestedEnvelopes({
    title: 'Üretilen iskelet',
    summary: 'Model JSON yerine kod blokları döndürdü; dosyalara ayrıldı.',
    files,
    rawText: raw,
  });
}

function isHtmlPath(path: string): boolean {
  return /\.html?$/i.test(path);
}

/**
 * Iterate: model yalnızca değişen dosyaları döndürür → öncekiyle birleştir.
 * Bozuk HTML / JSON-zarf güncellemeleri atılır (önceki sürüm korunur).
 */
export function mergeStudioGenerations(
  previous: StudioGeneration,
  patch: StudioGeneration
): StudioGeneration {
  const byPath = new Map<string, StudioFile>();
  for (const f of previous.files) {
    byPath.set(f.path, { path: f.path, content: f.content });
  }

  let applied = 0;
  let skipped = 0;

  for (const incoming of patch.files.slice(0, 8)) {
    let content = repairEscapedContent(incoming.content).slice(0, MAX_FILE_BYTES);

    if (looksLikeStudioEnvelope(content)) {
      const nested = parseStudioGeneration(content);
      if (nested?.files?.length) {
        for (const nf of nested.files) {
          const nc = repairEscapedContent(nf.content).slice(0, MAX_FILE_BYTES);
          if (isHtmlPath(nf.path) && !isUsableHtmlContent(nc)) {
            skipped += 1;
            continue;
          }
          byPath.set(nf.path, { path: nf.path, content: nc });
          applied += 1;
        }
        continue;
      }
      skipped += 1;
      continue;
    }

    if (isHtmlPath(incoming.path) && !isUsableHtmlContent(content)) {
      skipped += 1;
      continue;
    }

    byPath.set(incoming.path, { path: incoming.path, content });
    applied += 1;
  }

  const files = [...byPath.values()];
  const note =
    skipped > 0
      ? ` (${skipped} bozuk dosya atlandı, önceki korundu)`
      : applied > 0
        ? ` (${applied} dosya güncellendi)`
        : '';

  return {
    title: patch.title?.trim() || previous.title,
    summary: `${(patch.summary || previous.summary).slice(0, 420)}${note}`.slice(0, 500),
    files,
    model: patch.model || previous.model,
    jobId: patch.jobId || previous.jobId,
    rawText: patch.rawText,
  };
}

function buildIterateUserPrompt(message: string, previous: StudioGeneration): string {
  const fileBrief = previous.files
    .slice(0, 8)
    .map((f) => {
      const body =
        f.content.length > 2800 ? `${f.content.slice(0, 2800)}\n/* …truncated */` : f.content;
      return `### ${f.path}\n${body}`;
    })
    .join('\n\n');
  return `Mevcut proje: ${previous.title}
Özet: ${previous.summary}

Dosyalar (referans — hepsini tekrar yazma):
${fileBrief}

Kullanıcı isteği:
${message.trim()}

Yalnızca değişmesi gereken dosyaları JSON files dizisinde döndür.`;
}

export async function generateStudioProject(
  prompt: string,
  opts?: { previous?: StudioGeneration | null }
): Promise<StudioGeneration> {
  if (!isRunpodConfigured()) {
    throw new Error(
      'RunPod yapılandırılmadı. RUNPOD_ENDPOINT_ID ve API anahtarı gerekli.'
    );
  }

  const cleaned = prompt.trim().slice(0, 4000);
  if (!cleaned) throw new Error('Prompt gerekli.');

  const previous = opts?.previous;
  const iterating = Boolean(previous?.files?.length);
  const system = iterating ? STUDIO_ITERATE_PROMPT : STUDIO_SYSTEM_PROMPT;
  const userPrompt = iterating
    ? buildIterateUserPrompt(cleaned, previous as StudioGeneration)
    : cleaned;

  const result = await runpodGenerate({
    prompt: userPrompt,
    system,
    maxTokens: iterating ? ITERATE_MAX_TOKENS : GEN_MAX_TOKENS,
    temperature: iterating ? 0.2 : 0.2,
  });

  let parsed = parseStudioGeneration(result.text);
  let model = result.model;
  let jobId = result.jobId;
  let rawText = result.text;

  if (!parsed) {
    const repaired = await runpodGenerate({
      prompt: `${STUDIO_REPAIR_PROMPT}${result.text.slice(0, 8000)}`,
      maxTokens: GEN_MAX_TOKENS,
      temperature: 0,
    });
    parsed = parseStudioGeneration(repaired.text);
    model = repaired.model || model;
    jobId = repaired.jobId || jobId;
    rawText = repaired.text;
  }

  if (parsed) {
    const withMeta = { ...parsed, model, jobId, rawText };
    const merged =
      iterating && previous
        ? mergeStudioGenerations(previous, withMeta)
        : withMeta;
    return ensurePreviewableGeneration(merged, cleaned);
  }

  if (previous?.files?.length) {
    return {
      ...previous,
      summary: `${previous.summary} (Son istek uygulanamadı; önceki sürüm korundu.)`,
      model,
      jobId,
      rawText: result.text,
    };
  }

  return ensurePreviewableGeneration(
    {
      title: 'Taslak çıktı',
      summary: 'Model yapılandırılmış JSON döndürmedi; ham metin kaydedildi.',
      files: [
        {
          path: 'GENERATION.md',
          content: result.text.slice(0, MAX_FILE_BYTES),
        },
      ],
      model,
      jobId,
      rawText: result.text,
    },
    cleaned
  );
}
