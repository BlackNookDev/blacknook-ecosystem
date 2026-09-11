/**
 * Coder workspace konteynerine dosya yazar (Docker Engine API / sock).
 *
 * Ortam:
 *   DOCKER_HOST — opsiyonel; yoksa unix:///var/run/docker.sock
 *   CODER_PROJECT_DIR — varsayılan /home/coder/project
 */

import http from 'http';
import { Buffer } from 'buffer';
import { existsSync } from 'fs';
import type { StudioFile } from '@/lib/studioGenerate';
import type { WorkspaceInfo } from '@/lib/coderService';

const DEFAULT_PROJECT_DIR = '/home/coder/project';

function dockerSocketPath(): string {
  const host = process.env.DOCKER_HOST?.trim();
  if (host?.startsWith('unix://')) return host.slice('unix://'.length);
  if (host && !host.includes('://')) return host;
  return '/var/run/docker.sock';
}

function projectDir(): string {
  return (process.env.CODER_PROJECT_DIR || DEFAULT_PROJECT_DIR).replace(/\/$/, '');
}

export function isDockerSockAvailable(): boolean {
  try {
    return existsSync(dockerSocketPath());
  } catch {
    return false;
  }
}

type DockerRequestOptions = {
  method?: string;
  path: string;
  body?: Buffer | string | null;
  headers?: Record<string, string>;
  expectJson?: boolean;
};

async function dockerRequest<T = unknown>(opts: DockerRequestOptions): Promise<{
  status: number;
  data: T | Buffer | null;
}> {
  const method = opts.method || 'GET';
  const bodyBuf =
    opts.body == null
      ? null
      : Buffer.isBuffer(opts.body)
        ? opts.body
        : Buffer.from(opts.body, 'utf8');

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        socketPath: dockerSocketPath(),
        path: opts.path,
        method,
        headers: {
          ...(bodyBuf
            ? {
                'Content-Length': String(bodyBuf.length),
                'Content-Type': opts.headers?.['Content-Type'] || 'application/json',
              }
            : {}),
          ...(opts.headers || {}),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          const status = res.statusCode || 0;
          if (status >= 400) {
            reject(
              new Error(
                `Docker API ${status}: ${buf.toString('utf8').slice(0, 400) || res.statusMessage}`
              )
            );
            return;
          }
          if (!buf.length) {
            resolve({ status, data: null });
            return;
          }
          if (opts.expectJson !== false && (res.headers['content-type'] || '').includes('json')) {
            try {
              resolve({ status, data: JSON.parse(buf.toString('utf8')) as T });
              return;
            } catch {
              /* fallthrough */
            }
          }
          resolve({ status, data: buf });
        });
      }
    );
    req.on('error', reject);
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

/** Minimal ustar tar (dosya + dizin girdileri). */
export function buildUstarTar(files: StudioFile[]): Buffer {
  const parts: Buffer[] = [];
  const dirs = new Set<string>();

  for (const file of files) {
    const rel = file.path.replace(/^\/+/, '');
    const segs = rel.split('/');
    for (let i = 1; i < segs.length; i++) {
      dirs.add(segs.slice(0, i).join('/') + '/');
    }
  }

  const writeEntry = (name: string, content: Buffer | null, isDir: boolean) => {
    const nameBuf = Buffer.alloc(100, 0);
    Buffer.from(name, 'utf8').copy(nameBuf, 0, 0, 100);
    const header = Buffer.alloc(512, 0);
    nameBuf.copy(header, 0);
    header.write(isDir ? '0000755\0' : '0000644\0', 100, 8, 'utf8'); // mode
    header.write('0001750\0', 108, 8, 'utf8'); // uid 1000
    header.write('0001750\0', 116, 8, 'utf8'); // gid 1000
    const size = content?.length || 0;
    header.write(size.toString(8).padStart(11, '0') + '\0', 124, 12, 'utf8');
    header.write(Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + '\0', 136, 12, 'utf8');
    header.write('        ', 148, 8, 'utf8'); // checksum placeholder
    header.write(isDir ? '5' : '0', 156, 1, 'utf8'); // type
    header.write('ustar\0', 257, 6, 'utf8');
    header.write('00', 263, 2, 'utf8');
    header.write('coder\0', 265, 32, 'utf8');
    header.write('coder\0', 297, 32, 'utf8');

    let sum = 0;
    for (let i = 0; i < 512; i++) sum += header[i];
    header.write(sum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'utf8');

    parts.push(header);
    if (content && content.length) {
      parts.push(content);
      const pad = (512 - (content.length % 512)) % 512;
      if (pad) parts.push(Buffer.alloc(pad, 0));
    }
  };

  for (const dir of [...dirs].sort()) writeEntry(dir, null, true);
  for (const file of files) {
    const rel = file.path.replace(/^\/+/, '');
    writeEntry(rel, Buffer.from(file.content, 'utf8'), false);
  }
  parts.push(Buffer.alloc(1024, 0));
  return Buffer.concat(parts);
}

type DockerContainer = {
  Id: string;
  Names?: string[];
  Labels?: Record<string, string>;
  State?: string;
};

export async function findWorkspaceContainerId(workspaceId: string): Promise<string | null> {
  const filter = encodeURIComponent(
    JSON.stringify({ label: [`coder.workspace_id=${workspaceId}`] })
  );
  const { data } = await dockerRequest<DockerContainer[]>({
    path: `/containers/json?all=true&filters=${filter}`,
    expectJson: true,
  });
  const list = Array.isArray(data) ? data : [];
  const running = list.find((c) => c.State === 'running') || list[0];
  return running?.Id || null;
}

async function dockerExec(
  containerId: string,
  cmd: string[]
): Promise<void> {
  const { data: created } = await dockerRequest<{ Id: string }>({
    method: 'POST',
    path: `/containers/${encodeURIComponent(containerId)}/exec`,
    body: JSON.stringify({
      AttachStdout: true,
      AttachStderr: true,
      User: 'coder',
      Cmd: cmd,
    }),
    expectJson: true,
  });
  const execId =
    created && typeof created === 'object' && !Buffer.isBuffer(created) && 'Id' in created
      ? String((created as { Id: string }).Id)
      : '';
  if (!execId) throw new Error('Docker exec oluşturulamadı.');

  await dockerRequest({
    method: 'POST',
    path: `/exec/${encodeURIComponent(execId)}/start`,
    body: JSON.stringify({ Detach: false, Tty: false }),
    headers: { 'Content-Type': 'application/json' },
    expectJson: false,
  });
}

export async function writeFilesToWorkspaceContainer(
  workspace: WorkspaceInfo,
  files: StudioFile[]
): Promise<{ containerId: string; paths: string[]; projectDir: string }> {
  if (!files.length) throw new Error('Yazılacak dosya yok.');
  if (!isDockerSockAvailable()) {
    throw new Error(
      'Docker sock yok. App servisine /var/run/docker.sock mount edin.'
    );
  }

  const containerId = await findWorkspaceContainerId(workspace.id);
  if (!containerId) {
    throw new Error(
      `Workspace konteyneri bulunamadı (${workspace.name}). Agent ayakta mı?`
    );
  }

  const dest = projectDir();
  await dockerExec(containerId, ['mkdir', '-p', dest]);

  const tar = buildUstarTar(files);
  await dockerRequest({
    method: 'PUT',
    path: `/containers/${encodeURIComponent(containerId)}/archive?path=${encodeURIComponent(dest)}`,
    body: tar,
    headers: { 'Content-Type': 'application/x-tar' },
    expectJson: false,
  });

  return {
    containerId,
    paths: files.map((f) => `${dest}/${f.path.replace(/^\/+/, '')}`),
    projectDir: dest,
  };
}
