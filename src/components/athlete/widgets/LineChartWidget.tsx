import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { X, TrendingUp } from 'lucide-react';
import { WidgetConfig, AthleteAnalyticsSummary } from '@/types/athlete-profile';

interface LineChartWidgetProps {
  config: WidgetConfig;
  analytics: AthleteAnalyticsSummary | null;
  athleteId: string;
  isConfiguring: boolean;
  onUpdate: (config: WidgetConfig) => void;
  onRemove: () => void;
}

export function LineChartWidget({
  config,
  isConfiguring,
  onRemove
}: LineChartWidgetProps) {
  // Mock data (TODO: fetch real data)
  const generateMockData = () => {
    const days = config.timeRange === 'last_7d' ? 7 : config.timeRange === 'last_90d' ? 90 : 28;
    const data = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));

      data.push({
        date: date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
        load: Math.floor(Math.random() * 500) + 800,
        readiness: Math.floor(Math.random() * 30) + 70,
        rpe: Math.floor(Math.random() * 4) + 6
      });
    }

    return data;
  };

  const data = generateMockData();

  // Chart config
  const lines = [
    { key: 'load', name: 'Carga', color: '#10b981', show: true },
    { key: 'readiness', name: 'Prontidão', color: '#0ea5e9', show: config.showReadiness !== false },
    { key: 'rpe', name: 'RPE', color: '#f59e0b', show: config.showRPE === true }
  ].filter(line => line.show);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="h-full relative rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all"
    >
      {/* Remove Button */}
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
        <div>
          <h3 className="font-bold text-slate-900">
            {config.title || 'Gráfico de Linha'}
          </h3>
          {config.subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
          <TrendingUp className="w-3 h-3" />
          <span>+5.2%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              stroke="#64748b"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="#64748b"
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            {lines.map(line => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
