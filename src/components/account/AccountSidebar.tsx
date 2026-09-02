'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  Grid2X2,
  Inbox,
  LogOut,
  MessageSquare,
  User,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useLocale } from '@/components/LocaleProvider';
import { getAccountNav } from '@/lib/navMenusI18n';
import type { AccountNavIcon } from '@/components/account/accountNav';
import { cn } from '@/lib/utils';

const ICONS: Record<AccountNavIcon, typeof User> = {
  user: User,
  inbox: Inbox,
  requests: MessageSquare,
  grid: Grid2X2,
  card: CreditCard,
};

export default function AccountSidebar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const accountNav = useMemo(() => getAccountNav(t), [t]);

  const isActive = (href: string) =>
    href === '/account' ? pathname === '/account' : pathname.startsWith(href);

  const handleLogout = () => {
    void signOut({ callbackUrl: '/' });
  };

  return (
    <aside className="w-full shrink-0 md:w-56 lg:w-60">
      <nav
        aria-label="Hesap menüsü"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-col md:gap-0.5 md:overflow-visible md:px-0 md:pb-0"
      >
        {accountNav.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors md:rounded-lg md:border-transparent md:px-3 md:py-2.5',
                active
                  ? 'border-emerald-400/30 bg-emerald-500/15 font-semibold text-emerald-300'
                  : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 md:border-transparent'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-0 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] px-3.5 py-2 text-left text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-100 md:mt-2 md:rounded-lg md:border-transparent md:px-3 md:py-2.5"
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          Çıkış yap
        </button>
      </nav>
    </aside>
  );
}
