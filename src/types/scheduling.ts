/**
 * SMART SCHEDULING WIZARD V4.0 - TYPES
 * TypeScript types para todo o sistema de scheduling
 */

// ============================================================================
// DATABASE TYPES (Supabase)
// ============================================================================

export type WizardStatus = 'draft' | 'generated' | 'committed' | 'cancelled';
export type ProposalStatus = 'proposed' | 'pinned' | 'conflict' | 'skipped';
export type PlanRunStatus = 'draft' | 'committing' | 'committed' | 'rolled_back';
export type PlanItemStatus = 'created' | 'skipped' | 'conflict';

export interface ScheduleWizard {
  id: string;
  workspace_id: string;
  created_by: string;
  status: WizardStatus;
  athlete_ids: string[];
  session_defaults: SessionDefaults;
  availability_rules: AvailabilityRulesData;
  resource_rules: ResourceRulesData;
  strategy: 'greedy' | 'balanced' | 'optimized';
  coverage_percentage?: number;
  total_proposals: number;
  total_conflicts: number;
  template_id?: string;
  created_at: string;
  updated_at: string;
  committed_at?: string;
  deleted_at?: string;
  deleted_by?: string;
}

export interface ScheduleWizardTarget {
  id: string;
  wizard_id: string;
  athlete_id: string;
  overrides: Record<string, any>;
  created_at: string;
}

export interface ScheduleWizardProposal {
  id: string;
  wizard_id: string;
  athlete_id: string;
  start_at: string;
  end_at: string;
  status: ProposalStatus;
  session_type: string;
  location?: string;
  notes?: string;
  conflict_reason?: string;
  conflict_severity?: number;
  is_pinned: boolean;
  pinned_at?: string;
  pinned_by?: string;
  generated_at: string;
  event_id?: string;
  created_at: string;
}

export interface PlanRun {
  id: string;
  workspace_id: string;
  source_type: 'plan_builder' | 'wizard';
  source_id?: string;
  status: PlanRunStatus;
  execution_snapshot: Record<string, any>;
  idempotency_key?: string;
  created_by: string;
  created_at: string;
  committed_at?: string;
  rolled_back_at?: string;
  rolled_back_by?: string;
}

export interface PlanRunItem {
  id: string;
  plan_run_id: string;
  athlete_id: string;
  status: PlanItemStatus;
  event_id?: string;
  conflict_reason?: string;
  skipped_reason?: string;
  created_at: string;
}

export interface TemplateSnapshot {
  id: string;
  template_id: string;
  version: number;
  snapshot_data: Record<string, any>;
  created_at: string;
  created_by?: string;
}

// ============================================================================
// WIZARD STATE TYPES
// ============================================================================

export interface WizardState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  
  // Step 1 - Athletes
  selectedAthletes: Athlete[];
  
  // Step 2 - Session Defaults
  sessionDefaults: SessionDefaults;
  
  // Step 3 - Availability
  availability: AvailabilityRules;
  
  // Step 4 - Resources
  resources: Resources;
  
  // Step 5 - Generated
  proposals: ScheduleProposal[];
  conflicts: Conflict[];
  coverage: number;
  
  // Step 6 - Review
  commitOptions: CommitOptions;
  
  // Meta
  wizardId?: string;
  isDirty: boolean;
  isGenerating: boolean;
  error?: string;
}

export interface Athlete {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  priority?: number; // 1-10
  segment?: string;
  plan_type?: string;
  risk_level?: string;
}

export interface SessionDefaults {
  type: 'session' | 'class' | 'assessment';
  duration: number; // minutos
  buffer: number; // minutos
  dateRange: {
    start: Date;
    end: Date;
  };
  sessionsPerWeek?: number;
  maxPerDay?: number;
  priority?: 'premium' | 'risk' | 'fifo';
}

export interface AvailabilityRule {
  id: string;
  type: 'can' | 'cannot';
  days: number[]; // 0-6 (domingo-sábado)
  timeRanges: TimeRange[];
  scope: 'global' | 'athlete';
  athleteId?: string;
}

export interface TimeRange {
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface AvailabilityRules {
  global: AvailabilityRule[];
  perAthlete: Map<string, AvailabilityRule[]>;
}

export interface AvailabilityRulesData {
  global: AvailabilityRule[];
  perAthlete: Record<string, AvailabilityRule[]>;
}

export interface ResourceConstraint {
  type: 'coach' | 'location' | 'equipment' | 'custom';
  value: string;
  required: boolean;
}

export interface RuleConstraint {
  type: 'no_consecutive_days' | 'avoid_competition_days' | 'respect_quiet_hours';
  enabled: boolean;
  config?: any;
}

export interface Resources {
  coach?: string;
  location?: string;
  equipment?: string[];
  constraints: RuleConstraint[];
}

export interface ResourceRulesData {
  coachId?: string;
  location?: string;
  equipment?: string[];
  constraints: RuleConstraint[];
}

export interface ScheduleProposal {
  id: string;
  athleteId: string;
  athleteName: string;
  startAt: Date;
  endAt: Date;
  sessionType: string;
  location?: string;
  notes?: string;
  status: ProposalStatus;
  isPinned: boolean;
  pinnedAt?: Date;
  pinnedBy?: string;
  conflict?: Conflict;
  score: number; // 0-100
}

export interface Conflict {
  id: string;
  type: 'time_overlap' | 'resource_unavailable' | 'availability_violation' | 'constraint_violation';
  severity: number; // 1-10
  description: string;
  athleteIds: string[];
  proposalIds: string[];
}

export interface CommitOptions {
  notifyAthletes: boolean;
  createAsPending: boolean;
  attachTemplate: boolean;
  templateId?: string;
}

// ============================================================================
// ENGINE TYPES
// ============================================================================

export interface ExistingEvent {
  id: string;
  athleteId: string;
  startAt: Date;
  endAt: Date;
  type: string;
}

export interface ScheduleResult {
  proposals: ScheduleProposal[];
  conflicts: Conflict[];
  coverage: number;
  stats: {
    totalAthletes: number;
    scheduledAthletes: number;
    totalSessions: number;
    skippedAthletes: number;
    averageScore: number;
  };
}

export interface SchedulingInput {
  athletes: Athlete[];
  defaults: SessionDefaults;
  availability: AvailabilityRules;
  resources: Resources;
  existingEvents?: ExistingEvent[];
  pinnedProposals?: ScheduleProposal[];
  strategy?: 'greedy' | 'balanced' | 'optimized';
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface SmartSchedulingWizardProps {
  onClose: () => void;
  onComplete: (result: CommitResult) => void;
  context: WizardContext;
}

export interface WizardContext {
  athleteIds?: string[];
  source: 'athletes-bulk' | 'calendar' | 'draft';
  draftId?: string;
  dateRange?: { start: Date; end: Date };
}

export interface CommitResult {
  success: boolean;
  planRunId: string;
  createdCount: number;
  skippedCount: number;
  error?: string;
}

export interface WizardStepProps {
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

// ============================================================================
// HELPERS
// ============================================================================

export const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WEEK_DAYS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const SESSION_TYPES = [
  { value: 'session', label: 'Sessão PT', icon: 'Dumbbell' },
  { value: 'class', label: 'Aula/Grupo', icon: 'Users' },
  { value: 'assessment', label: 'Avaliação', icon: 'Target' }
] as const;

export const PRIORITY_OPTIONS = [
  { value: 'premium', label: 'Premium Primeiro', description: 'Atletas premium têm prioridade' },
  { value: 'risk', label: 'Risco Alto Primeiro', description: 'Atletas de risco têm prioridade' },
  { value: 'fifo', label: 'Ordem Normal', description: 'Sem priorização especial' }
] as const;

export const STRATEGY_OPTIONS = [
  { value: 'greedy', label: 'Rápido', description: 'Mais rápido, menos otimizado' },
  { value: 'balanced', label: 'Balanceado', description: 'Equilíbrio velocidade/qualidade' },
  { value: 'optimized', label: 'Otimizado', description: 'Melhor distribuição, mais lento' }
] as const;

export const CONFLICT_SEVERITY_LABELS = {
  1: 'Muito Baixa',
  2: 'Baixa',
  3: 'Baixa-Média',
  4: 'Média-Baixa',
  5: 'Média',
  6: 'Média-Alta',
  7: 'Alta-Média',
  8: 'Alta',
  9: 'Muito Alta',
  10: 'Crítica'
} as const;

export const CONFLICT_TYPE_LABELS = {
  time_overlap: 'Sobreposição de Horário',
  resource_unavailable: 'Recurso Indisponível',
  availability_violation: 'Violação de Disponibilidade',
  constraint_violation: 'Violação de Regra'
} as const;
