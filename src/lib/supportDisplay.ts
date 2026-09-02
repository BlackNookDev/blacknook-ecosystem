import { DEVELOPERS } from '../../lib/developerPresence';

const STAFF_NAMES = new Set([
  'admin',
  'administrator',
  'root',
  'support',
  'blacknook',
  'blacknook admin',
]);

export function isStaffDisplayName(name: string) {
  return STAFF_NAMES.has(name.trim().toLowerCase());
}

export function publicSupportName(name: string) {
  const trimmed = name.trim();
  if (!trimmed || isStaffDisplayName(trimmed)) return 'Teknik uzman';
  return trimmed;
}

/** @deprecated use publicSupportName */
export const publicMatchName = publicSupportName;

export function supportSuccessTitle(name: string) {
  const publicName = publicSupportName(name);
  if (publicName === 'Teknik uzman') return 'Teknik ekibe bağlandınız';
  return `${publicName} ile bağlandınız`;
}

/** @deprecated use supportSuccessTitle */
export const matchSuccessTitle = supportSuccessTitle;

export function publicSenderName(name: string) {
  return isStaffDisplayName(name) ? 'Destek ekibi' : name.trim() || 'Destek ekibi';
}

export function staffPersona(seed: number) {
  const i = Math.abs(seed) % DEVELOPERS.length;
  return DEVELOPERS[i];
}
