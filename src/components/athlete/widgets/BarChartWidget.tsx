import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { X } from 'lucide-react';
import { WidgetConfig } from '@/types/athlete-profile';

interface BarChartWidgetProps {
  config: WidgetConfig;
  isConfiguring: boolean;
  onRemove: () => void;
}

export function BarChartWidget({ config, isConfiguring, onRemove }: BarChartWidgetProps) {
  // Mock data
  const data = [
    { category: 'Força', volume: 12500, sessions: 8 },
    { category: 'Cardio', volume: 8200, sessions: 6 },
    { category: 'Mobilidade', volume: 3400, sessions: 4 },
    { category: 'Técnica', volume: 5600, sessions: 5 },
    { category: 'Recuperação', volume: 2100, sessions: 3 }
  ];

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

      <div className="mb-3">
        <h3 className="font-bold text-slate-900">
          {config.title || 'Gráfico de Barras'}
        </h3>
        {config.subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{config.subtitle}</p>
        )}
      </div>

      <div className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="volume" name="Volume (kg)" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sessions" name="Sessões" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
