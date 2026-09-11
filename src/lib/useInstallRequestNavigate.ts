'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import {
  installRequestPath,
  installRequestRegisterUrl,
} from '@/lib/installRequestFlow';

/** Giriş yoksa kayıt; varsa detaylı talep formu */
export function useInstallRequestNavigate() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return useCallback(
    (opts: { slug: string; name: string; hint?: string }) => {
      if (status === 'loading') return;
      if (session?.user) {
        router.push(installRequestPath(opts));
        return;
      }
      router.push(installRequestRegisterUrl(opts));
    },
    [router, session?.user, status]
  );
}
