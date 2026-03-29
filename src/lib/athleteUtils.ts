/**
 * ATHLETE UTILITIES
 * Funções para cálculo de status, tendências e análises
 */

export type MetricStatus = 'green' | 'yellow' | 'red';
export type OverallStatus = 'excellent' | 'attention' | 'critical';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface AthleteMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: MetricStatus;
  change: number;
  changeLabel: string;
  baseline?: number;
  category: 'strength' | 'wellness' | 'performance' | 'readiness' | 'load';
  lastUpdated: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'attention' | 'info';
  message: string;
  metricId?: string;
  timestamp: string;
  isResolved: boolean;
}

export interface AISuggestion {
  id: string;
  type: 'health' | 'performance' | 'optimization' | 'prevention';
  message: string;
  confidence: number;
  actions?: string[];
}

// ============================================================================
// STATUS CALCULATION
// ============================================================================

/**
 * Calculate overall status based on metrics
 * 🟢 VERDE: Todas métricas verdes ou ≤1 amarela
 * 🟡 AMARELO: ≥2 amarelas ou 1 vermelha
 * 🔴 VERMELHO: ≥2 vermelhas ou 1 crítica
 */
export function calculateOverallStatus(metrics: AthleteMetric[]): OverallStatus {
  const statusCount = metrics.reduce(
    (acc, m) => {
      acc[m.status]++;
      return acc;
    },
    { green: 0, yellow: 0, red: 0 }
  );

  // Critical: ≥2 red metrics
  if (statusCount.red >= 2) return 'critical';

  // Attention: ≥2 yellow OR 1 red
  if (statusCount.yellow >= 2 || statusCount.red >= 1) return 'attention';

  // Excellent: All green OR ≤1 yellow
  return 'excellent';
}

/**
 * Get status emoji and label
 */
export function getStatusDisplay(status: OverallStatus): { emoji: string; label: string; color: string } {
  const statusMap = {
    excellent: { emoji: '🟢', label: 'EXCELENTE', color: 'emerald' },
    attention: { emoji: '🟡', label: 'ATENÇÃO', color: 'amber' },
    critical: { emoji: '🔴', label: 'CRÍTICO', color: 'red' },
  };

  return statusMap[status];
}

// ============================================================================
// METRICS FILTERING
// ============================================================================

/**
 * Get critical metrics (yellow or red status)
 */
export function getCriticalMetrics(metrics: AthleteMetric[]): AthleteMetric[] {
  return metrics.filter((m) => m.status === 'yellow' || m.status === 'red');
}

/**
 * Get metrics by category
 */
export function getMetricsByCategory(
  metrics: AthleteMetric[],
  category: string
): AthleteMetric[] {
  return metrics.filter((m) => m.category === category);
}

/**
 * Get category status (worst metric in category)
 */
export function getCategoryStatus(
  metrics: AthleteMetric[],
  category: string
): MetricStatus {
  const categoryMetrics = getMetricsByCategory(metrics, category);
  
  if (categoryMetrics.length === 0) return 'green';
  
  // Return worst status
  if (categoryMetrics.some((m) => m.status === 'red')) return 'red';
  if (categoryMetrics.some((m) => m.status === 'yellow')) return 'yellow';
  return 'green';
}

// ============================================================================
// TREND CALCULATION
// ============================================================================

/**
 * Calculate trend direction based on recent changes
 */
export function calculateTrend(metrics: AthleteMetric[]): {
  direction: TrendDirection;
  label: string;
  percentage: number;
} {
  // Calculate average change across metrics
  const totalChange = metrics.reduce((sum, m) => sum + m.change, 0);
  const avgChange = totalChange / metrics.length;

  let direction: TrendDirection = 'stable';
  let label = 'Estável';

  if (avgChange > 5) {
    direction = 'up';
    label = 'Forte melhoria';
  } else if (avgChange > 0) {
    direction = 'up';
    label = 'Leve melhoria';
  } else if (avgChange < -5) {
    direction = 'down';
    label = 'Forte descida';
  } else if (avgChange < 0) {
    direction = 'down';
    label = 'Leve descida';
  }

  return {
    direction,
    label,
    percentage: Math.abs(avgChange),
  };
}

/**
 * Get trend icon
 */
export function getTrendIcon(direction: TrendDirection): string {
  const iconMap = {
    up: '↗',
    down: '↘',
    stable: '→',
  };
  return iconMap[direction];
}

// ============================================================================
// ALERTS
// ============================================================================

/**
 * Get active (unresolved) alerts
 */
export function getActiveAlerts(alerts: Alert[]): Alert[] {
  return alerts.filter((a) => !a.isResolved);
}

/**
 * Get alerts by type
 */
export function getAlertsByType(alerts: Alert[], type: Alert['type']): Alert[] {
  return alerts.filter((a) => a.type === type);
}

/**
 * Get alert icon and color
 */
export function getAlertDisplay(type: Alert['type']): { icon: string; color: string } {
  const alertMap = {
    critical: { icon: '🔴', color: 'red' },
    attention: { icon: '🟡', color: 'amber' },
    info: { icon: '🔵', color: 'sky' },
  };

  return alertMap[type];
}

// ============================================================================
// PROGRESS CALCULATION
// ============================================================================

/**
 * Calculate progress over period
 */
export function calculateProgress(
  currentValue: number,
  previousValue: number
): {
  change: number;
  percentage: number;
  label: string;
} {
  const change = currentValue - previousValue;
  const percentage = previousValue !== 0 ? (change / previousValue) * 100 : 0;

  let label = '';
  if (change > 0) {
    label = `+${change.toFixed(1)}`;
  } else if (change < 0) {
    label = `${change.toFixed(1)}`;
  } else {
    label = '=';
  }

  return {
    change,
    percentage,
    label,
  };
}

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * Format metric value with unit
 */
export function formatMetricValue(value: number, unit: string): string {
  return `${value}${unit}`;
}

/**
 * Format date relative to now
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `Há ${diffMinutes}min`;
    }
    return `Hoje, ${date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays}d`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)}sem`;
  
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
}

// ============================================================================
// CATEGORY HELPERS
// ============================================================================

/**
 * Get category emoji
 */
export function getCategoryEmoji(category: string): string {
  const categoryMap: Record<string, string> = {
    strength: '💪',
    wellness: '😴',
    performance: '🏃',
    readiness: '⚡',
    load: '📈',
    psychological: '🧠',
  };

  return categoryMap[category] || '📊';
}

/**
 * Get category label
 */
export function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    strength: 'FORÇA',
    wellness: 'WELLNESS',
    performance: 'PERFORMANCE',
    readiness: 'PRONTIDÃO',
    load: 'CARGA',
    psychological: 'PSICOLÓGICO',
  };

  return categoryMap[category] || category.toUpperCase();
}
