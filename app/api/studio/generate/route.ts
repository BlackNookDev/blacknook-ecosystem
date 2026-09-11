import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/sessionUser';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { isAgentStudioEnabled, isCoderFeatureEnabled } from '@/lib/coderFeature';
import { isCoderConfigured } from '@/lib/coderService';
import { isRunpodConfigured } from '@/lib/runpodGenerate';
import {
  generateStudioProject,
  type StudioFile,
  type StudioGeneration,
} from '@/lib/studioGenerate';
import { createUserWorkspace } from '@/lib/developerWorkspaces';
import { waitForWorkspaceContainer } from '@/lib/waitForWorkspace';
import {
  isDockerSockAvailable,
  writeFilesToWorkspaceContainer,
} from '@/lib/coderWorkspaceFiles';
import { failResponse, logServerError } from '@/lib/errorLog';
import type {
  AgentLogKind,
  StudioProgressEvent,
  StudioStepId,
} from '@/lib/studioProgress';

export const dynamic = 'force-dynamic';
export const maxDuration = 900;

function parsePrevious(raw: unknown): StudioGeneration | null {
  if (!raw || typeof raw !== 'object') return null;
  const g = raw as { title?: unknown; summary?: unknown; files?: unknown; model?: unknown };
  if (!Array.isArray(g.files) || g.files.length === 0) return null;
  const files: StudioFile[] = [];
  for (const item of g.files.slice(0, 8)) {
    if (!item || typeof item !== 'object') continue;
    const path = String((item as { path?: unknown }).path || '').trim();
    const content = (item as { content?: unknown }).content;
    if (!path || typeof content !== 'string') continue;
    files.push({ path: path.slice(0, 180), content: content.slice(0, 120_000) });
  }
  if (!files.length) return null;
  return {
    title: typeof g.title === 'string' ? g.title.slice(0, 120) : 'Proje',
    summary: typeof g.summary === 'string' ? g.summary.slice(0, 500) : '',
    files,
    model: typeof g.model === 'string' ? g.model : undefined,
  };
}

function parseBody(raw: unknown) {
  const body = (raw && typeof raw === 'object' ? raw : {}) as {
    prompt?: unknown;
    applyToWorkspace?: unknown;
    projectName?: unknown;
    stream?: unknown;
    previous?: unknown;
  };
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  const applyToWorkspace =
    body.applyToWorkspace !== false && isCoderFeatureEnabled() && isCoderConfigured();
  const stream = body.stream !== false;
  const projectName =
    typeof body.projectName === 'string' && body.projectName.trim()
      ? body.projectName.trim().slice(0, 64)
      : 'agent-studio';
  const previous = parsePrevious(body.previous);
  return { prompt, applyToWorkspace, stream, projectName, previous };
}

export async function POST(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    if (!isAgentStudioEnabled()) {
      return NextResponse.json({ error: 'Ajan yapılandırma stüdyosu kapalı.' }, { status: 503 });
    }

    if (!isRunpodConfigured()) {
      return NextResponse.json(
        {
          error:
            'LLM henüz yapılandırılmadı. RUNPOD_ENDPOINT_ID ve API anahtarı gerekli.',
        },
        { status: 503 }
      );
    }

    const { prompt, applyToWorkspace, stream, projectName, previous } = parseBody(
      await req.json().catch(() => ({}))
    );

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt gerekli.' }, { status: 400 });
    }
    if (prompt.length > 4000) {
      return NextResponse.json({ error: 'Prompt çok uzun (max 4000).' }, { status: 400 });
    }

    if (!stream) {
      const result = await runStudioPipeline({
        userId: user.id,
        prompt,
        applyToWorkspace,
        projectName,
        previous,
        onProgress: () => {},
        onAgent: () => {},
      });
      return NextResponse.json({ ok: true, ...result });
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: StudioProgressEvent) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        };
        try {
          const result = await runStudioPipeline({
            userId: user.id,
            prompt,
            applyToWorkspace,
            projectName,
            previous,
            onProgress: (step, message) => {
              send({ type: 'progress', step, message });
            },
            onAgent: (kind, text, extra) => {
              send({
                type: 'agent',
                entry: {
                  kind,
                  text,
                  path: extra?.path,
                  status: extra?.status || 'running',
                  lane: extra?.lane,
                },
              });
            },
          });
          send({ type: 'done', ok: true, ...result });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Üretim başarısız.';
          await logServerError({
            source: 'studio/generate.POST.stream',
            error,
            req,
          });
          send({ type: 'error', message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Üretim başarısız.';
    const logId = await logServerError({
      source: 'studio/generate.POST',
      error,
      req,
    });
    return failResponse(message, logId);
  }
}

async function runStudioPipeline(opts: {
  userId: number;
  prompt: string;
  applyToWorkspace: boolean;
  projectName: string;
  previous: StudioGeneration | null;
  onProgress: (step: StudioStepId, message: string) => void;
  onAgent: (
    kind: AgentLogKind,
    text: string,
    extra?: { path?: string; status?: 'running' | 'done' | 'error'; lane?: string }
  ) => void;
}) {
  const {
    userId,
    prompt,
    applyToWorkspace,
    projectName,
    previous,
    onProgress,
    onAgent,
  } = opts;
  const iterating = Boolean(previous?.files?.length);

  onProgress('understand', iterating ? 'İsteğini mevcut proje üstüne uyguluyoruz…' : 'İsteğini okuyoruz…');
  onAgent(
    'think',
    iterating ? 'Mevcut proje inceleniyor…' : 'İstek okunuyor…',
    { status: 'running', lane: 'run' }
  );
  await new Promise((r) => setTimeout(r, 200));

  onProgress('coding', 'Ajan kod üretiyor…');
  onAgent(
    'status',
    iterating ? 'Güncelleme yazılıyor…' : 'Model çalışıyor…',
    { status: 'running', lane: 'run' }
  );

  const heartbeats = [
    'Model düşünüyor…',
    'Dosya yapısı planlanıyor…',
    'Arayüz yazılıyor…',
    'GPU yanıtı bekleniyor…',
  ];
  let beat = 0;
  const timer = setInterval(() => {
    onAgent('status', heartbeats[beat % heartbeats.length], {
      status: 'running',
      lane: 'run',
    });
    beat += 1;
  }, 9000);

  let generation: StudioGeneration;
  try {
    generation = await generateStudioProject(prompt, { previous });
  } finally {
    clearInterval(timer);
  }

  onAgent('status', `${generation.files.length} dosya üretildi`, {
    status: 'running',
    lane: 'run',
  });

  let workspace: {
    id: string;
    name: string;
    status: string;
    accessUrl: string | null;
  } | null = null;
  let written: { paths: string[]; projectDir: string } | null = null;
  let writeError: string | null = null;

  if (applyToWorkspace && isCoderConfigured()) {
    try {
      onProgress('workspace', 'Geliştirme ortamını açıyoruz…');
      onAgent('tool', 'Workspace hazırlanıyor…', {
        status: 'running',
        lane: 'run',
      });
      const created = await createUserWorkspace(userId, projectName);
      const { workspace: ready } = await waitForWorkspaceContainer(created.id, {
        timeoutMs: 420_000,
      });
      workspace = {
        id: ready.id,
        name: ready.name,
        status: ready.status,
        accessUrl: ready.accessUrl,
      };

      onProgress('writing', 'Dosyaları IDE’ye yerleştiriyoruz…');
      if (!isDockerSockAvailable()) {
        writeError =
          'Docker sock app konteynerinde yok; dosyalar panoda, IDE’ye yazılamadı.';
        onAgent('tool', 'IDE yazımı başarısız', { status: 'error', lane: 'run' });
      } else {
        onAgent('tool', 'Dosyalar yazılıyor…', {
          status: 'running',
          lane: 'run',
        });
        const result = await writeFilesToWorkspaceContainer(ready, generation.files);
        written = { paths: result.paths, projectDir: result.projectDir };
        onAgent('tool', `${result.paths.length} dosya yazıldı`, {
          status: 'done',
          lane: 'run',
        });
      }
    } catch (err) {
      writeError = err instanceof Error ? err.message : 'Workspace yazımı başarısız.';
      console.error('[studio/generate] workspace apply', err);
      onAgent('tool', 'Workspace hatası', { status: 'error', lane: 'run' });
    }
  } else if (applyToWorkspace && !isCoderConfigured()) {
    writeError = 'Coder yapılandırılmadı; yalnızca üretim paneli dolacak.';
    onAgent('status', 'Coder yapılandırılmadı', { status: 'error', lane: 'run' });
  } else {
    onProgress('workspace', 'Ortam adımı atlandı');
    onProgress('writing', 'Yalnızca önizleme hazır');
    onAgent('status', 'Önizleme hazır', { status: 'done', lane: 'run' });
  }

  return {
    prompt,
    generation: {
      title: generation.title,
      summary: generation.summary,
      files: generation.files,
      model: generation.model,
      jobId: generation.jobId,
    },
    workspace,
    written,
    writeError,
  };
}
