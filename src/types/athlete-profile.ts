/**
 * ATHLETE PROFILE V7.0 - TYPES
 * Coach Analytics Core - TypeScript Definitions
 */

// ============================================================================
// DATABASE ENUMS
// ============================================================================

export type AthleteStatus = 'active' | 'rehab' | 'paused' | 'churned';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export type RecordStatus = 'active' | 'historical' | 'invalidated';
export type RecordSource = 'session' | 'assessment' | 'manual' | 'form' | 'test';

export type WidgetType =
  | 'kpi_card'
  | 'line_chart'
  | 'bar_chart'
  | 'load_readiness'
  | 'volume_breakdown'
  | 'recent_sessions'
  | 'recovery_status'
  | 'injury_alert'
  | 'report_widget'
  | 'adherence_gauge'
  | 'wellness_trend';

export type MediaType = 'photo' | 'video' | 'document' | 'exam' | 'consent';
export type AuditAction = 'created' | 'updated' | 'deleted' | 'viewed' | 'exported';

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Athlete {
  id: string;
  workspace_id: string;
  
  // Identity
  name: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  birth_date?: string;
  
  // Physical Data
  height_cm?: number;
  weight_kg?: number;
  body_fat_percentage?: number;
  lean_mass_kg?: number;
  wingspan_cm?: number;
  last_physical_update?: string;
  physical_data_source?: string;
  
  // Sport Context
  sport?: string;
  position?: string;
  level?: string;
  team?: string;
  
  // Status
  status: AthleteStatus;
  risk_level: RiskLevel;
  availability: AvailabilityStatus;
  
  // Metadata
  segment?: string;
  plan_type?: string;
  notes?: string;
  
  // Audit
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface PersonalRecord {
  id: string;
  workspace_id: string;
  athlete_id: string;
  
  // Identity
  metric_name: string;
  display_name: string;
  category?: string;
  
  // Value
  value: number;
  unit: string;
  
  // Context
  achieved_at: string;
  source: RecordSource;
  source_id?: string;
  
  // Status
  status: RecordStatus;
  
  // Versioning
  previous_record_id?: string;
  previous_value?: number;
  improvement_percentage?: number;
  
  // Validation
  validated_by?: string;
  validated_at?: string;
  validation_notes?: string;
  
  // Metadata
  conditions?: RecordConditions;
  
  // Audit
  created_by: string;
  created_at: string;
  updated_at: string;
  invalidated_at?: string;
  invalidated_by?: string;
  invalidation_reason?: string;
}

export interface RecordConditions {
  bodyweight?: number;
  fatigue_level?: 'low' | 'medium' | 'high';
  equipment?: string;
  weather?: string;
  location?: string;
  [key: string]: any;
}

export interface RecordSuggestion {
  id: string;
  workspace_id: string;
  athlete_id: string;
  
  // Suggestion
  metric_name: string;
  new_value: number;
  unit: string;
  current_pb_value?: number;
  improvement_percentage?: number;
  
  // Source
  source_type: RecordSource;
  source_id: string;
  detected_at: string;
  
  // Status
  status: 'pending' | 'accepted' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  
  // Created Record
  created_record_id?: string;
  
  created_at: string;
}

// ============================================================================
// DASHBOARD CONFIGURATION
// ============================================================================

export interface AthleteDashboardConfig {
  id: string;
  workspace_id: string;
  coach_id: string;
  athlete_id: string;
  
  // Layout
  widgets: DashboardWidget[];
  
  // Visibility
  visible_physical_metrics: PhysicalMetric[];
  pinned_records: string[]; // metric_names
  pinned_reports: string[]; // report_ids
  
  // Conditional Rules
  conditional_widgets?: ConditionalWidget[];
  
  // Audit
  created_at: string;
  updated_at: string;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  
  // Position & Size
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  
  // Configuration
  config: WidgetConfig;
}

export interface WidgetConfig {
  // Common
  title?: string;
  subtitle?: string;
  color?: string;
  
  // Data
  metric?: string;
  dataSource?: string;
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
  timeRange?: 'last_7d' | 'last_28d' | 'last_90d' | 'custom';
  
  // Specific (varies by widget type)
  threshold?: number;
  comparison?: boolean;
  chartType?: 'line' | 'bar' | 'area';
  reportId?: string;
  
  [key: string]: any;
}

export interface ConditionalWidget {
  widgetId: string;
  condition: string; // "risk_level >= medium"
  showWhen: boolean;
}

export type PhysicalMetric = 
  | 'age'
  | 'height'
  | 'weight'
  | 'body_fat'
  | 'lean_mass'
  | 'wingspan';

// ============================================================================
// MEDIA & UPLOADS
// ============================================================================

export interface AthleteMedia {
  id: string;
  workspace_id: string;
  athlete_id: string;
  
  // File Info
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  
  // Classification
  media_type: MediaType;
  category?: string;
  
  // Metadata
  title?: string;
  description?: string;
  tags?: string[];
  thumbnail_url?: string;
  
  // Permissions
  is_sensitive: boolean;
  visible_to_athlete: boolean;
  
  // Relations
  related_session_id?: string;
  related_assessment_id?: string;
  related_injury_id?: string;
  
  // Audit
  uploaded_by: string;
  created_at: string;
  deleted_at?: string;
  deleted_by?: string;
}

// ============================================================================
// AUDIT TRAIL
// ============================================================================

export interface AthleteAuditLog {
  id: string;
  workspace_id: string;
  athlete_id: string;
  
  // Action
  action: AuditAction;
  entity_type: string;
  entity_id?: string;
  
  // Actor
  actor_id: string;
  actor_role?: string;
  
  // Changes
  before_data?: any;
  after_data?: any;
  
  // Context
  description?: string;
  metadata?: any;
  
  // Timestamp
  created_at: string;
}

// ============================================================================
// ANALYTICS & COMPUTED DATA
// ============================================================================

export interface AthleteAnalyticsSummary {
  sessions: {
    total: number;
    completed: number;
    cancelled: number;
    adherence: number;
  };
  records: {
    total: number;
    recent: number;
  };
  load: {
    avg_7d: number;
    avg_28d: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  readiness?: {
    score: number;
    trend: string;
  };
  recovery?: {
    status: 'good' | 'caution' | 'poor';
    days_since_last_session: number;
  };
}

export interface AthletePhysicalData {
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  body_fat_percentage?: number;
  lean_mass_kg?: number;
  wingspan_cm?: number;
  last_updated?: string;
  source?: string;
}

export interface RecordHistory {
  metric_name: string;
  display_name: string;
  unit: string;
  history: {
    value: number;
    achieved_at: string;
    source: RecordSource;
    was_active: boolean;
  }[];
  trend: 'improving' | 'stable' | 'declining';
}

// ============================================================================
// UI STATE
// ============================================================================

export interface AthleteProfileState {
  athlete: Athlete | null;
  physicalData: AthletePhysicalData;
  records: PersonalRecord[];
  recordSuggestions: RecordSuggestion[];
  dashboardConfig: AthleteDashboardConfig | null;
  analytics: AthleteAnalyticsSummary | null;
  media: AthleteMedia[];
  auditLog: AthleteAuditLog[];
  
  // UI State
  activeTab: AthleteTab;
  activeDrawer: DrawerType | null;
  selectedRecord?: PersonalRecord;
  selectedMedia?: AthleteMedia;
  
  // Loading
  isLoading: boolean;
  isLoadingAnalytics: boolean;
  isLoadingRecords: boolean;
  
  // Errors
  error?: string;
}

export type AthleteTab =
  | 'cockpit'
  | 'agenda'
  | 'sessions'
  | 'trainings'
  | 'data'
  | 'assessments'
  | 'recovery'
  | 'reports'
  | 'docs'
  | 'audit';

export type DrawerType =
  | 'session'
  | 'report'
  | 'metric_history'
  | 'injury_case'
  | 'upload_preview'
  | 'record_suggestion'
  | 'edit_physical'
  | 'edit_record';

// ============================================================================
// ACTIONS & EVENTS
// ============================================================================

export interface CreateRecordPayload {
  athlete_id: string;
  metric_name: string;
  display_name: string;
  value: number;
  unit: string;
  achieved_at: string;
  source: RecordSource;
  source_id?: string;
  conditions?: RecordConditions;
  validation_notes?: string;
}

export interface UpdatePhysicalDataPayload {
  athlete_id: string;
  height_cm?: number;
  weight_kg?: number;
  body_fat_percentage?: number;
  lean_mass_kg?: number;
  wingspan_cm?: number;
  source: string;
}

export interface UpdateDashboardConfigPayload {
  athlete_id: string;
  widgets?: DashboardWidget[];
  visible_physical_metrics?: PhysicalMetric[];
  pinned_records?: string[];
  pinned_reports?: string[];
}

export interface UploadMediaPayload {
  athlete_id: string;
  file: File;
  media_type: MediaType;
  category?: string;
  title?: string;
  description?: string;
  tags?: string[];
  is_sensitive?: boolean;
  visible_to_athlete?: boolean;
}

// ============================================================================
// RPC RESPONSES
// ============================================================================

export interface SuggestRecordResponse {
  success: boolean;
  isNewPB: boolean;
  suggestionId?: string;
  improvement?: number;
  error?: string;
}

export interface AcceptSuggestionResponse {
  success: boolean;
  recordId?: string;
  error?: string;
}

// ============================================================================
// WIDGET DATA TYPES
// ============================================================================

export interface KPICardData {
  value: number | string;
  unit?: string;
  label: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  color?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface LoadReadinessData {
  load: number;
  readiness: number;
  date: string;
  status: 'optimal' | 'caution' | 'high_risk';
}

export interface SessionSummary {
  id: string;
  date: string;
  type: string;
  duration: number;
  status: 'completed' | 'cancelled' | 'scheduled';
  load?: number;
  rpe?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ATHLETE_STATUS_LABELS: Record<AthleteStatus, string> = {
  active: 'Ativo',
  rehab: 'Reabilitação',
  paused: 'Pausado',
  churned: 'Inativo'
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
  critical: 'Crítico'
};

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  available: 'Disponível',
  limited: 'Limitado',
  unavailable: 'Indisponível'
};

export const RECORD_CATEGORY_LABELS: Record<string, string> = {
  strength: 'Força',
  speed: 'Velocidade',
  endurance: 'Resistência',
  power: 'Potência',
  skill: 'Técnica',
  mobility: 'Mobilidade'
};

export const PHYSICAL_METRIC_LABELS: Record<PhysicalMetric, string> = {
  age: 'Idade',
  height: 'Altura',
  weight: 'Peso',
  body_fat: '% Gordura',
  lean_mass: 'Massa Magra',
  wingspan: 'Envergadura'
};

export const WIDGET_TYPE_LABELS: Record<WidgetType, string> = {
  kpi_card: 'KPI Card',
  line_chart: 'Gráfico de Linha',
  bar_chart: 'Gráfico de Barras',
  load_readiness: 'Carga vs Prontidão',
  volume_breakdown: 'Volume por Tipo',
  recent_sessions: 'Sessões Recentes',
  recovery_status: 'Estado Recuperação',
  injury_alert: 'Alerta Lesões',
  report_widget: 'Widget de Relatório',
  adherence_gauge: 'Medidor Aderência',
  wellness_trend: 'Tendência Wellness'
};
