import type { CompanySlug } from '@/lib/otonom/companies';
import {
  VERTICAL_DEPARTMENT_SLUGS,
  getHorizontalDepartments,
  getVerticalDepartmentDefinitions,
  type DepartmentDefinition,
} from '@/lib/otonom/catalog';

export type VerticalDepartmentSlug = (typeof VERTICAL_DEPARTMENT_SLUGS)[number];

/** Şirket sektörüne göre gösterilecek dikey departmanlar */
export const SECTOR_VERTICAL_DEPARTMENTS: Record<CompanySlug, VerticalDepartmentSlug[]> = {
  telekomunikasyon: [],
  'finans-bankacilik-sigorta': [],
  seyahat: ['e-ticaret'],
  saglik: ['saglik-klinik'],
  'perakende-fmcg': ['e-ticaret'],
  otomotiv: ['tedarik-zinciri'],
  'enerji-cevre': [],
  'devlet-resmi-kurumlar': [],
  lojistik: ['tedarik-zinciri'],
  insaat: ['insaat'],
};

export function getVerticalDepartmentsForSector(sector: CompanySlug): VerticalDepartmentSlug[] {
  return SECTOR_VERTICAL_DEPARTMENTS[sector] ?? [];
}

export function isVerticalDepartment(slug: string): slug is VerticalDepartmentSlug {
  return (VERTICAL_DEPARTMENT_SLUGS as readonly string[]).includes(slug);
}

export function getSectorLabelForVertical(slug: VerticalDepartmentSlug): string {
  const labels: Record<VerticalDepartmentSlug, string> = {
    'e-ticaret': 'Perakende & e-ticaret',
    insaat: 'İnşaat & proje',
    'tedarik-zinciri': 'Lojistik & tedarik',
    'saglik-klinik': 'Sağlık & klinik',
  };
  return labels[slug];
}

export function getSidebarDepartments(sector: CompanySlug): {
  horizontal: DepartmentDefinition[];
  vertical: DepartmentDefinition[];
} {
  const verticalSlugs = new Set(getVerticalDepartmentsForSector(sector));
  return {
    horizontal: getHorizontalDepartments(),
    vertical: getVerticalDepartmentDefinitions().filter((department) =>
      verticalSlugs.has(department.slug as VerticalDepartmentSlug)
    ),
  };
}
