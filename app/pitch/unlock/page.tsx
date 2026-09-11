import type { Metadata } from 'next';
import { Suspense } from 'react';
import PitchUnlockForm from '@/components/pitch/PitchUnlockForm';

export const metadata: Metadata = {
  title: 'Pitch erişimi | Blacknook',
  robots: { index: false, follow: false },
};

export default function PitchUnlockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#161618]" />}>
      <PitchUnlockForm />
    </Suspense>
  );
}
