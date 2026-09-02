import type { Metadata } from 'next';
import NookMuhasebeSimulationPage from '@/components/simulations/nook-muhasebe/NookMuhasebeSimulationPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'NOOK MCP Simülasyonu | Blacknook',
  description:
    'Şantiye WhatsApp masraflarının Logo Tiger ve Mikro ERP taslak fişlerine aktarıldığı canlı NOOK MCP simülasyonu.',
  path: '/service/nook-muhasebe-mcp/simulasyon',
  noIndex: true,
});

export default function NookMuhasebeSimulationRoute() {
  return <NookMuhasebeSimulationPage />;
}
