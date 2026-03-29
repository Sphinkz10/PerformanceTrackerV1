import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Settings, Eye, EyeOff } from 'lucide-react';
import { AthleteDashboardConfig, WidgetType, WIDGET_TYPE_LABELS } from '@/types/athlete-profile';

interface DashboardConfigModalProps {
  config: AthleteDashboardConfig | null;
  athleteId: string;
  onSave: (updates: Partial<AthleteDashboardConfig>) => void;
  onClose: () => void;
}

export function DashboardConfigModal({
  config,
  onSave,
  onClose
}: DashboardConfigModalProps) {
  const [selectedWidgets, setSelectedWidgets] = useState<WidgetType[]>(
    config?.widgets.map(w => w.type) || []
  );

  const availableWidgets: WidgetType[] = [
    'kpi_card',
    'line_chart',
    'bar_chart',
    'load_readiness',
    'volume_breakdown',
    'recent_sessions',
    'recovery_status',
    'adherence_gauge',
    'report_widget',
    'wellness_trend'
  ];

  const toggleWidget = (type: WidgetType) => {
    setSelectedWidgets(prev =>
      prev.includes(type)
        ? prev.filter(w => w !== type)
        : [...prev, type]
    );
  };

  const handleSave = () => {
    // Build widgets array from selected types
    const widgets = selectedWidgets.map((type, index) => ({
      id: `widget-${Date.now()}-${index}`,
      type,
      position: {
        x: (index % 3) * 4,
        y: Math.floor(index / 3) * 3,
        w: type === 'kpi_card' ? 3 : 6,
        h: type === 'kpi_card' ? 2 : 4
      },
      config: {}
    }));

    onSave({ widgets });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Configurar Dashboard</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Seleciona os widgets a mostrar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content - ✅ Day 11: Responsive grid 1/2 cols */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableWidgets.map(type => {
              const isSelected = selectedWidgets.includes(type);

              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleWidget(type)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-white shadow-md'
                      : 'border-slate-200 bg-white hover:border-violet-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Settings className={`w-5 h-5 ${
                      isSelected ? 'text-violet-600' : 'text-slate-400'
                    }`} />
                    {isSelected ? (
                      <Eye className="w-4 h-4 text-violet-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <p className={`font-semibold text-sm ${
                    isSelected ? 'text-violet-900' : 'text-slate-900'
                  }`}>
                    {WIDGET_TYPE_LABELS[type]}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {getWidgetDescription(type)}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{selectedWidgets.length}</span>
            {' '}widgets selecionados
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Aplicar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getWidgetDescription(type: WidgetType): string {
  const descriptions: Record<WidgetType, string> = {
    kpi_card: 'Métrica única com tendência',
    line_chart: 'Gráfico temporal de evolução',
    bar_chart: 'Comparação por categoria',
    load_readiness: 'Matriz carga vs prontidão',
    volume_breakdown: 'Volume por tipo de treino',
    recent_sessions: 'Lista de sessões recentes',
    recovery_status: 'Estado de recuperação',
    adherence_gauge: 'Medidor de aderência',
    report_widget: 'Widget de relatório',
    injury_alert: 'Alertas de lesões',
    wellness_trend: 'Tendência de wellness'
  };

  return descriptions[type] || 'Widget personalizado';
}