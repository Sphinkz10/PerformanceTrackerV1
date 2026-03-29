import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Plus, Loader2, LayoutGrid, Eye, EyeOff } from 'lucide-react';
import {
  AthleteDashboardConfig,
  AthleteAnalyticsSummary,
  DashboardWidget,
  WidgetType
} from '@/types/athlete-profile';
import { WidgetRenderer } from './widgets/WidgetRenderer';
import { DashboardConfigModal } from './DashboardConfigModal';

interface AnalyticsDashboardProps {
  config: AthleteDashboardConfig | null;
  analytics: AthleteAnalyticsSummary | null;
  athleteId: string;
  isLoading: boolean;
  onUpdateConfig: (updates: Partial<AthleteDashboardConfig>) => void;
  onOpenReport: (reportId: string) => void;
}

export function AnalyticsDashboard({
  config,
  analytics,
  athleteId,
  isLoading,
  onUpdateConfig,
  onOpenReport
}: AnalyticsDashboardProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);

  // Default widgets if no config
  const defaultWidgets: DashboardWidget[] = [
    {
      id: 'default-1',
      type: 'kpi_card',
      position: { x: 0, y: 0, w: 3, h: 2 },
      config: {
        title: 'Sessões (28d)',
        metric: 'sessions_total',
        color: 'emerald'
      }
    },
    {
      id: 'default-2',
      type: 'kpi_card',
      position: { x: 3, y: 0, w: 3, h: 2 },
      config: {
        title: 'Aderência',
        metric: 'adherence',
        color: 'sky'
      }
    },
    {
      id: 'default-3',
      type: 'kpi_card',
      position: { x: 6, y: 0, w: 3, h: 2 },
      config: {
        title: 'Recordes',
        metric: 'records_total',
        color: 'amber'
      }
    },
    {
      id: 'default-4',
      type: 'line_chart',
      position: { x: 0, y: 2, w: 9, h: 4 },
      config: {
        title: 'Evolução de Carga (28 dias)',
        timeRange: 'last_28d'
      }
    }
  ];

  const widgets = config?.widgets || defaultWidgets;

  // Handle widget actions
  const handleRemoveWidget = (widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    onUpdateConfig({ widgets: updatedWidgets });
  };

  const handleUpdateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    const updatedWidgets = widgets.map(w =>
      w.id === widgetId ? { ...w, ...updates } : w
    );
    onUpdateConfig({ widgets: updatedWidgets });
  };

  const handleAddWidget = (type: WidgetType) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type,
      position: {
        x: 0,
        y: getMaxY() + 1,
        w: getDefaultWidth(type),
        h: getDefaultHeight(type)
      },
      config: getDefaultConfig(type)
    };

    onUpdateConfig({ widgets: [...widgets, newWidget] });
  };

  // Grid helpers
  const getMaxY = () => {
    if (widgets.length === 0) return -1;
    return Math.max(...widgets.map(w => w.position.y + w.position.h - 1));
  };

  const getDefaultWidth = (type: WidgetType): number => {
    switch (type) {
      case 'kpi_card':
        return 3;
      case 'line_chart':
      case 'bar_chart':
      case 'load_readiness':
        return 6;
      case 'recent_sessions':
        return 4;
      default:
        return 3;
    }
  };

  const getDefaultHeight = (type: WidgetType): number => {
    switch (type) {
      case 'kpi_card':
        return 2;
      case 'line_chart':
      case 'bar_chart':
      case 'load_readiness':
        return 4;
      case 'recent_sessions':
        return 5;
      default:
        return 3;
    }
  };

  const getDefaultConfig = (type: WidgetType): any => {
    switch (type) {
      case 'kpi_card':
        return { title: 'New KPI', metric: 'custom', color: 'violet' };
      case 'line_chart':
        return { title: 'New Chart', timeRange: 'last_28d' };
      default:
        return {};
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-100 rounded-lg">
            <LayoutGrid className="w-4 h-4 text-violet-600" />
          </div>
          <h2 className="font-bold text-slate-900">Dashboard Analítico</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Visibility */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDashboardVisible(!isDashboardVisible)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {isDashboardVisible ? (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Visível</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">Oculto</span>
              </>
            )}
          </motion.button>

          {/* Configure Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsConfiguring(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configurar</span>
          </motion.button>

          {/* Add Widget */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsConfiguring(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Widget</span>
          </motion.button>
        </div>
      </div>

      {/* Dashboard Content */}
      <AnimatePresence mode="wait">
        {isDashboardVisible ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {widgets.length > 0 ? (
              /* ✅ Day 11: Responsive grid - 4 cols mobile, 12 cols desktop */
              <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-3 sm:gap-4 auto-rows-[80px]">
                {widgets.map((widget, index) => (
                  <motion.div
                    key={widget.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`col-span-${widget.position.w} row-span-${widget.position.h}`}
                    style={{
                      gridColumn: `span ${widget.position.w} / span ${widget.position.w}`,
                      gridRow: `span ${widget.position.h} / span ${widget.position.h}`
                    }}
                  >
                    <WidgetRenderer
                      widget={widget}
                      analytics={analytics}
                      athleteId={athleteId}
                      isConfiguring={false}
                      onUpdate={(updates) => handleUpdateWidget(widget.id, updates)}
                      onRemove={() => handleRemoveWidget(widget.id)}
                      onOpenReport={onOpenReport}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <LayoutGrid className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-600 mb-2">
                  Dashboard Vazio
                </p>
                <p className="text-xs text-slate-500 mb-6">
                  Adiciona widgets para criar o teu dashboard analítico personalizado
                </p>
                <button
                  onClick={() => setIsConfiguring(true)}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Adicionar Primeiro Widget
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl"
          >
            <EyeOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">Dashboard oculto</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Modal */}
      <AnimatePresence>
        {isConfiguring && (
          <DashboardConfigModal
            config={config}
            athleteId={athleteId}
            onSave={(updates) => {
              onUpdateConfig(updates);
              setIsConfiguring(false);
            }}
            onClose={() => setIsConfiguring(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}