import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';
import { installationTeamEmail, installationUserEmail } from '@/lib/emailTemplates';
import { getPlatformMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';
import { notifyAdmins, notifyUser } from '@/lib/notify';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { failResponse, logServerError } from '@/lib/errorLog';
import {
  deploymentOptionLabel,
  isDeploymentOptionId,
  type DeploymentOptionId,
} from '@/lib/deploymentOptions';

export const dynamic = 'force-dynamic';

function mapRow(row: any) {
  return {
    id: Number(row.id),
    serviceSlug: row.service_slug,
    serviceName: row.service_name,
    companyName: row.company_name,
    email: row.email,
    requirements: row.requirements,
    deploymentType: row.deployment_type ?? null,
    deploymentLabel: deploymentOptionLabel(row.deployment_type),
    status: row.status,
    createdAt: row.created_at,
    userId: row.user_id != null ? Number(row.user_id) : null,
  };
}

export async function GET(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const adminAll = req.nextUrl.searchParams.get('scope') === 'admin';
    if (adminAll) {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
      }
      const status = req.nextUrl.searchParams.get('status');
      const params: unknown[] = [];
      let sql = `SELECT id, user_id, service_slug, service_name, company_name, email,
                        requirements, deployment_type, status, created_at
                 FROM installation_requests`;
      if (status === 'active' || status === 'closed' || status === 'cancelled') {
        sql += ` WHERE status = ?`;
        params.push(status);
      }
      sql += ` ORDER BY created_at DESC LIMIT 200`;
      const [rows]: any = await pool.query(sql, params);
      return NextResponse.json({
        requests: (rows || []).map(mapRow),
      });
    }

    const [rows]: any = await pool.query(
      `SELECT id, user_id, service_slug, service_name, company_name, email,
              requirements, deployment_type, status, created_at
       FROM installation_requests
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [user.id]
    );

    return NextResponse.json({
      requests: (rows || []).map(mapRow),
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'installation-request.GET',
      error,
      req,
    });
    return failResponse('Talepler yüklenemedi.', logId);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();

    const body = await req.json();
    const { serviceSlug, serviceName, requirements, companyName, email, deploymentType } =
      body;

    if (!user) {
      return NextResponse.json(
        { error: 'Kurulum talebi için giriş gerekli.' },
        { status: 401 }
      );
    }

    if (!serviceSlug || !serviceName) {
      return NextResponse.json({ error: 'Servis bilgisi eksik.' }, { status: 400 });
    }

    const reqText = typeof requirements === 'string' ? requirements.trim() : '';
    const company = typeof companyName === 'string' ? companyName.trim() : '';
    const fromEmail = user.email;

    if (!isDeploymentOptionId(deploymentType)) {
      return NextResponse.json(
        { error: 'Kurulum ortamı seçimi gerekli.' },
        { status: 400 }
      );
    }
    const deployment = deploymentType as DeploymentOptionId;

    if (!reqText || !company || !fromEmail) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurmanız gerekiyor.' },
        { status: 400 }
      );
    }

    // email from body ignored when session exists — keep type quiet
    void email;

    if (reqText.length > 6000) {
      return NextResponse.json({ error: 'Talep metni çok uzun.' }, { status: 400 });
    }

    let insertId: number | undefined;
    try {
      const [result]: any = await pool.query(
        `INSERT INTO installation_requests
          (user_id, service_slug, service_name, company_name, email, requirements, deployment_type, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          user.id,
          String(serviceSlug).slice(0, 255),
          String(serviceName).slice(0, 255),
          company,
          fromEmail,
          reqText,
          deployment,
        ]
      );
      if (result.insertId != null) insertId = Number(result.insertId);
    } catch (dbError) {
      const logId = await logServerError({
        source: 'installation-request.POST.insert',
        error: dbError,
        req,
        userId: user.id,
      });
      return failResponse('Talep kaydedilemedi.', logId);
    }

    const deployLabel = deploymentOptionLabel(deployment);

    await notifyUser({
      userId: user.id,
      title: 'Kurulum talebiniz alındı',
      body: `${serviceName} · ${deployLabel}`,
      href: '/account/requests',
    });

    await notifyAdmins({
      title: 'Yeni kurulum talebi',
      body: `${company} · ${serviceName} · ${deployLabel}`,
      href: '/admin/installations',
      exceptUserId: user.id,
    });

    const teamMail = installationTeamEmail({
      serviceName,
      serviceSlug,
      companyName: company,
      email: fromEmail,
      requirements: reqText,
      deploymentLabel: deployLabel,
      adminHref: '/admin/installations',
    });

    const teamResult = await sendPlatformEmail({
      to: getPlatformMailTo(),
      replyTo: fromEmail,
      ...teamMail,
    });

    if (!teamResult.ok) {
      console.error('[installation-request] SMTP (talep DB’de):', teamResult.error);
    }

    const userMail = installationUserEmail({
      serviceName,
      serviceSlug,
      companyName: company,
      requirements: reqText,
      deploymentLabel: deployLabel,
    });
    const userResult = await sendUserEmail({ to: fromEmail, ...userMail });
    if (!userResult.ok) {
      console.warn('[installation-request] Kullanıcı maili gönderilemedi:', userResult.error);
    }

    return NextResponse.json({
      ok: true,
      id: insertId,
      mailed: teamResult.ok || userResult.ok,
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'installation-request.POST',
      error,
      req,
    });
    return failResponse('Talep gönderilemedi. Lütfen tekrar deneyin.', logId);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
    }

    const body = await req.json();
    const id = Number(body.id);
    const status = body.status;
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'Geçersiz talep.' }, { status: 400 });
    }
    if (status !== 'active' && status !== 'closed' && status !== 'cancelled') {
      return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 });
    }

    await pool.query(`UPDATE installation_requests SET status = ? WHERE id = ?`, [
      status,
      id,
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const logId = await logServerError({
      source: 'installation-request.PATCH',
      error,
      req,
    });
    return failResponse('Güncellenemedi.', logId);
  }
}
