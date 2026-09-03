import integrationsJson from '@/data/mcp-integrations.json';
import type { ServiceCatalogEntry } from '../../lib/data';

export type McpIntegration = {
  id: string;
  name: string;
  category: string;
  description: string;
  about: string;
  features: string[];
  useCases: string[];
  brandColor: string;
  logoUrl: string;
};

const INTEGRATIONS = integrationsJson as McpIntegration[];
const MCP_SLUG_PREFIX = 'mcp-';

function normalizeAbout(entry: McpIntegration): string {
  if (entry.description && entry.description.length >= 24) {
    return entry.description;
  }
  return entry.about || entry.description;
}

function normalizeUseCases(entry: McpIntegration): string[] {
  const cases: string[] = [];
  const push = (value?: string) => {
    const trimmed = value?.trim().replace(/\.$/, '');
    if (!trimmed || cases.includes(trimmed)) return;
    cases.push(trimmed);
  };

  push(entry.description);
  entry.useCases.forEach((item) => push(item));
  entry.features.slice(0, 2).forEach((item) => push(item));

  return cases.slice(0, 3);
}

export function mcpSlug(id: string): string {
  return `${MCP_SLUG_PREFIX}${id}`;
}

export function mcpAsCatalogEntry(entry: McpIntegration): ServiceCatalogEntry {
  return {
    slug: mcpSlug(entry.id),
    name: entry.name,
    description: entry.description,
    icon: entry.logoUrl,
    category: entry.category,
    brandColor: entry.brandColor,
    features: entry.features,
    about: normalizeAbout(entry),
    useCases: normalizeUseCases(entry),
    catalogKind: 'mcp-agent',
    source: 'mcp',
  };
}

export function listMcpCatalogEntries(): ServiceCatalogEntry[] {
  return INTEGRATIONS.map(mcpAsCatalogEntry);
}

export function listMcpCatalogSlugs(): string[] {
  return INTEGRATIONS.map((entry) => mcpSlug(entry.id));
}

export function getMcpCatalogEntryBySlug(slug: string): ServiceCatalogEntry | undefined {
  if (!slug.startsWith(MCP_SLUG_PREFIX)) return undefined;
  const id = slug.slice(MCP_SLUG_PREFIX.length);
  const entry = INTEGRATIONS.find((item) => item.id === id);
  return entry ? mcpAsCatalogEntry(entry) : undefined;
}

export function getMcpIntegrationById(id: string): McpIntegration | undefined {
  return INTEGRATIONS.find((item) => item.id === id);
}

export function listMcpIntegrations(): McpIntegration[] {
  return INTEGRATIONS;
}
