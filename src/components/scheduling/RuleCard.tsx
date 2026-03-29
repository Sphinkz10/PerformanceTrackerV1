import { motion } from 'motion/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { AvailabilityRule, WEEK_DAYS } from '@/types/scheduling';

interface RuleCardProps {
  rule: AvailabilityRule;
  index: number;
  onUpdate: (updated: Partial<AvailabilityRule>) => void;
  onDelete: () => void;
}

export function RuleCard({ rule, index, onUpdate, onDelete }: RuleCardProps) {
  const toggleDay = (dayIndex: number) => {
    const newDays = rule.days.includes(dayIndex)
      ? rule.days.filter(d => d !== dayIndex)
      : [...rule.days, dayIndex].sort();
    
    onUpdate({ days: newDays });
  };

  const updateTimeRange = (rangeIndex: number, field: 'start' | 'end', value: string) => {
    const newRanges = rule.timeRanges.map((range, i) =>
      i === rangeIndex ? { ...range, [field]: value } : range
    );
    onUpdate({ timeRanges: newRanges });
  };

  const addTimeRange = () => {
    onUpdate({
      timeRanges: [
        ...rule.timeRanges,
        { start: '09:00', end: '12:00' }
      ]
    });
  };

  const removeTimeRange = (rangeIndex: number) => {
    if (rule.timeRanges.length === 1) return; // Manter pelo menos 1
    onUpdate({
      timeRanges: rule.timeRanges.filter((_, i) => i !== rangeIndex)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border-2 ${
        rule.type === 'can'
          ? 'border-emerald-200 bg-white'
          : 'border-red-200 bg-white'
      }`}
    >
      {/* Week Days Selector */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Dias da Semana
        </label>
        <div className="flex gap-1">
          {WEEK_DAYS.map((day, index) => {
            const isSelected = rule.days.includes(index);
            return (
              <button
                key={index}
                onClick={() => toggleDay(index)}
                className={`flex-1 h-10 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? rule.type === 'can'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-red-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Ranges */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Horários
        </label>
        {rule.timeRanges.map((range, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="time"
              value={range.start}
              onChange={(e) => updateTimeRange(idx, 'start', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
            />
            <span className="text-slate-400 font-medium">→</span>
            <input
              type="time"
              value={range.end}
              onChange={(e) => updateTimeRange(idx, 'end', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
            />
            {rule.timeRanges.length > 1 && (
              <button
                onClick={() => removeTimeRange(idx)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={addTimeRange}
          className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
        >
          <Plus className="w-3 h-3" />
          Adicionar horário
        </button>
      </div>

      {/* Delete Rule */}
      <button
        onClick={onDelete}
        className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-3 h-3" />
        Remover regra
      </button>
    </motion.div>
  );
}
