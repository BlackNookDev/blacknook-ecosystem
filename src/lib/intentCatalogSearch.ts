import { getFullCatalog, type ServiceCatalogEntry } from '../../lib/data';

export type IntentTech = {
  id: string;
  label: string;
};

export type IntentMatch = {
  service: ServiceCatalogEntry;
  score: number;
  reasons: string[];
};

export type IntentSearchResult = {
  query: string;
  techs: IntentTech[];
  matches: IntentMatch[];
};

/** Sorgu token’larını genişleten kavram sözlüğü */
const CONCEPTS: {
  id: string;
  label: string;
  triggers: string[];
  boost: string[];
}[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    triggers: ['whatsapp', 'whatsap', 'whats app', 'wp', 'wa mesaj'],
    boost: ['whatsapp', 'chatwoot', 'mesaj', 'destek', 'saha'],
  },
  {
    id: 'excel',
    label: 'Excel',
    triggers: ['excel', 'xlsx', 'xls', 'csv', 'spreadsheet', 'google sheets', 'tablo'],
    boost: ['excel', 'csv', 'tablo', 'veri', 'rapor', 'export', 'sheets'],
  },
  {
    id: 'erp',
    label: 'ERP',
    triggers: ['erp', 'logo tiger', 'mikro', 'sap', 'logo'],
    boost: ['erp', 'logo', 'mikro', 'muhasebe', 'fiş', 'taslak'],
  },
  {
    id: 'muhasebe',
    label: 'Muhasebe',
    triggers: ['muhasebe', 'masraf', 'fiş', 'fatura', 'kdv', 'cari'],
    boost: ['muhasebe', 'masraf', 'fiş', 'fatura', 'nook'],
  },
  {
    id: 'eticaret',
    label: 'E-ticaret',
    triggers: ['e-ticaret', 'eticaret', 'trendyol', 'hepsiburada', 'pazaryeri', 'shopppro', 'stok', 'sipariş'],
    boost: ['e-ticaret', 'shopppro', 'stok', 'pazaryeri', 'sipariş', 'kargo'],
  },
  {
    id: 'crm',
    label: 'CRM / Destek',
    triggers: ['crm', 'destek', 'müşteri', 'ticket', 'canlı destek', 'chat'],
    boost: ['chatwoot', 'destek', 'crm', 'müşteri', 'ticket'],
  },
  {
    id: 'randevu',
    label: 'Randevu',
    triggers: ['randevu', 'takvim', 'cal.com', 'meeting', 'görüşme'],
    boost: ['randevu', 'cal', 'takvim', 'slot'],
  },
  {
    id: 'analitik',
    label: 'Analitik',
    triggers: ['analitik', 'analytics', 'trafik', 'metabase', 'plausible', 'bi', 'dashboard', 'pano'],
    boost: ['metabase', 'plausible', 'analitik', 'bi', 'rapor', 'pano'],
  },
  {
    id: 'wiki',
    label: 'Dokümantasyon',
    triggers: ['wiki', 'doküman', 'bilgi bankası', 'outline', 'runbook'],
    boost: ['outline', 'wiki', 'doküman', 'bilgi'],
  },
  {
    id: 'entegrasyon',
    label: 'Entegrasyon',
    triggers: ['entegre', 'entegrasyon', 'bağla', 'bağlantı', 'senkron', 'sync', 'mcp', 'ajan'],
    boost: ['entegrasyon', 'mcp', 'bağlan', 'senkron', 'otomasyon'],
  },
  {
    id: 'guvenlik',
    label: 'Güvenlik',
    triggers: ['güvenlik', 'zafiyet', 'yama', 'cve', 'snyk', 'uyum', 'kvkk'],
    boost: ['güvenlik', 'yama', 'zafiyet', 'uyum', 'kvkk'],
  },
];

function normalize(text: string) {
  return text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9ğüşıöç\s.+#-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectConcepts(queryNorm: string) {
  return CONCEPTS.filter((concept) =>
    concept.triggers.some((trigger) => queryNorm.includes(normalize(trigger)))
  );
}

function serviceHaystack(service: ServiceCatalogEntry) {
  return normalize(
    [
      service.name,
      service.slug,
      service.description,
      service.about,
      service.category,
      service.agentDepartment || '',
      ...service.features,
      ...service.useCases,
    ].join(' ')
  );
}

function scoreService(
  service: ServiceCatalogEntry,
  queryNorm: string,
  queryTokens: string[],
  concepts: typeof CONCEPTS
): IntentMatch | null {
  const hay = serviceHaystack(service);
  let score = 0;
  const reasons: string[] = [];

  for (const token of queryTokens) {
    if (token.length < 3) continue;
    if (hay.includes(token)) {
      score += token.length >= 6 ? 4 : 2;
    }
  }

  for (const concept of concepts) {
    const hit = concept.boost.some((term) => hay.includes(normalize(term)));
    if (hit) {
      score += 8;
      reasons.push(concept.label);
    }
  }

  // Çoklu kavram: her kavramı kapsayan ürünlere ekstra puan
  if (concepts.length >= 2) {
    const covered = concepts.filter((c) =>
      c.boost.some((term) => hay.includes(normalize(term)))
    ).length;
    if (covered >= 2) {
      score += 10;
      reasons.push('Çoklu entegrasyon');
    }
  }

  const nameNorm = normalize(service.name);
  if (queryTokens.some((t) => t.length > 3 && nameNorm.includes(t))) {
    score += 6;
  }

  if (score <= 0) return null;
  return {
    service,
    score,
    reasons: [...new Set(reasons)].slice(0, 3),
  };
}

export function searchCatalogByIntent(rawQuery: string, limit = 6): IntentSearchResult {
  const query = rawQuery.trim();
  const queryNorm = normalize(query);
  if (!queryNorm) {
    return { query, techs: [], matches: [] };
  }

  const concepts = detectConcepts(queryNorm);
  const techs: IntentTech[] = concepts
    .filter((c) => c.id !== 'entegrasyon')
    .map((c) => ({ id: c.id, label: c.label }));

  const queryTokens = queryNorm.split(' ').filter(Boolean);
  const catalog = getFullCatalog();

  const scored = catalog
    .map((service) => scoreService(service, queryNorm, queryTokens, concepts))
    .filter((item): item is IntentMatch => Boolean(item))
    .sort((a, b) => b.score - a.score || a.service.name.localeCompare(b.service.name, 'tr'));

  // Kavram yoksa da basit metin araması sonuç versin
  let matches = scored.slice(0, limit);
  if (matches.length === 0) {
    matches = catalog
      .filter((service) => {
        const hay = serviceHaystack(service);
        return queryTokens.filter((t) => t.length > 2).some((t) => hay.includes(t));
      })
      .slice(0, limit)
      .map((service) => ({ service, score: 1, reasons: [] as string[] }));
  }

  return { query, techs, matches };
}

export const INTENT_SEARCH_EXAMPLES = [
  'WhatsApp’ımı Excel’ime entegre etmek istiyorum',
  'Şantiye masraflarını ERP’ye aktar',
  'E-ticaret stok ve pazaryeri senkronu',
  'Web trafiğimi çerezsiz ölçmek istiyorum',
] as const;
