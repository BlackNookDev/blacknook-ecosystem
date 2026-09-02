export type SupportUrgency = 'today' | '48h' | 'week';
export type SupportCategory =
  | 'install'
  | 'security'
  | 'integration'
  | 'incident'
  | 'advisory'
  | 'other';

export type SupportChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const SUPPORT_URGENCY_LABELS: Record<SupportUrgency, string> = {
  today: 'Bugün (kritik)',
  '48h': '48 saat içinde',
  week: 'Bu hafta',
};

export const SUPPORT_CATEGORY_LABELS: Record<SupportCategory, string> = {
  install: 'Kurulum & deploy',
  security: 'Güvenlik & sertleştirme',
  integration: 'Entegrasyon & API',
  incident: 'Arıza / acil müdahale',
  advisory: 'Danışmanlık',
  other: 'Diğer',
};

export const SUPPORT_WELCOME =
  'Merhaba, ben Blacknook Destek asistanıyım. Kurulum, güvenlik sertleştirme, entegrasyon veya acil teknik konularda yardımcı olabilirim. Sizi teknik desteğe bağlarken sorununuzdan bahsedin.';

export const SUPPORT_SYSTEM_PROMPT = `Sen Blacknook Destek asistanısın. Blacknook, self-host ve SaaS yazılım ekosistemi vitrinidir.

Görevin:
- Türkçe, profesyonel ve sakin bir dille yanıt ver.
- Kurulum, güvenlik (IAM, MFA, sertleştirme, KVKK/veri egemenliği), entegrasyon ve acil arıza konularında ilk triage yap.
- Kullanıcıyı teknik ekibe bağlamadan önce aciliyeti ve konuyu netleştir.
- Kesin güvenlik garantisi veya yasal uyumluluk sertifikası verme; gerektiğinde uzman ekibe yönlendir.
- Kısa paragraflar kullan; madde işaretleri uygunsa kullan.
- Üretim ortamı şifreleri, API anahtarları veya gizli bilgi isteme.

Kullanıcı teknik personele bağlanmak istediğinde veya kritik bir olay bildirdiğinde, özet hazır olduğunu belirt ve "Teknik ekibe bağlan" butonunu kullanmasını öner.`;

export function buildSupportNeedSummary(params: {
  urgency?: SupportUrgency;
  category?: SupportCategory;
  chatSummary: string;
  userNote?: string;
}) {
  const lines: string[] = [];
  if (params.urgency) {
    lines.push(`Aciliyet: ${SUPPORT_URGENCY_LABELS[params.urgency]}`);
  }
  if (params.category) {
    lines.push(`Konu: ${SUPPORT_CATEGORY_LABELS[params.category]}`);
  }
  if (params.userNote?.trim()) {
    lines.push('', params.userNote.trim());
  }
  if (params.chatSummary.trim()) {
    lines.push('', '---', 'Destek sohbeti özeti:', params.chatSummary.trim());
  }
  return lines.join('\n').slice(0, 4000);
}

export function summarizeChatForTicket(messages: SupportChatMessage[]) {
  return messages
    .filter((m) => m.content.trim())
    .map((m) => `${m.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${m.content.trim()}`)
    .join('\n')
    .slice(0, 3000);
}

/** Geçici demo: SUPPORT_DEMO_MODE=false ve OPENAI_API_KEY ile gerçek LLM açılır. */
export function isSupportDemoMode() {
  const raw = process.env.SUPPORT_DEMO_MODE?.trim().toLowerCase();
  if (raw === 'false' || raw === '0' || raw === 'off') return false;
  return true;
}

export async function generateSupportReply(
  messages: SupportChatMessage[]
): Promise<{ reply: string; fromLlm: boolean }> {
  if (isSupportDemoMode()) {
    return { reply: demoSupportReply(messages), fromLlm: false };
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_SUPPORT_MODEL?.trim() || 'gpt-4o-mini';

  if (!apiKey) {
    return { reply: demoSupportReply(messages), fromLlm: false };
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 700,
        messages: [
          { role: 'system', content: SUPPORT_SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!res.ok) {
      console.error('[support/chat] OpenAI error', res.status, await res.text());
      return { reply: demoSupportReply(messages), fromLlm: false };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return { reply: demoSupportReply(messages), fromLlm: false };
    }
    return { reply, fromLlm: true };
  } catch (error) {
    console.error('[support/chat] OpenAI request failed', error);
    return { reply: demoSupportReply(messages), fromLlm: false };
  }
}

function demoSupportReply(messages: SupportChatMessage[]) {
  const lastUser =
    [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';
  const turn = messages.filter((m) => m.role === 'user').length;

  if (/merhaba|selam|günaydın|iyi akşam/.test(lastUser) && turn <= 1) {
    return 'Merhaba! Blacknook Destek hattına hoş geldiniz. Kurulum, güvenlik, entegrasyon veya acil teknik konularda size yardımcı olabilirim. Sizi teknik desteğe bağlarken sorununuzdan bahsedin.';
  }

  if (/acil|kritik|hack|sız|saldır|üretim|down|çöktü|erişilemiyor/.test(lastUser)) {
    return 'Bu durum öncelikli görünüyor. Örnek triage soruları:\n\n• Etkilenen sistem veya ürün adı nedir?\n• Sorun ne zaman başladı?\n• Üretim ortamı mı, test mi?\n\nBu bilgileri paylaştıktan sonra «Teknik ekibe bağlan» ile talebi iletebilirsiniz; ekip aynı gün dönüş hedefler.';
  }

  if (/kurulum|deploy|docker|kubernetes|self.?host|sunucu/.test(lastUser)) {
    return 'Kurulum desteği için şu bilgileri netleştirelim:\n\n• Hedef ortam (AWS, Azure, on-prem, VPS)\n• İşletim sistemi ve sürüm\n• Kurmak istediğiniz ürün\n\nÖrnek: “Ubuntu 22.04 üzerinde NOOK MCP’yi Docker ile kurmak istiyorum.” Detayları topladıktan sonra teknik ekibe aktarabilirim.';
  }

  if (/güvenlik|mfa|sso|iam|şifre|tls|sertifika|kvkk|uyumluluk/.test(lastUser)) {
    return 'Güvenlik konusunda ilk adım olarak şunları önerebilirim:\n\n• MFA / SSO yapılandırması\n• IAM rolleri ve en az yetki prensibi\n• TLS ve sertifika yenileme takvimi\n\nHassas bilgi paylaşmayın. «Teknik ekibe bağlan» ile güvenli kanaldan uzmanımıza aktarabilirsiniz.';
  }

  if (/entegrasyon|api|webhook|n8n|zapier/.test(lastUser)) {
    return 'Entegrasyon için tipik akış şöyledir:\n\n1. Kaynak ve hedef sistemleri belirleyin\n2. API dokümantasyonunu paylaşın\n3. Test ortamında doğrulayın\n\nHangi sistemlerin konuşması gerektiğini yazarsanız örnek bir yol haritası çıkarabilirim.';
  }

  if (/fiyat|ücret|maliyet|lisans|paket/.test(lastUser)) {
    return 'Fiyatlandırma ürün ve kurulum kapsamına göre değişir. İlgilendiğiniz ürünün sayfasındaki bilgileri inceleyebilir veya «Teknik ekibe bağlan» ile size özel teklif için ekibimizle görüşebilirsiniz.';
  }

  if (/teşekkür|sağol|eyvallah|tamam/.test(lastUser)) {
    return 'Rica ederim. Başka bir konuda yardımcı olmamı isterseniz yazabilirsiniz. Hazır olduğunuzda «Teknik ekibe bağlan» ile talebinizi iletebilirsiniz.';
  }

  if (turn === 1) {
    return 'Anladım. Biraz daha ayrıntı verirseniz size uygun yolu önerebilirim — örneğin aciliyet, etkilenen sistem ve hedefiniz. Hazır olduğunuzda «Teknik ekibe bağlan» ile talebi ekibe iletebilirsiniz.';
  }

  if (turn >= 2) {
    return 'Paylaştığınız bilgiler yeterli görünüyor. İsterseniz aciliyet ve konu seçeneklerini işaretleyip «Teknik ekibe bağlan» ile talebi teknik ekibimize iletebilirsiniz; atanan uzman Hesap → Mesajlar üzerinden size dönecektir.';
  }

  return 'Size nasıl yardımcı olabilirim? Kurulum, güvenlik, entegrasyon veya acil teknik konularda sorununuzu yazın; hazır olduğunuzda «Teknik ekibe bağlan» ile talebi iletebilirsiniz.';
}
