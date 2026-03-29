import { motion } from 'motion/react';
import { X, FileText, ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import { WidgetConfig } from '@/types/athlete-profile';

interface ReportWidgetProps {
  config: WidgetConfig;
  isConfiguring: boolean;
  onRemove: () => void;
  onOpenReport?: (reportId: string) => void;
}

export function ReportWidget({
  config,
  isConfiguring,
  onRemove,
  onOpenReport
}: ReportWidgetProps) {
  // Mock report data
  const report = {
    id: config.reportId || 'report-1',
    title: config.title || 'Relatório de Progresso Mensal',
    lastGenerated: new Date(),
    keyMetrics: [
      { label: 'Sessões', value: '14/16', trend: 'up' },
      { label: 'Carga Média', value: '1,180 AU', trend: 'up' },
      { label: 'Recordes', value: '2 novos', trend: 'up' }
    ]
  };

  const handleOpenReport = () => {
    if (onOpenReport && report.id) {
      onOpenReport(report.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="h-full relative rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm hover:shadow-md transition-all"
    >
      {isConfiguring && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-violet-500 rounded-lg flex-shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm truncate">
            {report.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Gerado há 2 dias
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-2 mb-4">
        {report.keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="flex items-center justify-between p-2 bg-white rounded-lg"
          >
            <span className="text-xs font-medium text-slate-600">
              {metric.label}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900">
                {metric.value}
              </span>
              {metric.trend === 'up' && (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenReport}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Abrir</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-3 py-2 bg-white border-2 border-violet-200 text-violet-700 text-sm font-semibold rounded-lg hover:bg-violet-50 transition-colors"
        >
          <FileText className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-violet-100">
        <p className="text-xs text-center text-slate-500">
          Atualizado automaticamente
        </p>
      </div>
    </motion.div>
  );
}
