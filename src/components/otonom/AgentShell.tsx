'use client';

import AgentSidebar from '@/components/otonom/AgentSidebar';
import { CompanyProvider } from '@/components/otonom/CompanyProvider';
import { usePathname } from 'next/navigation';

export default function AgentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullscreenApp = pathname.startsWith('/agent/studio');

  return (
    <CompanyProvider>
      {fullscreenApp ? (
        children
      ) : (
        <div className="relative z-0 mx-auto flex min-h-screen max-w-[90rem] flex-col lg:flex-row lg:items-start lg:gap-6 lg:p-4">
          <AgentSidebar />
          <main className="theme-surface relative min-w-0 flex-1 px-4 pb-16 pt-2 lg:px-2 lg:py-2">
            {children}
          </main>
        </div>
      )}
    </CompanyProvider>
  );
}
