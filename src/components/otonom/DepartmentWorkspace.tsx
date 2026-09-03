'use client';

import { Suspense } from 'react';
import type { DepartmentDefinition } from '@/lib/otonom/catalog';
import DepartmentAgentsGrid from '@/components/otonom/DepartmentAgentsGrid';
import type { DepartmentSlug } from '@/lib/otonom/catalog';

export default function DepartmentWorkspace({ department }: { department: DepartmentDefinition }) {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--bn-heading)] md:text-3xl">
        {department.name}
      </h1>

      <p className="text-sm text-[var(--bn-subtitle)]">{department.description}</p>

      <Suspense fallback={<p className="text-sm text-zinc-500">Ajanlar yükleniyor…</p>}>
        <DepartmentAgentsGrid department={department.slug as DepartmentSlug} />
      </Suspense>
    </div>
  );
}
