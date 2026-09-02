import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/sessionUser';
import pool from '@/lib/db';
import {
  matchAssigneeEmail,
  matchTeamEmail,
  matchUserEmail,
} from '@/lib/emailTemplates';
import { getMatchMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';
import { pickMatchAssignee, toRequesterFacingAssignee } from '@/lib/matchAssign';
import { supportSuccessTitle, publicSupportName } from '@/lib/supportDisplay';
import type { SupportCategory, SupportUrgency } from '@/lib/supportAssistant';
import { createMatchConversation } from '@/lib/conversations';
import { notifyUser } from '@/lib/notify';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { failResponse, logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status')?.trim() || 'active';
    const params: any[] = [user.id];
    let sql = `SELECT
         mr.id, mr.name, mr.email, mr.need, mr.status, mr.created_at,
         mr.conversation_id, mr.assigned_user_id,
         u.name AS assigned_name, u.match_skills AS assigned_skills
       FROM match_requests mr
       LEFT JOIN users u ON u.id = mr.assigned_user_id
       WHERE mr.user_id = ?`;

    if (status !== 'all') {
      sql += ' AND mr.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY mr.created_at DESC LIMIT 50';

    const [rows]: any = await pool.query(sql, params);

    return NextResponse.json({
      requests: (rows || []).map((row: any) => ({
        id: Number(row.id),
        name: row.name,
        email: row.email,
        need: row.need,
        status: row.status,
        createdAt: row.created_at,
        conversationId: row.conversation_id ? Number(row.conversation_id) : null,
        assigned: row.assigned_user_id
          ? {
              id: Number(row.assigned_user_id),
              name: publicSupportName(row.assigned_name || 'Destek'),
              skills: row.assigned_skills || '',
            }
          : null,
      })),
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'match-request.GET',
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
    const need = typeof body.need === 'string' ? body.need.trim() : '';
    const urgency =
      typeof body.urgency === 'string' ? (body.urgency as SupportUrgency) : undefined;
    const category =
      typeof body.category === 'string' ? (body.category as SupportCategory) : undefined;
    const companyName =
      typeof body.companyName === 'string' ? body.companyName.trim().slice(0, 255) : '';
    const guestName = typeof body.name === 'string' ? body.name.trim().slice(0, 255) : '';
    const guestEmail =
      typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 255) : '';

    if (!need) {
      return NextResponse.json({ error: 'İhtiyacınızı kısaca yazın.' }, { status: 400 });
    }

    if (need.length > 4000) {
      return NextResponse.json({ error: 'Talep metni çok uzun.' }, { status: 400 });
    }

    if (!user) {
      if (!guestName || !guestEmail) {
        return NextResponse.json(
          { error: 'Destek talebi için ad ve e-posta gerekli.' },
          { status: 400 }
        );
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
        return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
      }
    }

    const name = user?.name || guestName || 'Misafir';
    const email = user?.email || guestEmail;
    const assignee = user ? await pickMatchAssignee(user.id) : await pickMatchAssignee(0);

    let insertId: number | undefined;
    try {
      const [result]: any = await pool.query(
        `INSERT INTO match_requests
          (user_id, name, email, need, status, urgency, category, company_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user?.id ?? null,
          name,
          email,
          need,
          'active',
          urgency || null,
          category || null,
          companyName || null,
        ]
      );
      if (result.insertId != null) insertId = Number(result.insertId);
    } catch (dbError) {
      const logId = await logServerError({
        source: 'match-request.POST.insert',
        error: dbError,
        req,
        userId: user?.id,
      });
      return failResponse('Talep kaydedilemedi. Lütfen tekrar deneyin.', logId);
    }

    if (!insertId) {
      return NextResponse.json({ error: 'Talep kaydedilemedi.' }, { status: 500 });
    }

    let conversationId: number | null = null;
    if (user && assignee) {
      try {
        conversationId = await createMatchConversation({
          requesterId: user.id,
          assigneeId: assignee.id,
          matchRequestId: insertId,
          need,
        });
      } catch (convError) {
        await logServerError({
          source: 'match-request.POST.conversation',
          error: convError,
          req,
          userId: user.id,
          extra: { matchRequestId: insertId },
        });
      }
    }

    const messagesHref = conversationId
      ? `/account/messages?c=${conversationId}`
      : '/account/requests';

    if (user) {
      await notifyUser({
        userId: user.id,
        title: assignee ? supportSuccessTitle(assignee.name) : 'Destek talebiniz alındı',
        body: need.length > 120 ? `${need.slice(0, 117)}…` : need,
        href: messagesHref,
      });
    }

    if (assignee && user) {
      await notifyUser({
        userId: assignee.id,
        title: `${name} destek talebi gönderdi`,
        body: need.length > 120 ? `${need.slice(0, 117)}…` : need,
        href: messagesHref,
      });
    }

    const teamMail = matchTeamEmail({
      name,
      email,
      need,
      requestId: insertId,
      assigneeName: assignee?.name,
    });
    const teamResult = await sendPlatformEmail({
      to: getMatchMailTo(),
      replyTo: email,
      ...teamMail,
    });

    if (!teamResult.ok) {
      console.error('[match-request] Ekip SMTP hatası (talep DB’de):', teamResult.error);
    }

    const userMail = matchUserEmail({
      name,
      need,
      requestId: insertId,
      assigneeName: assignee ? publicSupportName(assignee.name) : undefined,
      conversationId,
    });
    const userResult = await sendUserEmail({ to: email, ...userMail });
    if (!userResult.ok) {
      console.warn('[match-request] Kullanıcı onay maili gönderilemedi:', userResult.error);
    }

    if (assignee?.email) {
      const assigneeMail = matchAssigneeEmail({
        assigneeName: assignee.name,
        requesterName: name,
        need,
        conversationId,
      });
      const assigneeResult = await sendUserEmail({ to: assignee.email, ...assigneeMail });
      if (!assigneeResult.ok) {
        console.warn('[match-request] Atanan kişi maili gönderilemedi:', assigneeResult.error);
      }
    }

    return NextResponse.json({
      ok: true,
      id: insertId,
      conversationId,
      assigned: assignee ? toRequesterFacingAssignee(assignee) : null,
      mailed: teamResult.ok || userResult.ok,
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'match-request.POST',
      error,
      req,
    });
    return failResponse('Talep gönderilemedi. Lütfen tekrar deneyin.', logId);
  }
}
