import { motion } from 'motion/react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { WidgetConfig } from '@/types/athlete-profile';

interface LoadReadinessWidgetProps {
  config: WidgetConfig;
  isConfiguring: boolean;
  onRemove: () => void;
}

export function LoadReadinessWidget({ config, isConfiguring, onRemove }: LoadReadinessWidgetProps) {
  // Mock data
  const data = Array.from({ length: 28 }, (_, i) => {
    const load = Math.random() * 1500 + 500;
    const readiness = Math.random() * 40 + 60;
    
    // Status based on load vs readiness ratio
    let status: 'optimal' | 'caution' | 'high_risk';
    const ratio = load / (readiness * 10);
    if (ratio < 1.2) status = 'optimal';
    else if (ratio < 1.5) status = 'caution';
    else status = 'high_risk';

    return {
      load,
      readiness,
      status,
      day: i + 1
    };
  });

  const statusConfig = {
    optimal: { color: '#10b981', label: 'Ótimo', icon: CheckCircle },
    caution: { color: '#f59e0b', label: 'Atenção', icon: AlertCircle },
    high_risk: { color: '#ef4444', label: 'Alto Risco', icon: AlertTriangle }
  };

  // Count by status
  const statusCounts = data.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="h-full relative rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all"
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
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">
            {config.title || 'Carga vs Prontidão'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Últimos 28 dias
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex gap-2">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const count = statusCounts[key] || 0;

            return (
              <div
                key={key}
                className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg"
              >
                <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                <span className="text-xs font-semibold text-slate-700">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[calc(100%-70px)]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="readiness"
              name="Prontidão"
              tick={{ fontSize: 11 }}
              stroke="#64748b"
              label={{ value: 'Prontidão (%)', position: 'insideBottom', offset: -5, fontSize: 11 }}
            />
            <YAxis
              dataKey="load"
              name="Carga"
              tick={{ fontSize: 11 }}
              stroke="#64748b"
              label={{ value: 'Carga (AU)', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'Prontidão') return `${value.toFixed(1)}%`;
                if (name === 'Carga') return `${value.toFixed(0)} AU`;
                return value;
              }}
            />
            
            {/* Reference lines */}
            <ReferenceLine y={1200} stroke="#64748b" strokeDasharray="3 3" />
            <ReferenceLine x={80} stroke="#64748b" strokeDasharray="3 3" />

            {/* Scatter by status */}
            <Scatter
              data={data.filter(d => d.status === 'optimal')}
              fill={statusConfig.optimal.color}
              opacity={0.7}
            />
            <Scatter
              data={data.filter(d => d.status === 'caution')}
              fill={statusConfig.caution.color}
              opacity={0.7}
            />
            <Scatter
              data={data.filter(d => d.status === 'high_risk')}
              fill={statusConfig.high_risk.color}
              opacity={0.7}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
