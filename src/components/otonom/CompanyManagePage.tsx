'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CompanyProfileForm from '@/components/otonom/CompanyProfileForm';
import AgentManageChatbot from '@/components/otonom/AgentManageChatbot';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'detaylar', label: 'Şirket Detayları' },
  { id: 'yonetim', label: 'Yönetim' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function isTabId(value: string | null): value is TabId {
  return value === 'detaylar' || value === 'yonetim';
}

export default function CompanyManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramTab = searchParams.get('tab');
  const [tab, setTab] = useState<TabId>(isTabId(paramTab) ? paramTab : 'detaylar');

  useEffect(() => {
    if (isTabId(paramTab)) setTab(paramTab);
  }, [paramTab]);

  const selectTab = (next: TabId) => {
    setTab(next);
    router.replace(`/agent/manage/company?tab=${next}`, { scroll: false });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--bn-heading)] md:text-3xl">
          Şirket
        </h1>
        <div className="flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectTab(item.id)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                tab === item.id
                  ? 'border-white bg-white text-zinc-950'
                  : 'border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'detaylar' ? <CompanyProfileForm /> : <AgentManageChatbot />}
    </div>
  );
}
