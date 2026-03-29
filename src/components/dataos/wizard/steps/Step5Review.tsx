/**
 * STEP 5: REVIEW - FASE 4 DIA 14
 * Summary completo antes de criar
 * 
 * FEATURES:
 * - Preview visual completo
 * - Editable sections (click para voltar step)
 * - Summary organizado por categorias
 * - Visual feedback de campos preenchidos
 * - Ready to create indicator
 */

'use client';

import { motion } from 'motion/react';
import { 
  FileText, 
  Target, 
  Ruler, 
  TrendingUp, 
  Tag, 
  Calendar,
  Edit2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { MetricType, MetricCategory } from '@/types/metrics';

interface Step5ReviewProps {
  data: {
    name: string;
    description: string;
    type: MetricType | '';
    unit: string;
    scaleMin?: number;
    scaleMax?: number;
    zones: Array<{
      id: string;
      name: string;
      color: string;
      min: number;
      max: number;
    }>;
    baselineMethod: 'rolling-average' | 'manual' | 'percentile';
    baselinePeriodDays: number;
    baselineManualValue?: number;
    category: MetricCategory | '';
    tags: string[];
    updateFrequency: 'daily' | 'per-session' | 'weekly' | 'on-demand';
  };
  onEditStep?: (step: number) => void;
  isMobile: boolean;
}

const typeLabels: Record<string, string> = {
  scale: 'Escala Numérica',
  boolean: 'Sim/Não',
  duration: 'Duração',
  distance: 'Distância',
  count: 'Contagem',
  text: 'Texto Livre',
};

const categoryLabels: Record<string, { label: string; icon: string }> = {
  strength: { label: 'Força', icon: '💪' },
  conditioning: { label: 'Condicionamento', icon: '🏃' },
  wellbeing: { label: 'Bem-Estar', icon: '🧘' },
  'body-composition': { label: 'Composição', icon: '📏' },
  skill: { label: 'Técnica', icon: '🎯' },
  custom: { label: 'Personalizada', icon: '⭐' },
};

const frequencyLabels: Record<string, string> = {
  daily: 'Diariamente',
  'per-session': 'Por Sessão',
  weekly: 'Semanalmente',
  'on-demand': 'Sob Demanda',
};

const baselineLabels: Record<string, string> = {
  'rolling-average': 'Média Móvel',
  manual: 'Valor Manual',
  percentile: 'Percentil (P50)',
};

export function Step5Review({ data, onEditStep, isMobile }: Step5ReviewProps) {
  const isComplete = !!(data.name && data.type && data.category);

  const getZoneColorClass = (colorValue: string) => {
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-500',
      sky: 'bg-sky-500',
      amber: 'bg-amber-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      violet: 'bg-violet-500',
      pink: 'bg-pink-500',
      slate: 'bg-slate-500',
    };
    return colorMap[colorValue] || 'bg-slate-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Revisão Final</h2>
        <p className="text-sm text-slate-600">
          Confirma todos os detalhes antes de criar a métrica
        </p>
      </div>

      {/* Completion Status */}
      <div className={`p-4 rounded-xl border-2 ${
        isComplete 
          ? 'bg-emerald-50 border-emerald-500' 
          : 'bg-amber-50 border-amber-500'
      }`}>
        <div className="flex items-center gap-3">
          {isComplete ? (
            <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
          )}
          <div>
            <p className={`font-semibold text-sm ${
              isComplete ? 'text-emerald-900' : 'text-amber-900'
            }`}>
              {isComplete 
                ? '✅ Métrica pronta para criar!' 
                : '⚠️ Alguns campos obrigatórios em falta'}
            </p>
            {!isComplete && (
              <p className="text-xs text-amber-700 mt-1">
                Verifica os campos marcados com ❌
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 1: Basic Info */}
      <ReviewSection
        title="Informação Básica"
        icon={<FileText className="h-4 w-4" />}
        onEdit={() => onEditStep?.(1)}
        isMobile={isMobile}
      >
        <ReviewField
          label="Nome"
          value={data.name}
          required
          icon="📝"
        />
        <ReviewField
          label="Descrição"
          value={data.description || 'Não definida'}
          icon="💬"
        />
        <ReviewField
          label="Tipo"
          value={data.type ? typeLabels[data.type] : ''}
          required
          icon={
            data.type === 'scale' ? '📊' :
            data.type === 'boolean' ? '✅' :
            data.type === 'duration' ? '⏱️' :
            data.type === 'distance' ? '📏' :
            data.type === 'count' ? '🔢' :
            data.type === 'text' ? '📝' : '❓'
          }
        />
      </ReviewSection>

      {/* Section 2: Validation */}
      <ReviewSection
        title="Validação & Unidades"
        icon={<Ruler className="h-4 w-4" />}
        onEdit={() => onEditStep?.(2)}
        isMobile={isMobile}
      >
        {data.unit && (
          <ReviewField
            label="Unidade"
            value={data.unit}
            icon="📏"
          />
        )}
        {data.type === 'scale' && data.scaleMin !== undefined && data.scaleMax !== undefined && (
          <ReviewField
            label="Intervalo"
            value={`${data.scaleMin} - ${data.scaleMax} ${data.unit || ''}`}
            icon="📊"
          />
        )}
        {!data.unit && data.type !== 'boolean' && data.type !== 'count' && data.type !== 'text' && (
          <div className="text-sm text-slate-500 italic">
            Nenhuma validação configurada
          </div>
        )}
      </ReviewSection>

      {/* Section 3: Zones & Baseline */}
      <ReviewSection
        title="Zonas & Baseline"
        icon={<TrendingUp className="h-4 w-4" />}
        onEdit={() => onEditStep?.(3)}
        isMobile={isMobile}
      >
        {/* Zones */}
        {data.zones.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Zonas ({data.zones.length})
            </p>
            <div className="space-y-2">
              {data.zones.map((zone) => (
                <div 
                  key={zone.id}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                >
                  <div className={`w-4 h-4 rounded ${getZoneColorClass(zone.color)}`} />
                  <span className="text-sm font-semibold flex-1">{zone.name}</span>
                  <span className="text-xs text-slate-600">
                    {zone.min} - {zone.max}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Sem zonas definidas</p>
        )}

        {/* Baseline */}
        <div className="mt-3 pt-3 border-t border-slate-200">
          <ReviewField
            label="Baseline"
            value={baselineLabels[data.baselineMethod]}
            icon="📈"
          />
          {data.baselineMethod === 'rolling-average' && (
            <p className="text-xs text-slate-600 mt-1 ml-6">
              Últimos {data.baselinePeriodDays} dias
            </p>
          )}
          {data.baselineMethod === 'manual' && data.baselineManualValue !== undefined && (
            <p className="text-xs text-slate-600 mt-1 ml-6">
              Valor: {data.baselineManualValue} {data.unit || ''}
            </p>
          )}
        </div>
      </ReviewSection>

      {/* Section 4: Categorization */}
      <ReviewSection
        title="Categorização"
        icon={<Tag className="h-4 w-4" />}
        onEdit={() => onEditStep?.(4)}
        isMobile={isMobile}
      >
        <ReviewField
          label="Categoria"
          value={data.category ? categoryLabels[data.category].label : ''}
          required
          icon={data.category ? categoryLabels[data.category].icon : '❓'}
        />
        
        {data.tags.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Tags ({data.tags.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Sem tags</p>
        )}

        <ReviewField
          label="Frequência"
          value={frequencyLabels[data.updateFrequency]}
          icon={
            data.updateFrequency === 'daily' ? '📅' :
            data.updateFrequency === 'per-session' ? '🏋️' :
            data.updateFrequency === 'weekly' ? '📊' : '⚡'
          }
        />
      </ReviewSection>

      {/* Final Summary Card */}
      <div className="p-6 bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200 rounded-xl">
        <div className="text-center">
          <div className="text-5xl mb-3">🎯</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {data.name || 'Nome não definido'}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {data.type ? typeLabels[data.type] : 'Tipo não definido'} • {' '}
            {data.category ? categoryLabels[data.category].label : 'Categoria não definida'}
          </p>
          {isComplete && (
            <p className="text-xs text-sky-700 font-semibold">
              Pronto para criar! Clica em "Criar Métrica" abaixo.
            </p>
          )}
        </div>
      </div>

      {/* Helper Box */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex gap-3">
          <div className="text-2xl shrink-0">⚠️</div>
          <div>
            <h4 className="font-semibold text-amber-900 text-sm mb-1">
              Atenção: Tipo não pode ser alterado
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Depois de criar a métrica, não será possível alterar o tipo de dados.
              Todas as outras configurações podem ser editadas posteriormente.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper Components

interface ReviewSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
  isMobile: boolean;
}

function ReviewSection({ title, icon, children, onEdit, isMobile }: ReviewSectionProps) {
  return (
    <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
          {icon}
          <span>{title}</span>
        </h3>
        {onEdit && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all ${
              isMobile ? 'min-h-[36px]' : ''
            }`}
          >
            <Edit2 className="h-3 w-3" />
            {!isMobile && <span>Editar</span>}
          </motion.button>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

interface ReviewFieldProps {
  label: string;
  value: string;
  icon?: string;
  required?: boolean;
}

function ReviewField({ label, value, icon, required }: ReviewFieldProps) {
  const isEmpty = !value || value === 'Não definida' || value === 'Não definido';
  const hasError = required && isEmpty;

  return (
    <div className={`flex items-start gap-3 ${hasError ? 'opacity-50' : ''}`}>
      {icon && <span className="text-lg shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase mb-0.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <p className={`text-sm font-semibold ${
          isEmpty ? 'text-slate-400 italic' : 'text-slate-900'
        }`}>
          {hasError ? '❌ Campo obrigatório' : value}
        </p>
      </div>
    </div>
  );
}
