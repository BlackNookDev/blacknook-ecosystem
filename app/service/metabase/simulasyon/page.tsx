import type { Metadata } from 'next';
import MetabaseSimulationPage from '@/components/simulations/metabase/MetabaseSimulationPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Metabase Simülasyonu | Blacknook',
  description: 'Metabase iş zekası platformunun canlı simülasyonu.',
  path: '/service/metabase/simulasyon',
  noIndex: true,
});

export default function MetabaseSimulationRoute() {
  return <MetabaseSimulationPage />;
}
