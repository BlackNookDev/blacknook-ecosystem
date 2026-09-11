'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Bell, LogOut, User, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/account', label: 'Profil', icon: User },
  { href: '/account/messages', label: 'Mesajlar', icon: Bell },
] as const;

export default function AccountProfileDock() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const rawName = session?.user?.name || '';
  const name =
    rawName && rawName.toLowerCase() !== 'demo' ? rawName : 'Kullanıcı';
  const initials =
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'BN';

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-4 border-t border-white/[0.08] pt-3">
      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1f] shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
          <ul className="p-1.5">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === '/account'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors',
                      active
                        ? 'bg-emerald-500/15 text-emerald-200'
                        : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-1 border-t border-white/[0.08] pt-1">
              <button
                type="button"
                onClick={() => void signOut({ callbackUrl: '/' })}
                className="flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
              >
                <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                Çıkış yap
              </button>
            </li>
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/[0.06]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15 text-sm font-semibold text-emerald-100">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">{name}</span>
        </span>
        <ChevronUp
          className={cn('h-4 w-4 shrink-0 text-zinc-500 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
    </div>
  );
}
