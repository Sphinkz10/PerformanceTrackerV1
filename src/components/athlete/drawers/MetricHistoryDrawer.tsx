import { motion } from 'motion/react';
import { X, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { PersonalRecord } from '@/types/athlete-profile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricHistoryDrawerProps {
  record: PersonalRecord;
  athleteId: string;
  onClose: () => void;
}

export function MetricHistoryDrawer({ record, onClose }: MetricHistoryDrawerProps) {
  // Mock historical data
  const history = Array.from({ length: 12 }, (_, i) => ({
    date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' }),
    value: record.value - (11 - i) * 2.5,
    wasActive: i === 11
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{record.display_name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">Histórico de evolução</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Record */}
          <div className="p-6 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600">Recorde Atual</p>
                <p className="text-3xl font-bold text-amber-600">
                  {record.value} <span className="text-xl text-slate-500">{record.unit}</span>
                </p>
              </div>
            </div>
            {record.improvement_percentage && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
                <TrendingUp className="w-4 h-4" />
                +{record.improvement_percentage.toFixed(1)}% vs anterior
              </div>
            )}
          </div>

          {/* Chart */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Evolução (12 meses)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f59e0b' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History List */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Histórico</h3>
            <div className="space-y-2">
              {history.slice().reverse().map((entry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    entry.wasActive
                      ? 'border-2 border-amber-300 bg-amber-50'
                      : 'border border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      {entry.value} {record.unit}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
