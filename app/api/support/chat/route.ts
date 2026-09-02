import { NextRequest, NextResponse } from 'next/server';
import {
  generateSupportReply,
  type SupportChatMessage,
} from '@/lib/supportAssistant';
import { failResponse, logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

function parseMessages(raw: unknown): SupportChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const out: SupportChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const role = (item as { role?: string }).role;
    const content = (item as { content?: string }).content;
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof content !== 'string' || !content.trim()) return null;
    out.push({ role, content: content.trim().slice(0, 4000) });
  }
  if (out.length === 0 || out.length > 40) return null;
  if (out[out.length - 1].role !== 'user') return null;
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = parseMessages(body.messages);
    if (!messages) {
      return NextResponse.json({ error: 'Geçersiz sohbet verisi.' }, { status: 400 });
    }

    const { reply, fromLlm } = await generateSupportReply(messages);

    return NextResponse.json({ reply, fromLlm });
  } catch (error) {
    const logId = await logServerError({
      source: 'support/chat.POST',
      error,
      req,
    });
    return failResponse('Yanıt oluşturulamadı.', logId);
  }
}
