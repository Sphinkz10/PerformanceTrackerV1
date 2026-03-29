/**
 * METRIC HISTORY PANEL
 * Painel completo de histórico com gráfico, timeline e análise
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Filter,
  Download,
  Printer,
  Copy,
  BarChart3,
  LineChart,
  Table,
  Calendar as CalendarIcon,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Award,
  Zap,
  MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface HistoryEntry {
  id: string;
  date: string;
  time: string;
  athleteName: string;
  athleteAvatar: string;
  value: number;
  unit: string;
  zone: 'green' | 'yellow' | 'red';
  change: number;
  changeLabel: string;
  note?: string;
  noteAuthor?: string;
  isNewPR?: boolean;
}

interface MetricHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    name: string;
    unit: string;
  };
  onExport: (format: string) => void;
}

// Mock data
const MOCK_CHART_DATA = [
  { month: 'Jan', joão: 150, maria: 95, pedro: 170, average: 138 },
  { month: 'Fev', joão: 155, maria: 100, pedro: 175, average: 143 },
  { month: 'Mar', joão: 160, maria: 100, pedro: 175, average: 145 },
];

const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: '1',
    date: 'Hoje',
    time: '14:23',
    athleteName: 'João Silva',
    athleteAvatar: '👤',
    value: 160,
    unit: 'kg',
    zone: 'green',
    change: 5,
    changeLabel: '+5kg',
    note: 'Felt strong today',
    noteAuthor: 'Coach Pedro',
  },
  {
    id: '2',
    date: 'Hoje',
    time: '10:15',
    athleteName: 'Maria Santos',
    athleteAvatar: '👤',
    value: 100,
    unit: 'kg',
    zone: 'yellow',
    change: 5,
    changeLabel: '+5kg',
    note: 'Recovering from injury',
  },
  {
    id: '3',
    date: 'Ontem',
    time: '16:45',
    athleteName: 'Pedro Costa',
    athleteAvatar: '👤',
    value: 175,
    unit: 'kg',
    zone: 'green',
    change: 5,
    changeLabel: '+5kg',
    note: 'Personal record!',
    noteAuthor: 'Coach Pedro',
    isNewPR: true,
  },
];

export function MetricHistoryPanel({ isOpen, onClose, metric, onExport }: MetricHistoryPanelProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'timeline'>('chart');
  const [period, setPeriod] = useState('30d');
  const [selectedAthletes, setSelectedAthletes] = useState('all');
  const [filter, setFilter] = useState('all');

  const filteredHistory = MOCK_HISTORY.filter(entry => {
    if (filter === 'alerts') return entry.zone === 'red' || entry.zone === 'yellow';
    if (filter === 'improvements') return entry.change > 0;
    if (filter === 'prs') return entry.isNewPR;
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header - NUNCA ESCONDE */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                    <LineChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      📊 HISTÓRICO - {metric.name}
                    </h2>
                    <p className="text-sm text-slate-600">Análise completa de evolução</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </motion.button>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3">
                {/* Period */}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                  <option value="custom">Personalizado</option>
                </select>

                {/* Athletes */}
                <select
                  value={selectedAthletes}
                  onChange={(e) => setSelectedAthletes(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                >
                  <option value="all">Todos os atletas</option>
                  <option value="joão">João Silva</option>
                  <option value="maria">Maria Santos</option>
                  <option value="pedro">Pedro Costa</option>
                </select>

                {/* View Mode */}
                <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                      viewMode === 'chart'
                        ? 'bg-white text-sky-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-sky-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Table className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                      viewMode === 'timeline'
                        ? 'bg-white text-sky-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content - SCROLL SE NECESSÁRIO */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
              {/* Chart View */}
              {viewMode === 'chart' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
                      <p className="text-xs text-emerald-700 mb-1">Média</p>
                      <p className="text-2xl font-bold text-emerald-900">145.5 {metric.unit}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-white border border-red-200">
                      <p className="text-xs text-red-700 mb-1">Mínimo</p>
                      <p className="text-2xl font-bold text-red-900">90 {metric.unit}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
                      <p className="text-xs text-sky-700 mb-1">Máximo</p>
                      <p className="text-2xl font-bold text-sky-900">185 {metric.unit}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200">
                      <p className="text-xs text-purple-700 mb-1">Tendência</p>
                      <p className="text-2xl font-bold text-purple-900 flex items-center gap-1">
                        <TrendingUp className="h-5 w-5" />
                        +8%
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 mb-4">
                      📈 Evolução Temporal
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLineChart data={MOCK_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '12px',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="joão" stroke="#10b981" strokeWidth={3} name="João Silva" />
                        <Line type="monotone" dataKey="maria" stroke="#ef4444" strokeWidth={3} name="Maria Santos" />
                        <Line type="monotone" dataKey="pedro" stroke="#0ea5e9" strokeWidth={3} name="Pedro Costa" />
                        <Line type="monotone" dataKey="average" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Média" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Records */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200">
                    <p className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      🏆 RECORDES
                    </p>
                    <div className="space-y-2 text-sm text-amber-800">
                      <p>• Melhor melhoria: <strong>+15kg</strong> (João, 12 Jan)</p>
                      <p>• Maior sequência positiva: <strong>4 semanas</strong> (Pedro)</p>
                      <p>• PR mais recente: <strong>João (185kg, 12 Jan)</strong></p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Timeline View */}
              {viewMode === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Filters */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${
                        filter === 'all'
                          ? 'bg-sky-100 text-sky-700 font-medium'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFilter('alerts')}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${
                        filter === 'alerts'
                          ? 'bg-red-100 text-red-700 font-medium'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      🔴 Alertas
                    </button>
                    <button
                      onClick={() => setFilter('improvements')}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${
                        filter === 'improvements'
                          ? 'bg-emerald-100 text-emerald-700 font-medium'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      🟢 Melhorias
                    </button>
                    <button
                      onClick={() => setFilter('prs')}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${
                        filter === 'prs'
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Novos PRs
                    </button>
                  </div>

                  {/* Timeline Entries */}
                  <div className="space-y-3">
                    {filteredHistory.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border-2 ${
                          entry.zone === 'green'
                            ? 'bg-emerald-50 border-emerald-200'
                            : entry.zone === 'yellow'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Time */}
                            <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {entry.date}, {entry.time}
                            </p>

                            {/* Athlete */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{entry.athleteAvatar}</span>
                              <p className="text-sm font-semibold text-slate-900">
                                {entry.athleteName}
                              </p>
                            </div>

                            {/* Value */}
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-bold text-slate-900">
                                {entry.value}{entry.unit}
                              </p>
                              <span className={`text-sm font-medium ${
                                entry.change > 0 ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                ({entry.changeLabel})
                              </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                              {entry.isNewPR && (
                                <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1">
                                  <Award className="h-3 w-3" />
                                  NOVO PR!
                                </span>
                              )}
                              {entry.zone === 'green' && (
                                <span className="text-xs text-emerald-600">
                                  🟢 Melhorou para nova zona
                                </span>
                              )}
                              {entry.zone === 'yellow' && (
                                <span className="text-xs text-amber-600">
                                  🟡 Ainda abaixo do baseline
                                </span>
                              )}
                              {entry.zone === 'red' && (
                                <span className="text-xs text-red-600">
                                  🔴 Caiu para zona vermelha
                                </span>
                              )}
                            </div>

                            {/* Note */}
                            {entry.note && (
                              <div className="mt-3 p-2 rounded-lg bg-white/50 border border-slate-200">
                                <p className="text-sm text-slate-700 italic">
                                  "{entry.note}"
                                  {entry.noteAuthor && (
                                    <span className="text-slate-500 not-italic"> - {entry.noteAuthor}</span>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-3 px-2 text-slate-700 font-semibold">Data</th>
                        <th className="text-left py-3 px-2 text-slate-700 font-semibold">Atleta</th>
                        <th className="text-left py-3 px-2 text-slate-700 font-semibold">Valor</th>
                        <th className="text-left py-3 px-2 text-slate-700 font-semibold">Zona</th>
                        <th className="text-left py-3 px-2 text-slate-700 font-semibold">Variação</th>
                        <th className="text-left py-3 px-2 text-slate-700 font-semibold">Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_HISTORY.map((entry) => (
                        <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-2 text-slate-600">
                            {entry.date} {entry.time}
                          </td>
                          <td className="py-3 px-2 text-slate-900 font-medium">
                            {entry.athleteName}
                          </td>
                          <td className="py-3 px-2 text-slate-900 font-semibold">
                            {entry.value}{entry.unit}
                          </td>
                          <td className="py-3 px-2">
                            {entry.zone === 'green' && '🟢'}
                            {entry.zone === 'yellow' && '🟡'}
                            {entry.zone === 'red' && '🔴'}
                          </td>
                          <td className={`py-3 px-2 font-medium ${
                            entry.change > 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {entry.changeLabel}
                          </td>
                          <td className="py-3 px-2 text-slate-600 text-xs max-w-xs truncate">
                            {entry.note || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </div>

            {/* Footer - SEMPRE VISÍVEL */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Mostrando {filteredHistory.length} entradas
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onExport('csv')}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" />
                    Exportar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
