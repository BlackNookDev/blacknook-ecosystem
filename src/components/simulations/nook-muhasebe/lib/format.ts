export function formatTRY(value: number, decimals = 2): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatTRYCompact(value: number): string {
  const n = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
  return `₺${n}`
}

export function formatDateShort(date: string): string {
  const [day, month] = date.split('.')
  if (day && month) return `${day}.${month}`
  return date
}

const VENDOR_SHORT: Record<string, string> = {
  'Opet Petrolcülük A.Ş.': 'Opet',
  'Koçtaş Yapı Marketleri': 'Koçtaş',
  'Akçansa Çimento San. ve Tic. A.Ş.': 'Akçansa',
  'Karaköy Hırdavat San. Tic. Ltd. Şti.': 'Karaköy Hırd.',
}

export function abbreviateVendor(vendor: string, max = 18): string {
  if (VENDOR_SHORT[vendor]) return VENDOR_SHORT[vendor]
  if (vendor.length <= max) return vendor
  return `${vendor.slice(0, max - 1)}…`
}

export function abbreviateProject(project: string, max = 12): string {
  const short = project
    .replace('Rezidans', 'Rez.')
    .replace('Ticari', 'Tic.')
    .replace('Proje-01 / ', 'P-01 · ')
  if (short.length <= max) return short
  return `${short.slice(0, max - 1)}…`
}
