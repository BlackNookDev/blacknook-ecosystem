import pool from '@/lib/db';
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceStatus,
  startWorkspace,
  stopWorkspace,
  type WorkspaceInfo,
} from '@/lib/coderService';

export type StoredWorkspace = {
  id: number;
  userId: number;
  projectName: string;
  coderWorkspaceId: string;
  coderWorkspaceName: string;
  status: string;
  accessUrl: string | null;
};

export async function findWorkspaceByUser(
  userId: number,
  projectName?: string
): Promise<StoredWorkspace | null> {
  const name = (projectName || 'default').slice(0, 64);
  const [rows]: any = await pool.query(
    `SELECT id, user_id, project_name, coder_workspace_id, coder_workspace_name, status, access_url
     FROM developer_workspaces
     WHERE user_id = ? AND project_name = ?
     ORDER BY updated_at DESC
     LIMIT 1`,
    [userId, name]
  );
  const row = rows?.[0];
  if (!row) return null;
  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    projectName: row.project_name,
    coderWorkspaceId: row.coder_workspace_id,
    coderWorkspaceName: row.coder_workspace_name,
    status: row.status || 'unknown',
    accessUrl: row.access_url || null,
  };
}

export async function findWorkspaceByCoderId(
  userId: number,
  coderWorkspaceId: string
): Promise<StoredWorkspace | null> {
  const [rows]: any = await pool.query(
    `SELECT id, user_id, project_name, coder_workspace_id, coder_workspace_name, status, access_url
     FROM developer_workspaces
     WHERE user_id = ? AND coder_workspace_id = ?
     LIMIT 1`,
    [userId, coderWorkspaceId]
  );
  const row = rows?.[0];
  if (!row) return null;
  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    projectName: row.project_name,
    coderWorkspaceId: row.coder_workspace_id,
    coderWorkspaceName: row.coder_workspace_name,
    status: row.status || 'unknown',
    accessUrl: row.access_url || null,
  };
}

export async function upsertWorkspaceRecord(
  userId: number,
  projectName: string,
  info: WorkspaceInfo
): Promise<void> {
  const name = projectName.slice(0, 64);
  await pool.query(
    `INSERT INTO developer_workspaces
       (user_id, project_name, coder_workspace_id, coder_workspace_name, status, access_url, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, project_name) DO UPDATE SET
       coder_workspace_id = EXCLUDED.coder_workspace_id,
       coder_workspace_name = EXCLUDED.coder_workspace_name,
       status = EXCLUDED.status,
       access_url = EXCLUDED.access_url,
       updated_at = CURRENT_TIMESTAMP`,
    [userId, name, info.id, info.name, info.status, info.accessUrl]
  );
}

export async function syncWorkspaceStatus(
  userId: number,
  coderWorkspaceId: string
): Promise<WorkspaceInfo> {
  const info = await getWorkspaceStatus(coderWorkspaceId);
  await pool.query(
    `UPDATE developer_workspaces
     SET status = ?, access_url = ?, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ? AND coder_workspace_id = ?`,
    [info.status, info.accessUrl, userId, coderWorkspaceId]
  );
  return info;
}

export async function createUserWorkspace(
  userId: number,
  projectName: string
): Promise<WorkspaceInfo> {
  const existing = await findWorkspaceByUser(userId, projectName);
  if (existing) {
    try {
      const info = await getWorkspaceStatus(existing.coderWorkspaceId);
      if (info.status === 'stopped') {
        const started = await startWorkspace(existing.coderWorkspaceId);
        await upsertWorkspaceRecord(userId, projectName, started);
        return started;
      }
      if (info.status === 'running' || info.status === 'starting' || info.status === 'pending') {
        await upsertWorkspaceRecord(userId, projectName, info);
        return info;
      }
      // failed / canceled / deleted → silip yeniden oluştur
      if (
        info.status === 'failed' ||
        info.status === 'canceled' ||
        info.status === 'deleted' ||
        info.status === 'unknown'
      ) {
        try {
          await deleteWorkspace(existing.coderWorkspaceId);
        } catch {
          /* zaten yok / silinemiyor — yeni create denenecek */
        }
        await pool.query(
          `DELETE FROM developer_workspaces WHERE user_id = ? AND project_name = ?`,
          [userId, projectName.slice(0, 64)]
        );
      } else {
        await upsertWorkspaceRecord(userId, projectName, info);
        return info;
      }
    } catch {
      // API’de yok / erişilemiyor → kayıt temizle, yeniden oluştur
      await pool.query(
        `DELETE FROM developer_workspaces WHERE user_id = ? AND project_name = ?`,
        [userId, projectName.slice(0, 64)]
      );
    }
  }

  const created = await createWorkspace(userId, projectName);
  await upsertWorkspaceRecord(userId, projectName, created);
  return created;
}

export async function stopUserWorkspace(
  userId: number,
  workspaceId: string
): Promise<WorkspaceInfo> {
  const owned = await findWorkspaceByCoderId(userId, workspaceId);
  if (!owned) {
    throw new Error('Workspace bulunamadı veya size ait değil.');
  }
  const info = await stopWorkspace(workspaceId);
  await upsertWorkspaceRecord(userId, owned.projectName, info);
  return info;
}

export async function startUserWorkspace(
  userId: number,
  workspaceId: string
): Promise<WorkspaceInfo> {
  const owned = await findWorkspaceByCoderId(userId, workspaceId);
  if (!owned) {
    throw new Error('Workspace bulunamadı veya size ait değil.');
  }
  const info = await startWorkspace(workspaceId);
  await upsertWorkspaceRecord(userId, owned.projectName, info);
  return info;
}
