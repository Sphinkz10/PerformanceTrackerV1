import { motion, AnimatePresence } from 'motion/react';
import { Trophy, TrendingUp, Sparkles, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { PersonalRecord, RecordSuggestion, RECORD_CATEGORY_LABELS } from '@/types/athlete-profile';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface RecordsStripProps {
  records: PersonalRecord[];
  suggestions: RecordSuggestion[];
  isLoading: boolean;
  onRecordClick: (record: PersonalRecord) => void;
  onSuggestionClick: (suggestion: RecordSuggestion) => void;
}

export function RecordsStrip({
  records,
  suggestions,
  isLoading,
  onRecordClick,
  onSuggestionClick
}: RecordsStripProps) {
  // Group records by category
  const recordsByCategory = records.reduce((acc, record) => {
    const category = record.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(record);
    return acc;
  }, {} as Record<string, PersonalRecord[]>);

  // Sort by most recent
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 rounded-lg">
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="font-bold text-slate-900">Recordes Pessoais</h2>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
            {records.length}
          </span>
        </div>

        {isLoading && (
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
        )}
      </div>

      {/* Pending Suggestions Alert */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-emerald-900 mb-1">
                    🎉 {suggestions.length} Novo(s) Recorde(s) Pessoal!
                  </p>
                  <p className="text-sm text-emerald-800 mb-3">
                    Foram detetados novos recordes pessoais. Revê e confirma.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-emerald-300 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                      >
                        <span>{suggestion.metric_name}</span>
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-emerald-600">
                          +{suggestion.improvement_percentage?.toFixed(1)}%
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Records Grid - ✅ Day 11: Already responsive 2/3/4/6 cols */}
      {sortedRecords.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {sortedRecords.slice(0, 12).map((record, index) => (
            <RecordCard
              key={record.id}
              record={record}
              index={index}
              onClick={() => onRecordClick(record)}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 mb-1">
            Sem recordes registados
          </p>
          <p className="text-xs text-slate-500">
            Recordes pessoais serão detetados automaticamente durante sessões
          </p>
        </div>
      )}

      {/* View All Link */}
      {sortedRecords.length > 12 && (
        <motion.button
          whileHover={{ x: 5 }}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
        >
          <span>Ver todos os {sortedRecords.length} recordes</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * Individual Record Card
 */
interface RecordCardProps {
  record: PersonalRecord;
  index: number;
  onClick: () => void;
}

function RecordCard({ record, index, onClick }: RecordCardProps) {
  // Category colors
  const categoryColors: Record<string, string> = {
    strength: 'violet',
    speed: 'sky',
    endurance: 'emerald',
    power: 'amber',
    skill: 'indigo',
    mobility: 'pink'
  };

  const color = categoryColors[record.category || 'strength'] || 'slate';

  // Check if recent (last 7 days)
  const isRecent = new Date().getTime() - new Date(record.achieved_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.03 }}
      onClick={onClick}
      className={`group relative p-4 rounded-xl border-2 text-left transition-all ${
        isRecent
          ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-400 hover:shadow-lg'
          : `border-${color}-200 bg-gradient-to-br from-${color}-50/50 to-white hover:border-${color}-400 hover:shadow-md`
      }`}
    >
      {/* New Badge */}
      {isRecent && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">
            <Sparkles className="w-3 h-3" />
            NOVO
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`inline-flex p-2 rounded-lg mb-2 ${
        isRecent ? 'bg-emerald-500' : `bg-${color}-500`
      }`}>
        <Trophy className="w-4 h-4 text-white" />
      </div>

      {/* Name */}
      <p className="text-xs font-medium text-slate-600 mb-1 truncate">
        {record.display_name}
      </p>

      {/* Value */}
      <p className={`text-xl font-bold ${
        isRecent ? 'text-emerald-600' : 'text-slate-900'
      }`}>
        {record.value.toFixed(record.unit === 's' ? 2 : 1)}
        <span className="text-sm font-medium text-slate-500 ml-1">
          {record.unit}
        </span>
      </p>

      {/* Improvement */}
      {record.improvement_percentage && record.improvement_percentage > 0 && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-600">
            +{record.improvement_percentage.toFixed(1)}%
          </span>
        </div>
      )}

      {/* Date */}
      <p className="text-xs text-slate-500 mt-1">
        {format(new Date(record.achieved_at), 'd MMM', { locale: pt })}
      </p>

      {/* Hover Arrow */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </motion.button>
  );
}