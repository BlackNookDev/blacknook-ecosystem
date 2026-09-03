import type { CompanySlug } from '@/lib/otonom/companies';
import { DEFAULT_COMPANY_SLUG } from '@/lib/otonom/companies';

export const COMPANY_PROFILE_STORAGE_KEY = 'bn-agent-company-profile';

export type EntityType =
  | 'sole_proprietorship'
  | 'limited'
  | 'joint_stock'
  | 'collective'
  | 'commandite'
  | 'cooperative'
  | 'branch'
  | 'other';

export type TaxIdType = 'vkn' | 'tckn';

export type StructureType = 'single' | 'group' | 'subsidiary' | 'franchise';

export type ScaleClass = 'micro' | 'small' | 'medium' | 'large' | 'unknown';

export type KobiStatus = 'yes' | 'no' | 'unknown';

export type EmployeeRange = '1-9' | '10-49' | '50-249' | '250+' | 'unknown';

export type RevenueRange =
  | 'under_10m'
  | '10m_100m'
  | '100m_500m'
  | 'over_500m'
  | 'unknown';

export type CompanyProfile = {
  legalName: string;
  tradeName: string;
  entityType: EntityType | '';
  taxIdType: TaxIdType;
  taxId: string;
  taxOffice: string;
  mersisNo: string;
  tradeRegistryNo: string;
  structureType: StructureType | '';
  scaleClass: ScaleClass | '';
  kobiStatus: KobiStatus | '';
  employeeRange: EmployeeRange | '';
  revenueRange: RevenueRange | '';
  foundingYear: string;
  sectorSlug: CompanySlug;
  parentCompanyName: string;
  groupCompanyCount: string;
  authorizedPersonName: string;
  authorizedPersonTitle: string;
  authorizedEmail: string;
  authorizedPhone: string;
  companyEmail: string;
  companyPhone: string;
  website: string;
  city: string;
  district: string;
  address: string;
  naceCode: string;
  activityDescription: string;
};

export const ENTITY_TYPE_OPTIONS: { value: EntityType; label: string; defaultTaxId: TaxIdType }[] = [
  { value: 'sole_proprietorship', label: 'Şahıs işletmesi / gerçek kişi', defaultTaxId: 'tckn' },
  { value: 'limited', label: 'Limited şirket (Ltd. Şti.)', defaultTaxId: 'vkn' },
  { value: 'joint_stock', label: 'Anonim şirket (A.Ş.)', defaultTaxId: 'vkn' },
  { value: 'collective', label: 'Kollektif şirket', defaultTaxId: 'vkn' },
  { value: 'commandite', label: 'Komandit şirket', defaultTaxId: 'vkn' },
  { value: 'cooperative', label: 'Kooperatif', defaultTaxId: 'vkn' },
  { value: 'branch', label: 'Şube / temsilcilik', defaultTaxId: 'vkn' },
  { value: 'other', label: 'Diğer tüzel yapı', defaultTaxId: 'vkn' },
];

export const STRUCTURE_TYPE_OPTIONS: { value: StructureType; label: string }[] = [
  { value: 'single', label: 'Tek şirket' },
  { value: 'group', label: 'Grup / holding' },
  { value: 'subsidiary', label: 'Bağlı ortaklık / şube' },
  { value: 'franchise', label: 'Franchise / bayi ağı' },
];

export const SCALE_CLASS_OPTIONS: { value: ScaleClass; label: string }[] = [
  { value: 'micro', label: 'Mikro ölçek' },
  { value: 'small', label: 'Küçük ölçek' },
  { value: 'medium', label: 'Orta ölçek' },
  { value: 'large', label: 'Büyük ölçek' },
  { value: 'unknown', label: 'Henüz belirlenmedi' },
];

export const KOBI_STATUS_OPTIONS: { value: KobiStatus; label: string }[] = [
  { value: 'yes', label: 'KOBİ (evet)' },
  { value: 'no', label: 'KOBİ değil' },
  { value: 'unknown', label: 'Henüz doğrulanmadı' },
];

export const EMPLOYEE_RANGE_OPTIONS: { value: EmployeeRange; label: string }[] = [
  { value: '1-9', label: '1–9 çalışan' },
  { value: '10-49', label: '10–49 çalışan' },
  { value: '50-249', label: '50–249 çalışan' },
  { value: '250+', label: '250+ çalışan' },
  { value: 'unknown', label: 'Belirtmek istemiyorum' },
];

export const REVENUE_RANGE_OPTIONS: { value: RevenueRange; label: string }[] = [
  { value: 'under_10m', label: '10 milyon TL altı' },
  { value: '10m_100m', label: '10–100 milyon TL' },
  { value: '100m_500m', label: '100–500 milyon TL' },
  { value: 'over_500m', label: '500 milyon TL üzeri' },
  { value: 'unknown', label: 'Belirtmek istemiyorum' },
];

export function createEmptyCompanyProfile(sectorSlug: CompanySlug = DEFAULT_COMPANY_SLUG): CompanyProfile {
  return {
    legalName: '',
    tradeName: '',
    entityType: '',
    taxIdType: 'vkn',
    taxId: '',
    taxOffice: '',
    mersisNo: '',
    tradeRegistryNo: '',
    structureType: '',
    scaleClass: '',
    kobiStatus: '',
    employeeRange: '',
    revenueRange: '',
    foundingYear: '',
    sectorSlug,
    parentCompanyName: '',
    groupCompanyCount: '',
    authorizedPersonName: '',
    authorizedPersonTitle: '',
    authorizedEmail: '',
    authorizedPhone: '',
    companyEmail: '',
    companyPhone: '',
    website: '',
    city: '',
    district: '',
    address: '',
    naceCode: '',
    activityDescription: '',
  };
}

export function normalizeTaxId(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidVkn(value: string): boolean {
  return /^\d{10}$/.test(normalizeTaxId(value));
}

export function isValidTckn(value: string): boolean {
  const digits = normalizeTaxId(value);
  if (!/^\d{11}$/.test(digits) || digits[0] === '0') return false;

  const nums = digits.split('').map(Number);
  const oddSum = nums[0] + nums[2] + nums[4] + nums[6] + nums[8];
  const evenSum = nums[1] + nums[3] + nums[5] + nums[7];
  const digit10 = ((oddSum * 7 - evenSum) % 10 + 10) % 10;
  const digit11 = nums.slice(0, 10).reduce((sum, n) => sum + n, 0) % 10;

  return digit10 === nums[9] && digit11 === nums[10];
}

export function isValidTaxId(type: TaxIdType, value: string): boolean {
  return type === 'tckn' ? isValidTckn(value) : isValidVkn(value);
}

export function suggestTaxIdType(entityType: EntityType | ''): TaxIdType {
  if (entityType === 'sole_proprietorship') return 'tckn';
  return 'vkn';
}

export function getCompanyDisplayName(profile: CompanyProfile): string {
  return profile.tradeName.trim() || profile.legalName.trim();
}

export function getCompanySidebarHint(profile: CompanyProfile, sectorShortName: string): string {
  const name = getCompanyDisplayName(profile);
  if (name) return name;
  return sectorShortName;
}

export function validateCompanyProfile(profile: CompanyProfile): string[] {
  const errors: string[] = [];

  if (!profile.legalName.trim()) errors.push('Şirket unvanı zorunludur.');
  if (!profile.entityType) errors.push('Şirket türü seçilmelidir.');
  if (!profile.taxId.trim()) {
    errors.push(profile.taxIdType === 'tckn' ? 'TCKN zorunludur.' : 'VKN zorunludur.');
  } else if (!isValidTaxId(profile.taxIdType, profile.taxId)) {
    errors.push(
      profile.taxIdType === 'tckn'
        ? 'Geçerli bir TCKN girin (11 hane).'
        : 'Geçerli bir VKN girin (10 hane).'
    );
  }
  if (!profile.taxOffice.trim()) errors.push('Vergi dairesi zorunludur.');
  if (!profile.structureType) errors.push('Şirket yapısı seçilmelidir.');
  if (
    (profile.structureType === 'group' || profile.structureType === 'subsidiary') &&
    !profile.parentCompanyName.trim()
  ) {
    errors.push('Grup veya bağlı ortaklık için ana şirket unvanı girilmelidir.');
  }
  if (!profile.scaleClass) errors.push('İşletme ölçeği seçilmelidir.');
  if (!profile.kobiStatus) errors.push('KOBİ durumu seçilmelidir.');
  if (!profile.employeeRange) errors.push('Çalışan sayısı aralığı seçilmelidir.');
  if (!profile.authorizedPersonName.trim()) errors.push('Yetkili ad soyad zorunludur.');
  if (!profile.authorizedEmail.trim()) {
    errors.push('Yetkili e-posta zorunludur.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.authorizedEmail.trim())) {
    errors.push('Geçerli bir yetkili e-posta girin.');
  }
  if (!profile.city.trim()) errors.push('İl bilgisi zorunludur.');
  if (profile.foundingYear && !/^\d{4}$/.test(profile.foundingYear)) {
    errors.push('Kuruluş yılı 4 haneli olmalıdır.');
  }
  if (profile.mersisNo && !/^\d{16}$/.test(normalizeTaxId(profile.mersisNo))) {
    errors.push('MERSİS numarası 16 haneli olmalıdır.');
  }

  return errors;
}

export function readCompanyProfile(): CompanyProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COMPANY_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CompanyProfile>;
    return { ...createEmptyCompanyProfile(), ...parsed };
  } catch {
    return null;
  }
}

export function writeCompanyProfile(profile: CompanyProfile) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COMPANY_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}
