'use client';

import HomeProductShowcase from '@/components/home/HomeProductShowcase';
import ServiceGrid from '@/components/ServiceGrid';

export default function HomeMotion() {
  return (
    <main className="relative bg-transparent">
      <HomeProductShowcase />
      <ServiceGrid />
    </main>
  );
}
