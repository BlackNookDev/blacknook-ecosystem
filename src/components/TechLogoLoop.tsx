'use client';

import { usePathname } from 'next/navigation';
import LogoLoop from '@/components/LogoLoop';
import { isPartnerPortalPath } from '@/lib/partnerPortal';
import { isNookAgentLaunchPath } from '@/lib/nookAgent';
import { isSimulationPath } from '@/lib/simulationPaths';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
];

export default function TechLogoLoop() {
  const pathname = usePathname();
  if (isPartnerPortalPath(pathname) || isSimulationPath(pathname) || isNookAgentLaunchPath(pathname))
    return null;

  return (
    <section
      className="theme-surface relative overflow-hidden border-t border-white/[0.06] py-12"
      aria-label="Technology partners"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="relative h-[100px]">
        <LogoLoop
          logos={techLogos}
          speed={90}
          direction="left"
          logoHeight={40}
          gap={56}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#161618"
          ariaLabel="Technology partners"
        />
      </div>
    </section>
  );
}
