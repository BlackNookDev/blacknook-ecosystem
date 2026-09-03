import type { Metadata } from 'next';
import AccountGate from '@/components/account/AccountGate';
import AgentShell from '@/components/otonom/AgentShell';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hesabım | Blacknook',
  description: 'Profil, ürünler, ödeme ve faturalama ayarlarınızı yönetin.',
  path: '/account',
  noIndex: true,
});

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountGate>
      <AgentShell>{children}</AgentShell>
    </AccountGate>
  );
}
