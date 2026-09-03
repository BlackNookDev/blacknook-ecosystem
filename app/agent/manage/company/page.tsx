import { Suspense } from 'react';
import CompanyManagePage from '@/components/otonom/CompanyManagePage';

export default function AgentManageCompanyPage() {
  return (
    <Suspense fallback={null}>
      <CompanyManagePage />
    </Suspense>
  );
}
