/**
 * Workout Changes History - Timeline of all workout changes
 * 
 * Features:
 * - Timeline view with icons
 * - Filter by type (all, canceled, rescheduled, modified)
 * - Date range filter
 * - Export to PDF/CSV
 * - Color-coded by type
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Phase 4
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  XCircle,
  Clock,
  Edit,
  CheckCircle,
  Filter,
  Download,
} from 'lucide-react';

interface WorkoutChange {
  id: string;
  type: 'canceled' | 'rescheduled' | 'modified' | 'completed';
  workoutTitle: string;
  originalDate?: string;
  newDate?: string;
  reason?: string;
  timestamp: string;
  changes?: string;
}

type ChangeFilter = 'all' | 'canceled' | 'rescheduled' | 'modified';

export function WorkoutChangesHistory() {
  const [filter, setFilter] = useState<ChangeFilter>('all');

  const changes: WorkoutChange[] = [
    {
      id: '1',
      type: 'rescheduled',
      workoutTitle: 'Upper Body Strength',
      originalDate: '10 Fev 18:00',
      newDate: '11 Fev 10:00',
      reason: 'Conflito de horário',
      timestamp: 'Há 2 dias',
    },
    {
      id: '2',
      type: 'completed',
      workoutTitle: 'Lower Body + Core',
      timestamp: 'Há 3 dias',
    },
    {
      id: '3',
      type: 'modified',
      workoutTitle: 'Full Body A',
      changes: 'Coach alterou volume de agachamento: 4x8 → 5x5',
      timestamp: 'Há 5 dias',
    },
    {
      id: '4',
      type: 'canceled',
      workoutTitle: 'Upper Body B',
      reason: 'Atleta reportou dor no ombro',
      timestamp: 'Há 1 semana',
    },
    {
      id: '5',
      type: 'completed',
      workoutTitle: 'Lower Body Strength',
      timestamp: 'Há 1 semana',
    },
  ];

  const filters = [
    { id: 'all' as ChangeFilter, label: 'Todas' },
    { id: 'canceled' as ChangeFilter, label: 'Canceladas' },
    { id: 'rescheduled' as ChangeFilter, label: 'Reagendadas' },
    { id: 'modified' as ChangeFilter, label: 'Modificadas' },
  ];

  const getFilteredChanges = () => {
    if (filter === 'all') return changes;
    return changes.filter((c) => c.type === filter);
  };

  const getChangeIcon = (type: WorkoutChange['type']) => {
    switch (type) {
      case 'canceled':
        return XCircle;
      case 'rescheduled':
        return Clock;
      case 'modified':
        return Edit;
      case 'completed':
        return CheckCircle;
    }
  };

  const getChangeColor = (type: WorkoutChange['type']) => {
    switch (type) {
      case 'canceled':
        return 'red';
      case 'rescheduled':
        return 'violet';
      case 'modified':
        return 'amber';
      case 'completed':
        return 'emerald';
    }
  };

  const handleExport = () => {
    // Mock export functionality
    alert('Exportar histórico para PDF/CSV (feature em desenvolvimento)');
  };

  const filteredChanges = getFilteredChanges();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Histórico de Alterações</h3>
          <p className="text-sm text-slate-600">
            {filteredChanges.length} {filteredChanges.length === 1 ? 'alteração' : 'alterações'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
        >
          <Download className="h-4 w-4" />
          Exportar
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="h-4 w-4 text-slate-500 shrink-0" />
        {filters.map((f) => (
          <motion.button
            key={f.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === f.id
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

        {filteredChanges.map((change, idx) => {
          const Icon = getChangeIcon(change.type);
          const color = getChangeColor(change.type);

          return (
            <motion.div
              key={change.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative pl-12"
            >
              {/* Icon */}
              <div
                className={`absolute left-0 h-10 w-10 rounded-full bg-${color}-100 border-4 border-white shadow-md flex items-center justify-center`}
              >
                <Icon className={`h-5 w-5 text-${color}-600`} />
              </div>

              {/* Content */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-bold text-slate-900">{change.workoutTitle}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700`}
                  >
                    {change.type === 'canceled' && 'Cancelado'}
                    {change.type === 'rescheduled' && 'Reagendado'}
                    {change.type === 'modified' && 'Modificado'}
                    {change.type === 'completed' && 'Completado'}
                  </span>
                </div>

                {change.type === 'rescheduled' && (
                  <div className="text-sm text-slate-600 mb-2">
                    <p>
                      <span className="line-through text-slate-400">{change.originalDate}</span>{' '}
                      → <span className="font-medium text-violet-600">{change.newDate}</span>
                    </p>
                  </div>
                )}

                {change.changes && (
                  <p className="text-sm text-slate-600 mb-2">{change.changes}</p>
                )}

                {change.reason && (
                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-medium">Razão:</span> {change.reason}
                  </p>
                )}

                <p className="text-xs text-slate-500">{change.timestamp}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredChanges.length === 0 && (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-medium text-slate-900 mb-1">Sem alterações</p>
          <p className="text-sm text-slate-600">
            Nenhuma alteração nesta categoria
          </p>
        </div>
      )}
    </motion.div>
  );
}
