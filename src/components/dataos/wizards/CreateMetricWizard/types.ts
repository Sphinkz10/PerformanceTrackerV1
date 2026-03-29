/**
 * CREATE METRIC WIZARD - TYPES
 * 
 * Type definitions para o wizard de criação de métricas (5 steps)
 * Baseado em Guidelines.md e /types/metrics.ts
 * 
 * @since Day 4 - Wizard Step 1
 */

import type { MetricType, MetricCategory } from '@/types/metrics';

// ============================================
// WIZARD STATE
// ============================================

/**
 * State completo do wizard (5 steps)
 * Cada step preenche uma parte deste state
 */
export interface MetricWizardState {
  // ==========================================
  // STEP 1: Basic Info
  // ==========================================
  name: string;
  shortName: string;
  description: string;
  icon: string;

  // ==========================================
  // STEP 2: Type & Validation (FUTURO - Day 5)
  // ==========================================
  metricType: MetricType | null;
  unit: string;
  decimals: number;
  scaleMin: number | null;
  scaleMax: number | null;

  // ==========================================
  // STEP 3: Zones & Baseline (FUTURO - Day 6)
  // ==========================================
  baselineMethod: 'rolling-average' | 'manual' | 'percentile';
  baselinePeriodDays: number;
  baselineManualValue: number | null;
  zoneLogic: 'higher-better' | 'lower-better' | 'target-range';
  zones: MetricZone[];

  // ==========================================
  // STEP 4: Categorization (FUTURO - Day 7)
  // ==========================================
  category: MetricCategory | null;
  subcategory: string;
  tags: string[];
  color: string;

  // ==========================================
  // META
  // ==========================================
  currentStep: 1 | 2 | 3 | 4 | 5;
  isSubmitting: boolean;
}

/**
 * Zona de baseline/performance
 */
export interface MetricZone {
  id: string;
  name: string;
  color: string;
  min: number;
  max: number;
  description?: string;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Erros de validação por campo
 */
export interface ValidationErrors {
  // Step 1
  name?: string;
  shortName?: string;
  description?: string;
  icon?: string;

  // Step 2
  metricType?: string;
  unit?: string;
  scaleMin?: string;
  scaleMax?: string;

  // Step 3
  baselineMethod?: string;
  baselinePeriodDays?: string;
  zones?: string;

  // Step 4
  category?: string;
  tags?: string;
  color?: string;

  // Global
  _general?: string;
}

// ============================================
// STEP PROPS
// ============================================

/**
 * Props base para todos os steps
 */
export interface WizardStepProps<T = Partial<MetricWizardState>> {
  data: T;
  onChange: (field: keyof MetricWizardState, value: any) => void;
  errors: ValidationErrors;
  onValidate?: () => boolean;
}

/**
 * Props específicas do Step 1
 */
export interface Step1Props extends WizardStepProps {
  data: Pick<MetricWizardState, 'name' | 'shortName' | 'description' | 'icon'>;
  existingMetricNames?: string[];
}

// ============================================
// WIZARD MAIN PROPS
// ============================================

export interface MetricWizardMainProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (metric: any) => void;
  initialData?: Partial<MetricWizardState>;
  workspaceId?: string;
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Icon option para o picker
 */
export interface IconOption {
  id: string;
  emoji: string;
  label: string;
  category: 'performance' | 'wellness' | 'psychological' | 'general';
}

/**
 * Step info para progress indicator
 */
export interface WizardStep {
  number: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  isComplete: boolean;
  isCurrent: boolean;
}

// ============================================
// CONSTANTS
// ============================================

/**
 * Default state inicial
 */
export const DEFAULT_WIZARD_STATE: MetricWizardState = {
  // Step 1
  name: '',
  shortName: '',
  description: '',
  icon: '⚡',

  // Step 2
  metricType: null,
  unit: '',
  decimals: 1,
  scaleMin: null,
  scaleMax: null,

  // Step 3
  baselineMethod: 'rolling-average',
  baselinePeriodDays: 28,
  baselineManualValue: null,
  zoneLogic: 'higher-better',
  zones: [],

  // Step 4
  category: null,
  subcategory: '',
  tags: [],
  color: '#0ea5e9', // sky-500

  // Meta
  currentStep: 1,
  isSubmitting: false,
};

/**
 * Ícones disponíveis (emoji + label)
 */
export const AVAILABLE_ICONS: IconOption[] = [
  // Performance
  { id: 'lightning', emoji: '⚡', label: 'Velocidade', category: 'performance' },
  { id: 'fire', emoji: '🔥', label: 'Intensidade', category: 'performance' },
  { id: 'muscle', emoji: '💪', label: 'Força', category: 'performance' },
  { id: 'runner', emoji: '🏃', label: 'Corrida', category: 'performance' },
  { id: 'bicycle', emoji: '🚴', label: 'Ciclismo', category: 'performance' },
  { id: 'swimmer', emoji: '🏊', label: 'Natação', category: 'performance' },
  { id: 'trophy', emoji: '🏆', label: 'Performance', category: 'performance' },
  { id: 'target', emoji: '🎯', label: 'Objetivo', category: 'performance' },
  { id: 'rocket', emoji: '🚀', label: 'Explosivo', category: 'performance' },
  { id: 'chart', emoji: '📈', label: 'Progresso', category: 'performance' },

  // Wellness
  { id: 'heart', emoji: '❤️', label: 'Cardio', category: 'wellness' },
  { id: 'lungs', emoji: '🫁', label: 'Respiração', category: 'wellness' },
  { id: 'sleep', emoji: '😴', label: 'Sono', category: 'wellness' },
  { id: 'water', emoji: '💧', label: 'Hidratação', category: 'wellness' },
  { id: 'apple', emoji: '🍎', label: 'Nutrição', category: 'wellness' },
  { id: 'bandage', emoji: '🩹', label: 'Recuperação', category: 'wellness' },
  { id: 'thermometer', emoji: '🌡️', label: 'Temperatura', category: 'wellness' },
  { id: 'battery', emoji: '🔋', label: 'Energia', category: 'wellness' },

  // Psychological
  { id: 'brain', emoji: '🧠', label: 'Mental', category: 'psychological' },
  { id: 'smile', emoji: '😊', label: 'Humor', category: 'psychological' },
  { id: 'star', emoji: '⭐', label: 'Motivação', category: 'psychological' },
  { id: 'zen', emoji: '🧘', label: 'Relaxamento', category: 'psychological' },
  { id: 'focus', emoji: '🎯', label: 'Concentração', category: 'psychological' },

  // General
  { id: 'check', emoji: '✅', label: 'Completo', category: 'general' },
  { id: 'clock', emoji: '⏱️', label: 'Tempo', category: 'general' },
  { id: 'weight', emoji: '⚖️', label: 'Peso/Carga', category: 'general' },
  { id: 'ruler', emoji: '📏', label: 'Distância', category: 'general' },
  { id: 'percent', emoji: '💯', label: 'Percentual', category: 'general' },
  { id: 'plus', emoji: '➕', label: 'Adicionar', category: 'general' },
];

// ============================================
// EXPORTS
// ============================================

export type {
  MetricWizardState as WizardState,
  ValidationErrors as Errors,
  WizardStepProps as StepProps,
  MetricWizardMainProps as WizardProps,
};
