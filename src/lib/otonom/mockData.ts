import { DEPARTMENTS, DEPARTMENT_LABELS, type DepartmentSlug } from '@/lib/otonom/catalog';
import {
  formatTokenCount,
  listAllDepartmentServices,
  mockMetricsForService,
} from '@/lib/otonom/departmentServices';

export type AgentDashboardStats = {
  activeAgents: number;
  totalAgents: number;
  efficiencyGainPercent: number;
  hoursSavedWeek: number;
  tokensUsedToday: number;
  tokenBudgetDaily: number;
  tokenCostToday: number;
  weekTokens: { key: string; label: string; value: number }[];
  agents: {
    id: string;
    name: string;
    department: string;
    departmentSlug: DepartmentSlug;
    status: 'running' | 'waiting' | 'idle';
    efficiencyPercent: number;
    hoursSavedWeek: number;
    tokensToday: number;
    tokenBudgetDaily: number;
    href: string;
    icon: string;
    brandColor: string;
    description: string;
  }[];
  departments: {
    slug: DepartmentSlug;
    name: string;
    agentCount: number;
    efficiencyPercent: number;
    tokensToday: number;
    tokenBudgetDaily: number;
  }[];
};

const SAMPLE_TOKEN_WEEK = [420_000, 510_000, 468_000, 592_000, 548_000, 501_000, 526_600];
const DAY_LABELS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export function getAgentDashboardStats(): AgentDashboardStats {
  const services = listAllDepartmentServices();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  const enriched = services.map((service) => ({
    ...service,
    ...mockMetricsForService(service.slug),
  }));

  const tokensUsedToday = enriched.reduce((sum, item) => sum + item.tokensToday, 0);
  const tokenBudgetDaily = enriched.reduce((sum, item) => sum + item.tokenBudgetDaily, 0);
  const hoursSavedWeek = enriched.reduce((sum, item) => sum + item.hoursSavedWeek, 0);
  const activeAgents = enriched.filter((item) => item.status === 'running').length;
  const efficiencyGainPercent =
    enriched.length === 0
      ? 0
      : Math.round(
          enriched.reduce((sum, item) => sum + item.efficiencyPercent, 0) / enriched.length
        );

  return {
    activeAgents,
    totalAgents: enriched.length,
    efficiencyGainPercent,
    hoursSavedWeek,
    tokensUsedToday,
    tokenBudgetDaily,
    tokenCostToday: Math.round((tokensUsedToday / 1_000_000) * 4.2 * 100) / 100,
    weekTokens: days.map((date, index) => ({
      key: date.toISOString().slice(0, 10),
      label: DAY_LABELS[date.getDay()],
      value: SAMPLE_TOKEN_WEEK[index],
    })),
    agents: enriched.map((item) => ({
      id: item.slug,
      name: item.name,
      department: DEPARTMENT_LABELS[item.department],
      departmentSlug: item.department,
      status: item.status,
      efficiencyPercent: item.efficiencyPercent,
      hoursSavedWeek: item.hoursSavedWeek,
      tokensToday: item.tokensToday,
      tokenBudgetDaily: item.tokenBudgetDaily,
      href: item.href,
      icon: item.icon,
      brandColor: item.brandColor,
      description: item.description,
    })),
    departments: DEPARTMENTS.map((department) => {
      const deptItems = enriched.filter((item) => item.department === department.slug);
      const agentCount = deptItems.length;
      const tokensToday = deptItems.reduce((sum, item) => sum + item.tokensToday, 0);
      const tokenBudgetDaily = deptItems.reduce((sum, item) => sum + item.tokenBudgetDaily, 0);
      const efficiencyPercent =
        agentCount === 0
          ? 0
          : Math.round(
              deptItems.reduce((sum, item) => sum + item.efficiencyPercent, 0) / agentCount
            );

      return {
        slug: department.slug,
        name: department.name,
        agentCount,
        efficiencyPercent,
        tokensToday,
        tokenBudgetDaily,
      };
    }),
  };
}

export { formatTokenCount };

/** @deprecated Ajan dashboard kullanılıyor */
export function getMockDashboardStats() {
  return getAgentDashboardStats();
}

export type DashboardStats = AgentDashboardStats;
