import type { Metadata } from 'next';
import PitchPage from '@/components/pitch/PitchPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Pitch | Blacknook',
  description:
    'Blacknook yatırımcı özeti: otonom operasyon paneli, keşif ve yönetilen kurulum.',
  path: '/pitch',
  noIndex: true,
});

export default function PitchRoute() {
  return <PitchPage />;
}
