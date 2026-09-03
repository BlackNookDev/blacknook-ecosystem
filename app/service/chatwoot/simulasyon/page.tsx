import type { Metadata } from 'next';
import ChatwootSimulationPage from '@/components/simulations/chatwoot/ChatwootSimulationPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Chatwoot Simülasyonu | Blacknook',
  description: 'Chatwoot Destek Ajanı — çok kanallı gelen kutusu ve canlı sohbet simülasyonu.',
  path: '/service/chatwoot/simulasyon',
  noIndex: true,
});

export default function ChatwootSimulationRoute() {
  return <ChatwootSimulationPage />;
}
