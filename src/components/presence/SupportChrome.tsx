'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PresenceDock from '@/components/presence/PresenceDock';
import MatchDeveloperModal from '@/components/MatchDeveloperModal';
import { isPartnerPortalPath } from '@/lib/partnerPortal';
import { isSimulationPath } from '@/lib/simulationPaths';

export default function SupportChrome() {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supportOpen, setSupportOpen] = useState(false);

  const hideChrome = isPartnerPortalPath(pathname) || isSimulationPath(pathname);
  const showDock = status === 'authenticated' && !hideChrome;

  useEffect(() => {
    if (hideChrome) return;
    if (searchParams.get('destek') === '1' || searchParams.get('match') === '1') {
      setSupportOpen(true);
      router.replace('/', { scroll: false });
    }
  }, [searchParams, hideChrome, router]);

  useEffect(() => {
    if (hideChrome) return;
    const onOpen = () => setSupportOpen(true);
    window.addEventListener('bn-open-support', onOpen);
    window.addEventListener('bn-open-match', onOpen);
    return () => {
      window.removeEventListener('bn-open-support', onOpen);
      window.removeEventListener('bn-open-match', onOpen);
    };
  }, [hideChrome]);

  if (hideChrome) return null;

  return (
    <>
      {showDock ? <PresenceDock /> : null}
      <MatchDeveloperModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
