import type { ApplicantType } from '@/lib/developerApplicationsTypes';

export type { ApplicantType } from '@/lib/developerApplicationsTypes';

export const APPLICANT_TYPE_LABEL: Record<ApplicantType, string> = {
  developer: 'Yazılımcı',
  entrepreneur: 'Girişimci',
};

/** Admin vitrininde gösterilecek cevap etiketleri */
export const ANSWER_LABELS: Record<string, string> = {
  city: 'Şehir / ülke',
  yearsExperience: 'Deneyim (yıl)',
  primaryRole: 'Birincil rol',
  languages: 'Programlama dilleri',
  linkedinUrl: 'LinkedIn',
  openSource: 'Topluluk katkıları',
  notableProjects: 'Öne çıkan projeler',
  productToList: 'Listelenecek ürün',
  deliveryModel: 'Teslimat modeli',
  demoUrl: 'Canlı URL',
  supportHours: 'Haftalık destek kapasitesi',
  englishLevel: 'İngilizce seviyesi',
  whyBlacknook: 'Neden Blacknook?',
  pricingIdea: 'Fiyatlandırma fikri',
  founderRole: 'Kurucu rolü',
  productName: 'Ürün adı',
  oneLiner: 'Tek cümlelik vaat',
  problem: 'Çözülen problem',
  solution: 'Çözüm',
  targetCustomer: 'Hedef müşteri',
  stage: 'Aşama',
  revenueStatus: 'Gelir durumu',
  teamSize: 'Ekip büyüklüğü',
  traction: 'Traction / metrikler',
  competitors: 'Rakipler',
  goToMarket: 'Go-to-market',
  funding: 'Yatırım / fonlama',
  pitchDeckUrl: 'Pitch deck',
  launchTimeline: 'Lansman zamanı',
  supportPlan: 'Destek planı',
};
