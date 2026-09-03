'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import {
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  ChevronDown,
  Cpu,
  HardHat,
  Headset,
  HeartPulse,
  Landmark,
  LayoutGrid,
  LineChart,
  Megaphone,
  Menu,
  Scale,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import { type DepartmentSlug } from '@/lib/otonom/catalog';
import { getSidebarDepartments } from '@/lib/otonom/sectorDepartments';
import { listProcessesForDepartment } from '@/lib/otonom/companies';
import { NOOK_AGENT_LAUNCH_PATH } from '@/lib/nookAgent';
import AccountProfileDock from '@/components/otonom/AccountProfileDock';
import { useCompany } from '@/components/otonom/CompanyProvider';
import { cn } from '@/lib/utils';

const ICONS: Record<DepartmentSlug, LucideIcon> = {
  muhasebe: Calculator,
  finans: Landmark,
  satis: LineChart,
  operasyon: Boxes,
  ik: Users,
  teknoloji: Cpu,
  hukuk: Scale,
  uyum: ShieldCheck,
  pazarlama: Megaphone,
  destek: Headset,
  'satin-alma': ShoppingBag,
  yonetim: Briefcase,
  'e-ticaret': ShoppingCart,
  insaat: HardHat,
  'tedarik-zinciri': Truck,
  'saglik-klinik': HeartPulse,
};

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  match: (pathname: string) => boolean;
};

const OVERVIEW: NavItem = {
  href: NOOK_AGENT_LAUNCH_PATH,
  label: 'Genel bakış',
  icon: LayoutGrid,
  match: (pathname) => pathname === NOOK_AGENT_LAUNCH_PATH,
};

const DEPARTMENTS_OPEN_KEY = 'bn-agent-departments-open';

export default function AgentSidebar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { companySlug, company } = useCompany();
  const { horizontal: horizontalDepartments, vertical: verticalDepartments } = useMemo(
    () => getSidebarDepartments(companySlug),
    [companySlug]
  );
  const visibleDepartments = useMemo(
    () => [...horizontalDepartments, ...verticalDepartments],
    [horizontalDepartments, verticalDepartments]
  );
  const [open, setOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(true);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<DepartmentSlug>>(new Set());

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DEPARTMENTS_OPEN_KEY);
      if (stored === '0') setDepartmentsOpen(false);
      if (stored === '1') setDepartmentsOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!pathname.startsWith('/agent/departments/')) {
      setExpandedDepartments(new Set());
      return;
    }

    setDepartmentsOpen(true);
    const match = pathname.match(/^\/agent\/departments\/([^/]+)/);
    if (!match || !visibleDepartments.some((item) => item.slug === match[1])) return;

    const slug = match[1] as DepartmentSlug;
    setExpandedDepartments(new Set([slug]));
  }, [pathname, visibleDepartments]);

  const toggleDepartment = (slug: DepartmentSlug) => {
    setExpandedDepartments((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleDepartments = () => {
    setDepartmentsOpen((value) => {
      const next = !value;
      try {
        window.localStorage.setItem(DEPARTMENTS_OPEN_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const manageItems: NavItem[] = [
    {
      href: '/agent/manage/company',
      label: 'Şirket',
      icon: Building2,
      match: (path) => path.startsWith('/agent/manage'),
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
        <Link href={NOOK_AGENT_LAUNCH_PATH} className="flex items-center gap-2.5 text-[var(--bn-heading)]">
          <Image src="/bn-mark.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-display text-[15px] font-bold tracking-tight">Blacknook</span>
        </Link>
        <button
          type="button"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:bg-white/[0.08] hover:text-white"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`bn-card-solid fixed inset-y-3 left-3 z-50 flex w-[17rem] shrink-0 flex-col overflow-y-auto rounded-2xl p-3 transition-transform duration-premium ease-premium lg:sticky lg:top-4 lg:z-0 lg:max-h-[calc(100dvh-2rem)] lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'
        }`}
      >
        <Link
          href={NOOK_AGENT_LAUNCH_PATH}
          onClick={() => setOpen(false)}
          className="mb-5 flex items-center gap-2.5 px-2 pt-1"
        >
          <Image src="/bn-mark.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <div>
            <p className="font-display text-[15px] font-bold leading-tight tracking-tight text-[var(--bn-heading)]">
              Blacknook
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bn-faint)]">
              Otonom
            </p>
          </div>
        </Link>

        <NavLink item={OVERVIEW} pathname={pathname} onNavigate={() => setOpen(false)} />

        <p className="mb-2 mt-5 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bn-faint)]">
          Yönet
        </p>

        <nav className="flex flex-col gap-1">
          {manageItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleDepartments}
          aria-expanded={departmentsOpen}
          className="mb-2 mt-5 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bn-faint)] transition-colors hover:bg-white/[0.04] hover:text-zinc-300"
        >
          <span className="min-w-0 truncate">Departmanlar</span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="max-w-[5.5rem] truncate text-[10px] font-medium normal-case tracking-normal text-zinc-500">
              {company.shortName}
            </span>
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform duration-premium', departmentsOpen && 'rotate-180')}
              aria-hidden
            />
          </span>
        </button>

        {departmentsOpen ? (
          <AnimatePresence mode="wait" initial={false}>
            <m.nav
              key={companySlug}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: 10 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col gap-1"
            >
              {horizontalDepartments.map((department) => (
                <DepartmentNavItem
                  key={department.slug}
                  department={department}
                  companySlug={companySlug}
                  pathname={pathname}
                  expanded={expandedDepartments.has(department.slug)}
                  onToggle={() => toggleDepartment(department.slug)}
                  onNavigate={() => setOpen(false)}
                />
              ))}

              {verticalDepartments.length > 0 ? (
                <>
                  <p className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-400/80">
                    Sektör
                  </p>
                  {verticalDepartments.map((department) => (
                    <DepartmentNavItem
                      key={department.slug}
                      department={department}
                      companySlug={companySlug}
                      pathname={pathname}
                      expanded={expandedDepartments.has(department.slug)}
                      onToggle={() => toggleDepartment(department.slug)}
                      onNavigate={() => setOpen(false)}
                    />
                  ))}
                </>
              ) : null}
            </m.nav>
          </AnimatePresence>
        ) : null}

        <AccountProfileDock />
      </aside>
    </>
  );
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = item.match(pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-premium ease-premium',
        active
          ? 'bg-white text-zinc-950'
          : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}

function DepartmentNavItem({
  department,
  companySlug,
  pathname,
  expanded,
  onToggle,
  onNavigate,
}: {
  department: { slug: DepartmentSlug; shortName: string };
  companySlug: Parameters<typeof listProcessesForDepartment>[0];
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const href = `/agent/departments/${department.slug}`;
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const processes = listProcessesForDepartment(companySlug, department.slug);

  return (
    <DepartmentNavGroup
      href={href}
      label={department.shortName}
      icon={ICONS[department.slug]}
      active={active}
      expanded={expanded}
      hasProcesses={processes.length > 0}
      onToggle={onToggle}
      onNavigate={onNavigate}
      processes={processes}
    />
  );
}

function DepartmentNavGroup({
  href,
  label,
  icon: Icon,
  active,
  expanded,
  hasProcesses,
  onToggle,
  onNavigate,
  processes,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  expanded: boolean;
  hasProcesses: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  processes: { id: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {hasProcesses ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(
            'flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors duration-premium ease-premium',
            active
              ? 'bg-white text-zinc-950'
              : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-left">{label}</span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 shrink-0 transition-transform duration-premium',
              expanded && 'rotate-180',
              active ? 'text-zinc-600' : 'text-zinc-500'
            )}
            aria-hidden
          />
        </button>
      ) : (
        <Link
          href={href}
          onClick={onNavigate}
          className={cn(
            'flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors duration-premium ease-premium',
            active
              ? 'bg-white text-zinc-950'
              : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      )}

      {expanded && processes.length > 0 ? (
        <ul className="mb-1 ml-7 space-y-0.5 border-l border-white/[0.08] pl-3">
          {processes.map((process) => (
            <li key={process.id}>
              <Link
                href={href}
                onClick={onNavigate}
                className={cn(
                  'block rounded-md py-1 pr-2 text-[11px] leading-snug transition-colors',
                  active
                    ? 'text-zinc-300 hover:text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {process.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
