'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import BrandLogo from '@/components/BrandLogo';
import MobileNavPanel from '@/components/MobileNavPanel';
import NavDropdown from '@/components/NavDropdown';
import NavAuth from '@/components/NavAuth';
import { useTranslations } from '@/components/LocaleProvider';
import { duration, easePremium } from '@/components/motion/tokens';
import { isPartnerPortalPath } from '@/lib/partnerPortal';
import { isNookAgentLaunchPath } from '@/lib/nookAgent';
import { isSimulationPath } from '@/lib/simulationPaths';

export default function Navbar() {
  const reduce = useReducedMotion();
  const { t } = useTranslations('nav');
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const hideChrome =
    isPartnerPortalPath(pathname) || isSimulationPath(pathname) || isNookAgentLaunchPath(pathname);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (hideChrome) {
    return null;
  }

  const iconBtn =
    'bn-nav-icon-btn relative inline-flex h-9 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40';

  return (
    <>
      <m.div
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: easePremium, delay: 0.05 }}
      >
        <nav className="relative w-full max-w-5xl" aria-label={t('mainNav')}>
          <div className="bn-nav-shell relative flex h-12 items-center justify-between gap-2 rounded-full border border-white/[0.1] bg-zinc-900/55 pl-3 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-150 sm:pl-4">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                className={`${iconBtn} -ml-1 md:hidden`}
                aria-label={t('openMenu')}
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
              </button>
              <BrandLogo textClassName="hidden sm:inline" />
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="hidden md:block">
                <NavDropdown />
              </div>
              <NavAuth />
            </div>
          </div>
        </nav>
      </m.div>

      <MobileNavPanel open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
