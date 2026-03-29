/**
 * RECORD DETAILS DRAWER - DAY 5 ✅
 * 
 * Drawer que mostra detalhes completos de um recorde pessoal,
 * incluindo histórico de evolução e estatísticas.
 * 
 * Features:
 * - Current record card
 * - Historical progression chart
 * - List of all previous records
 * - Improvement statistics
 * - Edit and delete actions
 * - Conditions and notes display
 * 
 * @author PerformTrack Team
 * @since Day 5 - Personal Records Management
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Trophy, TrendingUp, Calendar, Edit, Trash2, 
  CheckCircle, MapPin, Weight, Package, Info,
  BarChart3, ArrowUp, Sparkles
} from 'lucide-react';
import { PersonalRecord } from '@/types/athlete-profile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState } from 'react';

interface RecordDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: PersonalRecord;
  onEdit?: (record: PersonalRecord) => void;
  onDelete?: (recordId: string) => void;
}

export function RecordDetailsDrawer({
  isOpen,
  onClose,
  record,
  onEdit,
  onDelete
}: RecordDetailsDrawerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock historical data (in production, fetch from API)
  const generateHistory = () => {
    const history = [];
    const months = 12;
    let baseValue = record.previous_value || record.value * 0.7;
    
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - 1 - i));
      
      // Progressive improvement
      const improvement = (record.value - baseValue) / months;
      const value = baseValue + (improvement * i);
      
      history.push({
        date: date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
        value: parseFloat(value.toFixed(2)),
        fullDate: date.toLocaleDateString('pt-PT'),
        isCurrent: i === months - 1
      });
    }
    
    return history;
  };

  const history = generateHistory();
  const historicalValues = history.map(h => h.value);
  const stats = {
    min: Math.min(...historicalValues),
    max: Math.max(...historicalValues),
    avg: historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length,
    total_improvement: record.improvement_percentage || 0
  };

  // Category colors
  const categoryColors: Record<string, any> = {
    strength: { primary: '#8b5cf6', light: '#ede9fe', dark: '#7c3aed', bg: 'bg-violet-500', text: 'text-violet-600' },
    speed: { primary: '#0ea5e9', light: '#e0f2fe', dark: '#0284c7', bg: 'bg-sky-500', text: 'text-sky-600' },
    endurance: { primary: '#10b981', light: '#d1fae5', dark: '#059669', bg: 'bg-emerald-500', text: 'text-emerald-600' },
    power: { primary: '#f59e0b', light: '#fef3c7', dark: '#d97706', bg: 'bg-amber-500', text: 'text-amber-600' },
    skill: { primary: '#6366f1', light: '#e0e7ff', dark: '#4f46e5', bg: 'bg-indigo-500', text: 'text-indigo-600' },
    mobility: { primary: '#ec4899', light: '#fce7f3', dark: '#db2777', bg: 'bg-pink-500', text: 'text-pink-600' }
  };

  const colors = categoryColors[record.category || 'strength'] || categoryColors.strength;

  // Check if record is recent (last 7 days)
  const isRecent = new Date().getTime() - new Date(record.achieved_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{record.display_name}</h2>
                {isRecent && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                    <Sparkles className="w-3 h-3" />
                    NOVO
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">Recorde Pessoal • {record.category ? record.category.charAt(0).toUpperCase() + record.category.slice(1) : 'Sem categoria'}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Current Record Card */}
            <div className={`p-6 rounded-xl border-2 ${colors.text} bg-gradient-to-br from-amber-50 to-white`} style={{ borderColor: colors.primary }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary }}>
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600">Recorde Atual</p>
                  <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                    {record.value.toFixed(record.unit === 's' ? 2 : 1)}
                    <span className="text-xl text-slate-500 ml-1">{record.unit}</span>
                  </p>
                </div>
              </div>
              
              {record.improvement_percentage && record.improvement_percentage > 0 && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +{record.improvement_percentage.toFixed(1)}% vs anterior
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                Conquistado em {new Date(record.achieved_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>

              {record.validated_at && (
                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  Validado por {record.validated_by || 'Coach'} em {new Date(record.validated_at).toLocaleDateString('pt-PT')}
                </div>
              )}
            </div>

            {/* Statistics Grid */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-slate-600" />
                Estatísticas de Evolução
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Current */}
                <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-600">Atual</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.max.toFixed(1)}
                    <span className="text-sm text-slate-600 font-normal ml-1">{record.unit}</span>
                  </p>
                </div>

                {/* Average */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-600">Média</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.avg.toFixed(1)}
                    <span className="text-sm text-slate-600 font-normal ml-1">{record.unit}</span>
                  </p>
                </div>

                {/* Previous */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-400 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-600">Anterior</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {(record.previous_value || stats.min).toFixed(1)}
                    <span className="text-sm text-slate-600 font-normal ml-1">{record.unit}</span>
                  </p>
                </div>

                {/* Improvement */}
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <ArrowUp className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-600">Melhoria</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    +{stats.total_improvement.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Evolution Chart */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                Evolução - Últimos 12 meses
              </h3>
              <div className="h-80 rounded-xl border border-slate-200 bg-white p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id={`gradient-record`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      stroke="#64748b"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      stroke="#64748b"
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        padding: '12px'
                      }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                      formatter={(value: any) => [`${value} ${record.unit}`, record.display_name]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={colors.primary}
                      strokeWidth={3}
                      fill={`url(#gradient-record)`}
                      dot={{ r: 4, fill: colors.primary, strokeWidth: 2, stroke: 'white' }}
                      activeDot={{ r: 6, fill: colors.dark }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conditions */}
            {record.conditions && Object.keys(record.conditions).length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-slate-600" />
                  Condições do Recorde
                </h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  {record.conditions.bodyweight && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <Weight className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Peso Corporal</p>
                        <p className="text-sm font-semibold text-slate-900">{record.conditions.bodyweight} kg</p>
                      </div>
                    </div>
                  )}
                  {record.conditions.equipment && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <Package className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Equipamento</p>
                        <p className="text-sm font-semibold text-slate-900">{record.conditions.equipment}</p>
                      </div>
                    </div>
                  )}
                  {record.conditions.location && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Local</p>
                        <p className="text-sm font-semibold text-slate-900">{record.conditions.location}</p>
                      </div>
                    </div>
                  )}
                  {(record.conditions as any).notes && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Notas</p>
                      <p className="text-sm text-slate-700">{(record.conditions as any).notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Validation Notes */}
            {record.validation_notes && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Notas de Validação</h3>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-slate-700">{record.validation_notes}</p>
                </div>
              </div>
            )}

            {/* Historical Records List */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                Histórico Completo
              </h3>
              <div className="space-y-2">
                {history.slice().reverse().map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-3 rounded-xl ${
                      entry.isCurrent
                        ? 'border-2 border-amber-300 bg-amber-50'
                        : 'border border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-sm font-semibold text-slate-900">
                            {entry.value.toFixed(record.unit === 's' ? 2 : 1)} {record.unit}
                          </span>
                          {entry.isCurrent && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white font-medium">
                              Atual
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {entry.fullDate}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-sm font-semibold text-red-900 mb-3">
                  Tem a certeza que deseja eliminar este recorde?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(record.id);
                      onClose();
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Sim, eliminar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {(onEdit || onDelete) && !showDeleteConfirm && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
              {onDelete && record.source === 'manual' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Eliminar
                </motion.button>
              )}

              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onEdit(record);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Edit className="w-5 h-5" />
                  Editar Recorde
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
