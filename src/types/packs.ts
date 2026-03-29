// ============================================================
// METRIC PACKS TYPES
// ============================================================

export interface ActivePack {
  packId: string;
  packName: string;
  packIcon: string;
  packColor: 'emerald' | 'sky' | 'amber' | 'violet' | 'red';
  category: string;
  activatedAt: string; // ISO date string
  metricsCount: number;
  metricIds: string[];
  hasData: boolean; // se alguma métrica tem valores registrados
  formId?: string; // se um form foi criado com o pack
  reportId?: string; // se um report foi criado com o pack
  decisionsCount?: number; // número de decisões configuradas
}

export interface PackActivationData {
  packId: string;
  packName: string;
  packIcon: string;
  packColor: 'emerald' | 'sky' | 'amber' | 'violet' | 'red';
  category: string;
  metricsCreated: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  formCreated?: {
    id: string;
    name: string;
    fieldsCount: number;
  };
  reportCreated?: {
    id: string;
    name: string;
    sectionsCount: number;
  };
  decisionsCreated?: Array<{
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface DeactivatePackOptions {
  keepMetrics: boolean; // manter métricas como independentes
  deleteData: boolean; // deletar valores já registrados
}

export interface PackMetricsUsage {
  inForms: number; // número de forms que usam estas métricas
  inReports: number; // número de reports que usam estas métricas
  inDecisions: number; // número de decisões que usam estas métricas
  totalDataPoints: number; // total de valores registrados
}
