import type { Metadata } from 'next';
import FlowiseSimulationPage from '@/components/simulations/flowise/FlowiseSimulationPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Flowise Simülasyonu | Blacknook',
  description:
    'İK politikaları üzerinde RAG tabanlı Flowise agent akışının canlı simülasyonu.',
  path: '/service/flowise/simulasyon',
  noIndex: true,
});

export default function FlowiseSimulationRoute() {
  return <FlowiseSimulationPage />;
}
