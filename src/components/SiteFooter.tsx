'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { isPartnerPortalPath } from '@/lib/partnerPortal';
import { isSimulationPath } from '@/lib/simulationPaths';

/** Partner portal sayfalarında ana site footer’ını gizler */
export default function SiteFooter() {
  const pathname = usePathname();
  if (isPartnerPortalPath(pathname) || isSimulationPath(pathname)) return null;
  return <Footer />;
}
