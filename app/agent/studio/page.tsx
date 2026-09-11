import type { Metadata } from 'next';
import AgentStudioPage from '@/components/otonom/AgentStudioPage';

export const metadata: Metadata = {
  title: 'Kendi sistemini oluştur | Blacknook Otonom',
  description: 'Tarayıcıda izole geliştirme ortamı ile kendi sisteminizi oluşturun.',
};

export default function AgentStudioRoute() {
  return <AgentStudioPage />;
}
