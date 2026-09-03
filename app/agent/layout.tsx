import type { Metadata } from 'next';
import AuthGate from '@/components/auth/AuthGate';
import AgentShell from '@/components/otonom/AgentShell';
import { buildPageMetadata } from '@/lib/seo';
import { NOOK_AGENT_LAUNCH_PATH } from '@/lib/nookAgent';

export const metadata: Metadata = buildPageMetadata({
  title: 'NOOK Agent | Blacknook',
  description: 'Blacknook Otonom operasyon kokpiti.',
  path: NOOK_AGENT_LAUNCH_PATH,
  noIndex: true,
});

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate fallbackHref="/login?callbackUrl=%2Fagent" loadingLabel="NOOK Agent yükleniyor…">
      <AgentShell>{children}</AgentShell>
    </AuthGate>
  );
}
