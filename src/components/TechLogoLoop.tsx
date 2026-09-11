'use client';

import { usePathname } from 'next/navigation';
import LogoLoop from '@/components/LogoLoop';
import { isPartnerPortalPath } from '@/lib/partnerPortal';
import { isNookAgentLaunchPath } from '@/lib/nookAgent';
import { isSimulationPath } from '@/lib/simulationPaths';

const partnerLogos = [
  {
    src: '/partner-logos/aws.svg',
    alt: 'AWS Cloud',
    title: 'AWS Cloud',
    href: 'https://aws.amazon.com',
    height: 40,
    width: 64,
  },
  {
    src: '/partner-logos/google-cloud.svg',
    alt: 'Google Cloud',
    title: 'Google Cloud',
    href: 'https://cloud.google.com',
    height: 40,
    width: 48,
  },
  {
    node: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/partner-logos/btm.png"
        alt=""
        className="h-10 w-auto max-w-[140px] object-contain brightness-0 invert"
        draggable={false}
      />
    ),
    title: 'BTM — Bilgiyi Ticarileştirme Merkezi',
    href: 'https://btm.istanbul',
    ariaLabel: 'BTM — Bilgiyi Ticarileştirme Merkezi',
  },
];

export default function TechLogoLoop() {
  const pathname = usePathname();
  // Ana sayfada PartnerPowerBand gösterildiği için tekrar eden logo şeridini gizle
  if (
    pathname === '/' ||
    pathname.startsWith('/pitch') ||
    isPartnerPortalPath(pathname) ||
    isSimulationPath(pathname) ||
    isNookAgentLaunchPath(pathname)
  ) {
    return null;
  }

  return (
    <section
      className="theme-surface relative overflow-hidden border-t border-white/[0.06] py-12"
      aria-label="İş ortakları"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="relative h-[100px]">
        <LogoLoop
          logos={partnerLogos}
          speed={90}
          direction="left"
          logoHeight={40}
          gap={72}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#161618"
          ariaLabel="İş ortakları: AWS Cloud, Google Cloud, BTM"
        />
      </div>
    </section>
  );
}
