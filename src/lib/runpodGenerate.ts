/**
 * RunPod Serverless LLM adapter.
 *
 * Styles (RUNPOD_API_STYLE):
 *   openai — vLLM OpenAI-compatible: /openai/v1/chat/completions  (önerilen)
 *   ollama — eski Worker Ollama: /runsync + { input.prompt }
 *
 * Ortam:
 *   RUNPOD_ENDPOINT_ID
 *   RUNPOD_API_KEY — yoksa OPENAI_API_KEY (rpa_*)
 *   RUNPOD_MODEL
 *   RUNPOD_TIMEOUT_MS — varsayılan 900000 (27B uzun üretim)
 */

export type RunpodGenerateResult = {
  text: string;
  model?: string;
  jobId?: string;
  executionTimeMs?: number;
  delayTimeMs?: number;
  rawStatus?: string;
};

export type RunpodGenerateOptions = {
  prompt: string;
  system?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
};

type RunpodCompletionChunk = {
  choices?: { text?: string; message?: { content?: string }; finish_reason?: string }[];
  model?: string;
  object?: string;
};

type RunpodSyncResponse = {
  id?: string;
  status?: string;
  delayTime?: number;
  executionTime?: number;
  output?: unknown;
  error?: string;
};

function runpodApiKey(): string {
  return (
    process.env.RUNPOD_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    ''
  );
}

function runpodEndpointId(): string {
  return process.env.RUNPOD_ENDPOINT_ID?.trim() || '';
}

function runpodTimeoutMs(): number {
  const raw = Number(process.env.RUNPOD_TIMEOUT_MS || 900_000);
  return Number.isFinite(raw) && raw > 0 ? raw : 900_000;
}

function runpodApiStyle(): 'openai' | 'ollama' {
  const raw = (process.env.RUNPOD_API_STYLE || 'openai').trim().toLowerCase();
  return raw === 'ollama' || raw === 'runsync' ? 'ollama' : 'openai';
}

export function isRunpodConfigured(): boolean {
  return Boolean(runpodApiKey() && runpodEndpointId());
}

function buildPrompt(prompt: string, system?: string): string {
  const user = prompt.trim();
  if (!system?.trim()) return user;
  return `${system.trim()}\n\n---\n\n${user}`;
}

function buildMessages(
  prompt: string,
  system?: string
): { role: 'system' | 'user'; content: string }[] {
  const messages: { role: 'system' | 'user'; content: string }[] = [];
  if (system?.trim()) {
    messages.push({ role: 'system', content: system.trim() });
  }
  messages.push({ role: 'user', content: prompt.trim() });
  return messages;
}

function contentPartsToText(
  content: string | { type?: string; text?: string }[] | null | undefined
): string {
  if (typeof content === 'string') return content.trim();
  if (!Array.isArray(content)) return '';
  return content
    .map((p) => (typeof p === 'object' && p && 'text' in p ? String(p.text || '') : ''))
    .join('')
    .trim();
}

/**
 * OpenAI / RunPod chat completion → düz metin.
 * Qwen3 + vLLM reasoning-parser: asıl cevap bazen content=null,
 * reasoning / reasoning_content içinde gelir.
 */
function extractOpenAiText(data: unknown): { text: string; model?: string; id?: string } {
  if (!data || typeof data !== 'object') return { text: '' };
  const obj = data as {
    id?: string;
    model?: string;
    choices?: {
      text?: string;
      message?: {
        content?: string | { type?: string; text?: string }[] | null;
        reasoning?: string | null;
        reasoning_content?: string | null;
      };
      delta?: {
        content?: string | null;
        reasoning?: string | null;
        reasoning_content?: string | null;
      };
    }[];
    error?: { message?: string } | string;
  };

  if (obj.error) {
    const msg =
      typeof obj.error === 'string'
        ? obj.error
        : obj.error.message || 'OpenAI endpoint hatası';
    throw new Error(msg);
  }

  const choice = obj.choices?.[0];
  const message = choice?.message;
  const delta = choice?.delta;

  const fromContent =
    contentPartsToText(message?.content) ||
    (typeof delta?.content === 'string' ? delta.content.trim() : '') ||
    (typeof choice?.text === 'string' ? choice.text.trim() : '');

  const fromReasoning =
    (typeof message?.reasoning_content === 'string'
      ? message.reasoning_content.trim()
      : '') ||
    (typeof message?.reasoning === 'string' ? message.reasoning.trim() : '') ||
    (typeof delta?.reasoning_content === 'string'
      ? delta.reasoning_content.trim()
      : '') ||
    (typeof delta?.reasoning === 'string' ? delta.reasoning.trim() : '');

  // Tercih: asıl content; boşsa reasoning (vLLM Qwen3 bug / thinking lane)
  const text = fromContent || fromReasoning;

  return { text, model: obj.model, id: obj.id };
}

/** RunPod /runsync `output` alanından düz metin çıkarır. */
export function extractRunpodText(output: unknown): { text: string; model?: string } {
  if (output == null) return { text: '' };

  if (typeof output === 'string') {
    const trimmed = output.trim();
    if (!trimmed) return { text: '' };
    try {
      return extractRunpodText(JSON.parse(trimmed));
    } catch {
      return { text: trimmed };
    }
  }

  if (Array.isArray(output)) {
    const parts: string[] = [];
    let model: string | undefined;
    for (const item of output) {
      const got = extractRunpodText(item);
      if (got.text) parts.push(got.text);
      if (got.model) model = got.model;
    }
    return { text: parts.join('\n').trim(), model };
  }

  if (typeof output === 'object') {
    const obj = output as RunpodCompletionChunk & {
      text?: string;
      response?: string;
      output?: unknown;
      content?: string;
    };

    const choice = obj.choices?.[0];
    const fromChoice =
      choice?.text?.trim() ||
      choice?.message?.content?.trim() ||
      '';
    if (fromChoice) {
      return { text: fromChoice, model: obj.model };
    }

    if (typeof obj.text === 'string' && obj.text.trim()) {
      return { text: obj.text.trim(), model: obj.model };
    }
    if (typeof obj.response === 'string' && obj.response.trim()) {
      return { text: obj.response.trim(), model: obj.model };
    }
    if (typeof obj.content === 'string' && obj.content.trim()) {
      return { text: obj.content.trim(), model: obj.model };
    }
    if ('output' in obj) {
      return extractRunpodText(obj.output);
    }
  }

  return { text: '' };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Node undici: cold start / proxy idle → TypeError: fetch failed */
function isTransientNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === 'AbortError') return false;
  const blob = `${error.message} ${error.name} ${(error as { cause?: Error }).cause?.message || ''}`.toLowerCase();
  return /fetch failed|network|econnreset|econnrefused|etimedout|socket|und_err|other side closed|connection/.test(
    blob
  );
}

function formatTransientNetworkError(error: unknown): string {
  const cause = error instanceof Error ? (error as { cause?: Error }).cause : undefined;
  const detail =
    (cause instanceof Error && cause.message) ||
    (error instanceof Error && error.message) ||
    'bağlantı koptu';
  return `RunPod bağlantısı koptu (${detail}). Worker cold start 5–8 dk sürebilir; endpoint’te Workers → Min workers = 1 yapıp Ready + running worker görünce tekrar dene.`;
}

async function generateOpenAi(
  options: RunpodGenerateOptions,
  apiKey: string,
  endpointId: string,
  model: string | undefined,
  timeoutMs: number
): Promise<RunpodGenerateResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  options.signal?.addEventListener('abort', onAbort);

  // Served name case-sensitive: qwen/qwen3.6-27b (Qwen/Qwen3.6-27B → 404)
  const preferredModel = model?.trim().toLowerCase() || undefined;

  const post = async (bodyModel: string | undefined) => {
    const body: Record<string, unknown> = {
      messages: buildMessages(options.prompt, options.system),
      stream: false,
      // Qwen3 thinking: Studio JSON için kapalı — yoksa content boş / token boşa gider
      chat_template_kwargs: { enable_thinking: false },
    };
    if (bodyModel) body.model = bodyModel;
    if (options.maxTokens != null) body.max_tokens = options.maxTokens;
    if (options.temperature != null) body.temperature = options.temperature;

    const res = await fetch(
      `https://api.runpod.ai/v2/${endpointId}/openai/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: 'no-store',
      }
    );
    const rawText = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(
        `RunPod OpenAI geçersiz JSON (${res.status}): ${rawText.slice(0, 300)}`
      );
    }
    return { res, data, rawText };
  };

  const attemptOnce = async (): Promise<RunpodGenerateResult> => {
    let usedModel = preferredModel;
    let { res, data, rawText } = await post(usedModel);

    const isModelMissing = (payload: unknown, ok: boolean, status: number) =>
      !ok &&
      (status === 404 || status === 400) &&
      /does not exist|model_not_found|NotFoundError/i.test(JSON.stringify(payload));

    if (isModelMissing(data, res.ok, res.status) && usedModel) {
      // Son çare: model alanı olmadan (worker default served_model_name)
      ({ res, data, rawText } = await post(undefined));
      usedModel = undefined;
    }

    if (!res.ok) {
      const errObj = data as { error?: string | { message?: string }; detail?: string };
      const errMsg =
        typeof errObj.error === 'string'
          ? errObj.error
          : errObj.error?.message ||
            errObj.detail ||
            rawText.slice(0, 300) ||
            res.statusText;

      if (/does not exist|model_not_found|NotFoundError/i.test(errMsg + rawText)) {
        throw new Error(
          `RunPod model adı uyuşmuyor. Worker’daki ad: qwen/qwen3.6-27b. .env RUNPOD_MODEL bunu yaz (büyük harf yok).`
        );
      }
      if (res.status === 404 || res.status === 502 || res.status === 503) {
        throw new Error(
          `RunPod worker henüz hazır değil (HTTP ${res.status}). Birkaç dakika sonra tekrar dene.`
        );
      }
      if (res.status === 401 || res.status === 403) {
        throw new Error(
          'RunPod API anahtarı reddedildi (401/403). .env içinde RUNPOD_API_KEY (rpa_…) koyup app’i yeniden oluştur.'
        );
      }
      throw new Error(`RunPod OpenAI HTTP ${res.status}: ${errMsg}`);
    }

    const extracted = extractOpenAiText(data);
    if (!extracted.text) {
      const peek = JSON.stringify(data).slice(0, 400);
      throw new Error(
        `RunPod OpenAI boş yanıt döndü. (Qwen3 thinking content=null olabilir.) Ham: ${peek}`
      );
    }

    return {
      text: extracted.text,
      model: extracted.model || usedModel || preferredModel,
      jobId: extracted.id,
      rawStatus: 'COMPLETED',
    };
  };

  try {
    const maxAttempts = 4;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await attemptOnce();
      } catch (error) {
        lastError = error;
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error(
            `RunPod zaman aşımı (${timeoutMs}ms). Cold start + üretim 27B için uzun sürer; min workers=1 önerilir.`
          );
        }
        if (!isTransientNetworkError(error) || attempt === maxAttempts) {
          if (isTransientNetworkError(error)) {
            throw new Error(formatTransientNetworkError(error));
          }
          throw error;
        }
        // Cold start sırasında gateway bağlantıyı keser → bekle ve yeniden dene
        await sleep(Math.min(15_000 * attempt, 45_000));
      }
    }
    throw lastError instanceof Error
      ? lastError
      : new Error(formatTransientNetworkError(lastError));
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', onAbort);
  }
}

async function generateOllama(
  options: RunpodGenerateOptions,
  apiKey: string,
  endpointId: string,
  model: string | undefined,
  timeoutMs: number
): Promise<RunpodGenerateResult> {
  const input: Record<string, unknown> = {
    prompt: buildPrompt(options.prompt, options.system),
  };
  if (model) input.model = model;
  if (options.maxTokens != null) input.max_tokens = options.maxTokens;
  if (options.temperature != null) input.temperature = options.temperature;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  options.signal?.addEventListener('abort', onAbort);

  try {
    const res = await fetch(`https://api.runpod.ai/v2/${endpointId}/runsync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ input }),
      signal: controller.signal,
      cache: 'no-store',
    });

    const rawText = await res.text();
    let data: RunpodSyncResponse;
    try {
      data = JSON.parse(rawText) as RunpodSyncResponse;
    } catch {
      throw new Error(`RunPod geçersiz JSON (${res.status}): ${rawText.slice(0, 300)}`);
    }

    if (!res.ok) {
      throw new Error(
        `RunPod HTTP ${res.status}: ${data.error || rawText.slice(0, 300) || res.statusText}`
      );
    }

    const status = (data.status || '').toUpperCase();
    if (status && status !== 'COMPLETED') {
      throw new Error(
        `RunPod job ${status}${data.error ? `: ${data.error}` : ''}`.trim()
      );
    }

    const extracted = extractRunpodText(data.output);
    if (!extracted.text) {
      throw new Error('RunPod boş yanıt döndü.');
    }

    return {
      text: extracted.text,
      model: extracted.model || model,
      jobId: data.id,
      executionTimeMs: data.executionTime,
      delayTimeMs: data.delayTime,
      rawStatus: data.status,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`RunPod zaman aşımı (${timeoutMs}ms).`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', onAbort);
  }
}

/**
 * Senkron üretim. Cold start’ta uzun sürebilir.
 * Hata durumunda throw eder (API route’lar yakalar).
 */
export async function runpodGenerate(
  options: RunpodGenerateOptions
): Promise<RunpodGenerateResult> {
  const apiKey = runpodApiKey();
  const endpointId = runpodEndpointId();
  if (!apiKey || !endpointId) {
    throw new Error(
      'RunPod yapılandırılmadı. RUNPOD_ENDPOINT_ID ve RUNPOD_API_KEY (veya OPENAI_API_KEY) gerekli.'
    );
  }

  const model =
    (options.model?.trim() || process.env.RUNPOD_MODEL?.trim() || '').toLowerCase() ||
    undefined;

  const timeoutMs = runpodTimeoutMs();
  const style = runpodApiStyle();

  if (style === 'openai') {
    return generateOpenAi(options, apiKey, endpointId, model, timeoutMs);
  }
  return generateOllama(options, apiKey, endpointId, model, timeoutMs);
}
