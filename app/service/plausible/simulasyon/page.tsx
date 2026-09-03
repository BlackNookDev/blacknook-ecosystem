import type { Metadata } from 'next';
import PlausibleSimulationPage from '@/components/simulations/plausible/PlausibleSimulationPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Plausible Simülasyonu | Blacknook',
  description: 'Plausible web analitiği platformunun canlı simülasyonu.',
  path: '/service/plausible/simulasyon',
  noIndex: true,
});

export default function PlausibleSimulationRoute() {
  return <PlausibleSimulationPage />;
}
