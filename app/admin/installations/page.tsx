import type { Metadata } from 'next';
import AuthGate from '@/components/auth/AuthGate';
import PanelNav from '@/components/demo/PanelNav';
import { buildPageMetadata } from '@/lib/seo';
import AdminInstallationsClient from './AdminInstallationsClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'Kurulum talepleri | Admin',
  description: 'Yönetilen kurulum kuyruğu — talepleri görüntüle ve kapat.',
  path: '/admin/installations',
  noIndex: true,
});

export default function AdminInstallationsPage() {
  return (
    <AuthGate allowRoles={['admin']} fallbackHref="/account">
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        <PanelNav variant="admin" />
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Kurulum talepleri
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Platform yönetimli onboarding kuyruğu. Yeni talepler e-posta + bildirim ile düşer.
        </p>
        <div className="mt-10">
          <AdminInstallationsClient />
        </div>
      </main>
    </AuthGate>
  );
}
