'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { isPartnerPortalPath } from '@/lib/partnerPortal';
import { isNookAgentLaunchPath } from '@/lib/nookAgent';
import { isSimulationPath } from '@/lib/simulationPaths';

/** Partner portal sayfalarında ana site footer’ını gizler */
export default function SiteFooter() {
  const pathname = usePathname();
  if (
    isPartnerPortalPath(pathname) ||
    isSimulationPath(pathname) ||
    isNookAgentLaunchPath(pathname) ||
    pathname.startsWith('/pitch')
  )
    return null;
  return <Footer />;
}
