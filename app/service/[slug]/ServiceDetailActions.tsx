'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SimulationLaunchButton from '@/components/simulations/SimulationLaunchButton';
import { getServiceSimulationPath } from '@/lib/simulationPaths';
import {
  installRequestPath,
  installRequestRegisterUrl,
} from '@/lib/installRequestFlow';
import { useInstallRequestNavigate } from '@/lib/useInstallRequestNavigate';

type Props = {
  serviceName: string;
  serviceSlug: string;
  demoUrl?: string;
};

export default function ServiceDetailActions({ serviceName, serviceSlug, demoUrl }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const goInstall = useInstallRequestNavigate();
  const simulationPath = getServiceSimulationPath(serviceSlug) || demoUrl;

  useEffect(() => {
    if (searchParams.get('openInstall') !== '1') return;
    if (status === 'loading') return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete('openInstall');
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });

    const opts = { slug: serviceSlug, name: serviceName };
    if (session?.user) {
      router.push(installRequestPath(opts));
    } else {
      router.push(installRequestRegisterUrl(opts));
    }
  }, [
    searchParams,
    pathname,
    router,
    serviceSlug,
    serviceName,
    session?.user,
    status,
  ]);

  return (
    <div className="flex flex-col gap-2.5">
      {simulationPath ? (
        <SimulationLaunchButton
          href={simulationPath}
          label="Önce önizle"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-60"
        />
      ) : null}
      <button
        type="button"
        onClick={() => goInstall({ slug: serviceSlug, name: serviceName })}
        disabled={status === 'loading'}
        className={
          simulationPath
            ? 'inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-3.5 text-sm font-bold text-zinc-100 transition-colors hover:bg-white/[0.06] disabled:opacity-60'
            : 'inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-60'
        }
      >
        Kurulum talep et
      </button>
    </div>
  );
}
