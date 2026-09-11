import type { Metadata } from 'next';
import CareersContent from '@/components/careers/CareersContent';
import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Kariyer | Blacknook',
  description:
    'Blacknook ekibine katıl. Ürün, tasarım, satış ve operasyon rollerinde birlikte büyüyelim.',
  path: '/careers',
});

const careersJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Kariyer | Blacknook',
  url: absoluteUrl('/careers'),
  description:
    'Blacknook kariyer sayfası: açık pozisyonlar, ekip kültürü ve çalışma ilkeleri.',
};

export default function CareersPage() {
  return (
    <>
      <JsonLd data={careersJsonLd} />
      <CareersContent />
    </>
  );
}
