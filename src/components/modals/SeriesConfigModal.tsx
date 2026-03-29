import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  Zap,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Weight,
  Star,
  ChevronDown,
  ChevronRight,
  Save,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type { SeriesConfig, BlockExercise, Exercise } from "../../lib/DesignStudioTypes";

interface SeriesConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockExercise: BlockExercise | null;
  onSave: (series: SeriesConfig[]) => void;
}

const PROGRESSION_TEMPLATES = [
  {
    id: 'linear',
    name: 'Linear',
    icon: '📈',
    description: 'Mesma carga e reps em todas as séries',
    color: 'sky'
  },
  {
    id: 'pyramid-up',
    name: 'Pirâmide Crescente',
    icon: '⛰️',
    description: 'Aumenta carga, diminui reps',
    color: 'violet'
  },
  {
    id: 'pyramid-down',
    name: 'Pirâmide Decrescente',
    icon: '🔽',
    description: 'Diminui carga, aumenta reps',
    color: 'emerald'
  },
  {
    id: 'wave',
    name: 'Wave Loading',
    icon: '🌊',
    description: 'Ondula entre cargas pesadas e leves',
    color: 'amber'
  },
  {
    id: 'drop',
    name: 'Drop Set',
    icon: '💥',
    description: 'Diminui carga progressivamente sem descanso',
    color: 'red'
  }
];

export function SeriesConfigModal({
  isOpen,
  onClose,
  blockExercise,
  onSave
}: SeriesConfigModalProps) {
  const [series, setSeries] = useState<SeriesConfig[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [superset, setSuperset] = useState(false);
  const [supersetWith, setSupersetWith] = useState("");

  useEffect(() => {
    if (blockExercise && isOpen) {
      setSeries(blockExercise.series.length > 0 ? [...blockExercise.series] : [createDefaultSeries(1)]);
      setSuperset(blockExercise.superset || false);
      setSupersetWith(blockExercise.supersetWith || "");
    }
  }, [blockExercise, isOpen]);

  const createDefaultSeries = (seriesNumber: number): SeriesConfig => ({
    id: `series-${Date.now()}-${seriesNumber}`,
    seriesNumber,
    reps: 10,
    load: 0,
    rpe: 7,
    rest: 90,
    completed: false
  });

  const handleAddSeries = () => {
    const newSeries = createDefaultSeries(series.length + 1);
    setSeries([...series, newSeries]);
    toast.success("Série adicionada!");
  };

  const handleRemoveSeries = (id: string) => {
    if (series.length === 1) {
      toast.error("Deve ter pelo menos 1 série!");
      return;
    }
    
    setSeries(series.filter(s => s.id !== id).map((s, idx) => ({
      ...s,
      seriesNumber: idx + 1
    })));
    toast.success("Série removida!");
  };

  const handleDuplicateSeries = (id: string) => {
    const seriesToDuplicate = series.find(s => s.id === id);
    if (!seriesToDuplicate) return;
    
    const newSeries: SeriesConfig = {
      ...seriesToDuplicate,
      id: `series-${Date.now()}`,
      seriesNumber: series.length + 1,
      completed: false
    };
    
    setSeries([...series, newSeries]);
    toast.success("Série duplicada!");
  };

  const handleUpdateSeries = (id: string, updates: Partial<SeriesConfig>) => {
    setSeries(series.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleApplyTemplate = (templateId: string) => {
    const baseReps = 10;
    const baseLoad = 100;
    let newSeries: SeriesConfig[] = [];

    switch (templateId) {
      case 'linear':
        newSeries = Array.from({ length: 4 }, (_, i) => ({
          id: `series-${Date.now()}-${i}`,
          seriesNumber: i + 1,
          reps: baseReps,
          load: baseLoad,
          rpe: 7,
          rest: 90,
          completed: false
        }));
        break;

      case 'pyramid-up':
        newSeries = [
          { id: `series-${Date.now()}-0`, seriesNumber: 1, reps: 12, load: baseLoad * 0.7, rpe: 6, rest: 90, completed: false },
          { id: `series-${Date.now()}-1`, seriesNumber: 2, reps: 10, load: baseLoad * 0.8, rpe: 7, rest: 120, completed: false },
          { id: `series-${Date.now()}-2`, seriesNumber: 3, reps: 8, load: baseLoad * 0.9, rpe: 8, rest: 150, completed: false },
          { id: `series-${Date.now()}-3`, seriesNumber: 4, reps: 6, load: baseLoad, rpe: 9, rest: 180, completed: false }
        ];
        break;

      case 'pyramid-down':
        newSeries = [
          { id: `series-${Date.now()}-0`, seriesNumber: 1, reps: 6, load: baseLoad, rpe: 9, rest: 180, completed: false },
          { id: `series-${Date.now()}-1`, seriesNumber: 2, reps: 8, load: baseLoad * 0.9, rpe: 8, rest: 150, completed: false },
          { id: `series-${Date.now()}-2`, seriesNumber: 3, reps: 10, load: baseLoad * 0.8, rpe: 7, rest: 120, completed: false },
          { id: `series-${Date.now()}-3`, seriesNumber: 4, reps: 12, load: baseLoad * 0.7, rpe: 6, rest: 90, completed: false }
        ];
        break;

      case 'wave':
        newSeries = [
          { id: `series-${Date.now()}-0`, seriesNumber: 1, reps: 5, load: baseLoad, rpe: 9, rest: 180, completed: false },
          { id: `series-${Date.now()}-1`, seriesNumber: 2, reps: 10, load: baseLoad * 0.75, rpe: 7, rest: 90, completed: false },
          { id: `series-${Date.now()}-2`, seriesNumber: 3, reps: 5, load: baseLoad * 1.05, rpe: 9, rest: 180, completed: false },
          { id: `series-${Date.now()}-3`, seriesNumber: 4, reps: 10, load: baseLoad * 0.8, rpe: 7, rest: 90, completed: false }
        ];
        break;

      case 'drop':
        newSeries = [
          { id: `series-${Date.now()}-0`, seriesNumber: 1, reps: 8, load: baseLoad, rpe: 9, rest: 0, completed: false },
          { id: `series-${Date.now()}-1`, seriesNumber: 2, reps: 10, load: baseLoad * 0.8, rpe: 9, rest: 0, completed: false },
          { id: `series-${Date.now()}-2`, seriesNumber: 3, reps: 12, load: baseLoad * 0.6, rpe: 10, rest: 180, completed: false }
        ];
        break;
    }

    setSeries(newSeries);
    setShowTemplates(false);
    toast.success("Template aplicado!");
  };

  const handleApplyToAll = (field: keyof SeriesConfig, value: any) => {
    setSeries(series.map(s => ({ ...s, [field]: value })));
    toast.success(`${field} aplicado a todas as séries!`);
  };

  const handleSave = () => {
    if (series.length === 0) {
      toast.error("Adicione pelo menos 1 série!");
      return;
    }

    onSave(series);
    toast.success("Séries configuradas!");
    onClose();
  };

  if (!isOpen || !blockExercise) return null;

  const exerciseName = blockExercise.exercise?.name || "Exercício";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="font-bold text-slate-900 mb-1">
              ⚙️ Configurar Séries
            </h2>
            <p className="text-sm text-slate-600">
              {exerciseName} • {series.length} série{series.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddSeries}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              Adicionar Série
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Templates
              {showTemplates ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </motion.button>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Superset:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={superset}
                  onChange={(e) => setSuperset(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-amber-600"></div>
              </label>
            </div>
          </div>

          {/* Templates */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border-2 border-violet-200 bg-violet-50/50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Templates de Progressão
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PROGRESSION_TEMPLATES.map(template => (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleApplyTemplate(template.id)}
                        className={`p-4 rounded-xl border-2 bg-white hover:shadow-md transition-all text-left border-${template.color}-200 hover:border-${template.color}-400`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{template.icon}</span>
                          <span className="font-semibold text-slate-900 text-sm">
                            {template.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {template.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Series List */}
          <div className="space-y-3">
            {series.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <Target className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-3">
                  Nenhuma série configurada
                </p>
                <button
                  onClick={handleAddSeries}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors"
                >
                  Adicionar Primeira Série
                </button>
              </div>
            ) : (
              <>
                {series.map((seriesItem, index) => (
                  <SeriesConfigCard
                    key={seriesItem.id}
                    series={seriesItem}
                    index={index}
                    onUpdate={(updates) => handleUpdateSeries(seriesItem.id, updates)}
                    onRemove={() => handleRemoveSeries(seriesItem.id)}
                    onDuplicate={() => handleDuplicateSeries(seriesItem.id)}
                  />
                ))}
              </>
            )}
          </div>

          {/* Apply to All */}
          {series.length > 1 && (
            <div className="rounded-xl border-2 border-sky-200 bg-sky-50/50 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-sky-600" />
                Aplicar a Todas as Séries
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Reps
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="10"
                      className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseInt((e.target as HTMLInputElement).value);
                          if (!isNaN(value)) handleApplyToAll('reps', value);
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Carga (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseFloat((e.target as HTMLInputElement).value);
                        if (!isNaN(value)) handleApplyToAll('load', value);
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    RPE
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="7"
                    className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseInt((e.target as HTMLInputElement).value);
                        if (!isNaN(value) && value >= 1 && value <= 10) {
                          handleApplyToAll('rpe', value);
                        }
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Rest (s)
                  </label>
                  <input
                    type="number"
                    placeholder="90"
                    className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseInt((e.target as HTMLInputElement).value);
                        if (!isNaN(value)) handleApplyToAll('rest', value);
                      }
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 italic">
                Digite o valor e pressione Enter para aplicar
              </p>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              📊 Resumo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-600 mb-1">Total Séries</p>
                <p className="font-semibold text-slate-900">{series.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Total Reps</p>
                <p className="font-semibold text-slate-900">
                  {series.reduce((sum, s) => sum + (s.reps || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Volume Total</p>
                <p className="font-semibold text-slate-900">
                  {series.reduce((sum, s) => sum + ((s.reps || 0) * (s.load || 0)), 0)} kg
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Tempo Total</p>
                <p className="font-semibold text-slate-900">
                  {Math.floor(series.reduce((sum, s) => sum + (s.rest || 0), 0) / 60)}min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 transition-all"
          >
            Cancelar
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            <Save className="h-4 w-4" />
            Salvar Configuração
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Series Config Card Component
interface SeriesConfigCardProps {
  series: SeriesConfig;
  index: number;
  onUpdate: (updates: Partial<SeriesConfig>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

function SeriesConfigCard({
  series,
  index,
  onUpdate,
  onRemove,
  onDuplicate
}: SeriesConfigCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-sky-300 transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity pt-2">
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>

        {/* Series Number */}
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shrink-0">
          <span className="font-bold text-white">{series.seriesNumber}</span>
        </div>

        {/* Fields */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Reps
            </label>
            <input
              type="number"
              value={series.reps || ''}
              onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
              <Weight className="h-3 w-3" />
              Carga (kg)
            </label>
            <input
              type="number"
              step="0.5"
              value={series.load || ''}
              onChange={(e) => onUpdate({ load: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
              <Star className="h-3 w-3" />
              RPE
            </label>
            <select
              value={series.rpe || 7}
              onChange={(e) => onUpdate({ rpe: parseInt(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Rest (s)
            </label>
            <input
              type="number"
              value={series.rest || ''}
              onChange={(e) => onUpdate({ rest: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onDuplicate}
            className="h-8 w-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center transition-colors"
            title="Duplicar"
          >
            <Copy className="h-4 w-4 text-emerald-600" />
          </button>
          <button
            onClick={onRemove}
            className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
            title="Remover"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Notes (optional) */}
      {series.notes && (
        <div className="mt-3 pl-16">
          <p className="text-xs text-slate-600 italic">{series.notes}</p>
        </div>
      )}
    </motion.div>
  );
}
