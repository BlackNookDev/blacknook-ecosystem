import { DEPARTMENTS, DEPARTMENT_LABELS, type DepartmentSlug } from '@/lib/otonom/catalog';
import {
  formatTokenCount,
  listAllDepartmentServices,
  mockMetricsForService,
} from '@/lib/otonom/departmentServices';

export type PendingAction = {
  id: string;
  department: string;
  departmentSlug: DepartmentSlug;
  title: string;
  primaryLabel: string;
  secondaryLabel?: string;
};

export type LiveActivity = {
  id: string;
  time: string;
  agent: string;
  detail: string;
  status: 'done' | 'resolved' | 'warning';
  statusLabel: string;
};

export type AgentDashboardStats = {
  hoursSaved: number;
  hoursSavedTrendPercent: number;
  activeAgents: number;
  connectedSources: number;
  totalOperations: number;
  budgetUsedUsd: number;
  budgetCapUsd: number;
  weekOperations: { key: string; label: string; value: number }[];
  pendingActions: PendingAction[];
  departments: {
    slug: DepartmentSlug;
    name: string;
    agentCount: number;
    completedPercent: number;
  }[];
  liveActivities: LiveActivity[];
  /** Eski alanlar — yönetici chatbot vb. uyumluluk */
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
};

const DAY_LABELS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

/** Gerçek kurulum yokken boş / sıfır — sahte KPI yok. */
export function getAgentDashboardStats(): AgentDashboardStats {
  const services = listAllDepartmentServices();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  const weekOperations = days.map((date) => ({
    key: date.toISOString().slice(0, 10),
    label: DAY_LABELS[date.getDay()],
    value: 0,
  }));

  const departments = DEPARTMENTS.map((department) => ({
    slug: department.slug,
    name: department.name,
    agentCount: 0,
    completedPercent: 0,
  }));

  return {
    hoursSaved: 0,
    hoursSavedTrendPercent: 0,
    activeAgents: 0,
    connectedSources: 0,
    totalOperations: 0,
    budgetUsedUsd: 0,
    budgetCapUsd: 100,
    weekOperations,
    pendingActions: [],
    departments,
    liveActivities: [],
    totalAgents: 0,
    efficiencyGainPercent: 0,
    hoursSavedWeek: 0,
    tokensUsedToday: 0,
    tokenBudgetDaily: 0,
    tokenCostToday: 0,
    weekTokens: weekOperations.map((row) => ({ ...row, value: 0 })),
    agents: services.map((item) => {
      const metrics = mockMetricsForService(item.slug);
      return {
        id: item.slug,
        name: item.name,
        department: DEPARTMENT_LABELS[item.department],
        departmentSlug: item.department,
        status: metrics.status,
        efficiencyPercent: metrics.efficiencyPercent,
        hoursSavedWeek: metrics.hoursSavedWeek,
        tokensToday: metrics.tokensToday,
        tokenBudgetDaily: metrics.tokenBudgetDaily,
        href: item.href,
        icon: item.icon,
        brandColor: item.brandColor,
        description: item.description,
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
