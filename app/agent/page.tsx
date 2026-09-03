import OverviewDashboard from '@/components/otonom/OverviewDashboard';
import { getAgentDashboardStats } from '@/lib/otonom/mockData';

export default function AgentPage() {
  const stats = getAgentDashboardStats();

  return <OverviewDashboard stats={stats} />;
}
