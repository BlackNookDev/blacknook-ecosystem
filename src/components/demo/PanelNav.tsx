'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertTriangle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { href: '/admin/installations', label: 'Kurulum talepleri', icon: ClipboardList },
  { href: '/admin/errors', label: 'Hatalar', icon: AlertTriangle },
] as const;

type Props = {
  variant?: 'admin';
};

export default function PanelNav({ variant: _variant = 'admin' }: Props) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin paneli"
      className="mb-8 flex flex-wrap gap-1 border-b border-white/[0.08] pb-3"
    >
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-white/[0.08] text-white'
                : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
