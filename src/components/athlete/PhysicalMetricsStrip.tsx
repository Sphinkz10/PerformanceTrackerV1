import { motion } from 'motion/react';
import { Ruler, Weight, Droplet, Dumbbell, Move, Edit2, Calendar, Info } from 'lucide-react';
import { AthletePhysicalData, PHYSICAL_METRIC_LABELS } from '@/types/athlete-profile';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface PhysicalMetricsStripProps {
  athleteId: string;
  athleteName: string;
  athleteAvatar: string;
  physicalData: AthletePhysicalData;
  onEdit: () => void;
}

export function PhysicalMetricsStrip({ athleteId, athleteName, athleteAvatar, physicalData, onEdit }: PhysicalMetricsStripProps) {
  // Safety check
  if (!physicalData) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
        <Ruler className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600 mb-1">Sem dados físicos</p>
        <p className="text-xs text-slate-500 mb-4">Adiciona medidas antropométricas para acompanhar evolução</p>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-violet-500 text-white text-sm font-semibold rounded-lg hover:bg-violet-600 transition-colors"
        >
          Adicionar Dados
        </button>
      </div>
    );
  }

  const metrics = [
    {
      key: 'age',
      icon: Calendar,
      label: 'Idade',
      value: physicalData.age,
      unit: 'anos',
      color: 'violet'
    },
    {
      key: 'height_cm',
      icon: Ruler,
      label: 'Altura',
      value: physicalData.height_cm,
      unit: 'cm',
      color: 'sky'
    },
    {
      key: 'weight_kg',
      icon: Weight,
      label: 'Peso',
      value: physicalData.weight_kg,
      unit: 'kg',
      color: 'emerald',
      isPrimary: true
    },
    {
      key: 'body_fat_percentage',
      icon: Droplet,
      label: '% Gordura',
      value: physicalData.body_fat_percentage,
      unit: '%',
      color: 'amber'
    },
    {
      key: 'lean_mass_kg',
      icon: Dumbbell,
      label: 'Massa Magra',
      value: physicalData.lean_mass_kg,
      unit: 'kg',
      color: 'indigo'
    },
    {
      key: 'wingspan_cm',
      icon: Move,
      label: 'Envergadura',
      value: physicalData.wingspan_cm,
      unit: 'cm',
      color: 'slate'
    }
  ];

  // Filter out metrics without values
  const visibleMetrics = metrics.filter(m => m.value !== undefined && m.value !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-100 rounded-lg">
            <Ruler className="w-4 h-4 text-sky-600" />
          </div>
          <h2 className="font-bold text-slate-900">Dados Físicos</h2>
        </div>

        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Editar</span>
        </motion.button>
      </div>

      {/* Metrics Grid - ✅ Day 11: Already responsive 2/3/6 cols */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {visibleMetrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <motion.button
              key={metric.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={onEdit}
              className={`group relative p-4 rounded-xl border-2 transition-all ${
                metric.isPrimary
                  ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-400 hover:shadow-lg'
                  : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-md'
              }`}
            >
              {/* Icon */}
              <div
                className={`inline-flex p-2 rounded-lg mb-2 ${
                  metric.isPrimary
                    ? 'bg-emerald-500'
                    : `bg-${metric.color}-100`
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    metric.isPrimary
                      ? 'text-white'
                      : `text-${metric.color}-600`
                  }`}
                />
              </div>

              {/* Label */}
              <p className="text-xs font-medium text-slate-600 mb-1">
                {metric.label}
              </p>

              {/* Value */}
              <p className={`text-xl font-bold ${
                metric.isPrimary ? 'text-emerald-600' : 'text-slate-900'
              }`}>
                {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                <span className="text-sm font-medium text-slate-500 ml-1">
                  {metric.unit}
                </span>
              </p>

              {/* Hover Indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-3 h-3 text-slate-400" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Metadata */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            {physicalData.last_updated ? (
              <>
                Última atualização:{' '}
                <span className="font-medium text-slate-700">
                  {format(new Date(physicalData.last_updated), "d 'de' MMMM, HH:mm", { locale: pt })}
                </span>
              </>
            ) : (
              'Sem dados físicos registados'
            )}
          </span>
        </div>

        {physicalData.source && (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
            {physicalData.source === 'assessment' ? 'Avaliação' : physicalData.source === 'manual' ? 'Manual' : 'Form'}
          </span>
        )}
      </div>
    </motion.div>
  );
}