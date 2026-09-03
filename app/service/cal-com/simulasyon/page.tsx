import type { Metadata } from 'next';
import CalComSimulationPage from '@/components/simulations/cal-com/CalComSimulationPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Cal Simülasyonu | Blacknook',
  description: 'Cal randevu planlama arayüzünün canlı simülasyonu.',
  path: '/service/cal-com/simulasyon',
  noIndex: true,
});

export default function CalComSimulationRoute() {
  return <CalComSimulationPage />;
}
