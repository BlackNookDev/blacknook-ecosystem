'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const linkClass =
  'inline-flex h-9 items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40';

export default function NavAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <span className="inline-block h-9 w-[5.5rem] rounded-full bg-white/[0.04]" aria-hidden />;
  }

  if (session?.user) {
    return (
      <Link href="/account" className={linkClass}>
        Hesabım
      </Link>
    );
  }

  return (
    <Link href="/login" className={linkClass}>
      Giriş yap
    </Link>
  );
}
