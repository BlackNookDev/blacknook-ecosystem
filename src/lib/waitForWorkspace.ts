import {
  getWorkspaceStatus,
  type WorkspaceInfo,
} from '@/lib/coderService';
import { findWorkspaceContainerId } from '@/lib/coderWorkspaceFiles';

/**
 * Workspace provision bitip Docker konteyneri görünene kadar bekler.
 * Dosya yazımı için agent "running" şart değil; konteyner yeterli.
 */
export async function waitForWorkspaceContainer(
  workspaceId: string,
  opts: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<{ workspace: WorkspaceInfo; containerId: string }> {
  const timeoutMs = opts.timeoutMs ?? 480_000;
  const intervalMs = opts.intervalMs ?? 4000;
  const started = Date.now();
  let last: WorkspaceInfo | null = null;

  while (Date.now() - started < timeoutMs) {
    last = await getWorkspaceStatus(workspaceId);
    if (last.status === 'failed' || last.status === 'canceled' || last.status === 'deleted') {
      throw new Error(`Workspace ${last.status}: ${last.name}`);
    }

    try {
      const containerId = await findWorkspaceContainerId(workspaceId);
      if (containerId) {
        return { workspace: last, containerId };
      }
    } catch {
      /* sock henüz yok / geçici hata */
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(
    `Workspace konteyneri zaman aşımı (${timeoutMs}ms). Son durum: ${last?.status || 'bilinmiyor'}`
  );
}
