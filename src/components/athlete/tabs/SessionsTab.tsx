/**
 * SESSIONS TAB - FASE 1 INTEGRATED ✅
 * Lista de sessões completadas e agendadas do atleta
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Calendar, Clock, TrendingUp, CheckCircle, 
  Circle, XCircle, Filter, Search, Play, Eye, MoreVertical
} from 'lucide-react';
import { formatDate, formatTime } from '@/lib/mockData';
import { useSessions } from '@/hooks/use-api';
import { toast } from 'sonner@2.0.3';

interface SessionsTabProps {
  athleteId: string;
}

export function SessionsTab({ athleteId }: SessionsTabProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'scheduled' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ INTEGRATED: Using real API hook
  const { sessions: allSessions, isLoading } = useSessions('workspace-demo', { athleteId });

  // Filter sessions
  const filteredSessions = (allSessions || []).filter(session => {
    const matchesFilter = filter === 'all' || session.status === filter;
    const matchesSearch = 
      searchQuery === '' ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completado',
          color: 'bg-emerald-500',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          icon: CheckCircle
        };
      case 'scheduled':
        return {
          label: 'Agendado',
          color: 'bg-sky-500',
          textColor: 'text-sky-700',
          bgColor: 'bg-sky-50',
          icon: Calendar
        };
      case 'in_progress':
        return {
          label: 'Em Progresso',
          color: 'bg-amber-500',
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          icon: Circle
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          icon: XCircle
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'bg-slate-500',
          textColor: 'text-slate-700',
          bgColor: 'bg-slate-50',
          icon: Circle
        };
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      training: 'Treino',
      game: 'Jogo',
      rehabilitation: 'Reabilitação',
      assessment: 'Avaliação',
      other: 'Outro'
    };
    return types[type] || type;
  };

  const getLoadColor = (load: number) => {
    if (load >= 85) return 'text-red-600';
    if (load >= 70) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getRPEColor = (rpe: number) => {
    if (rpe >= 8) return 'text-red-600 bg-red-50';
    if (rpe >= 6) return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  // Stats
  const stats = {
    total: allSessions?.length || 0,
    completed: allSessions?.filter(s => s.status === 'completed').length || 0,
    scheduled: allSessions?.filter(s => s.status === 'scheduled').length || 0,
    avgRPE: allSessions && allSessions.length > 0
      ? allSessions
          .filter(s => s.rpe)
          .reduce((sum, s) => sum + (s.rpe || 0), 0) / 
          (allSessions.filter(s => s.rpe).length || 1)
      : 0
  };

  // ✅ LOADING STATE
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm animate-pulse"
            >
              <div className="h-3 bg-slate-200 rounded w-20 mb-2" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>

        {/* Sessions Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-slate-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Total Sessões
          </p>
          <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Completadas
          </p>
          <p className="text-2xl font-semibold text-slate-900">{stats.completed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Agendadas
          </p>
          <p className="text-2xl font-semibold text-slate-900">{stats.scheduled}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50/90 to-white/90 p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            RPE Médio
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {stats.avgRPE ? stats.avgRPE.toFixed(1) : 'N/A'}
          </p>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Procurar sessões..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'completed', 'scheduled', 'cancelled'] as const).map((status) => {
              const isActive = filter === status;
              const labels = {
                all: 'Todas',
                completed: 'Completadas',
                scheduled: 'Agendadas',
                cancelled: 'Canceladas'
              };

              return (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/30'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {labels[status]}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center"
        >
          <Zap className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-2">Nenhuma sessão encontrada</h3>
          <p className="text-sm text-slate-600">
            {searchQuery 
              ? 'Tente ajustar os filtros de pesquisa' 
              : 'Ainda não há sessões registadas'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSessions.map((session, index) => {
            const statusConfig = getStatusConfig(session.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Session Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Icon */}
                    <div className={`h-12 w-12 rounded-xl ${statusConfig.color} flex items-center justify-center flex-shrink-0`}>
                      <Zap className="h-6 w-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title & Type */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-semibold text-slate-900">
                          {session.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {getTypeLabel(session.type)}
                        </span>
                      </div>

                      {/* Description */}
                      {session.description && (
                        <p className="text-sm text-slate-600 mb-2">
                          {session.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        {/* Date/Time */}
                        {session.completedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(session.completedAt)}</span>
                            <span>•</span>
                            <span>{formatTime(session.completedAt)}</span>
                          </div>
                        )}

                        {/* Duration */}
                        {session.actualDurationMinutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{session.actualDurationMinutes}min</span>
                          </div>
                        )}

                        {/* RPE */}
                        {session.rpe && (
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${getRPEColor(session.rpe)}`}>
                            <span className="font-medium">RPE: {session.rpe}/10</span>
                          </div>
                        )}

                        {/* Load */}
                        {session.loadPercentage && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className={`h-3 w-3 ${getLoadColor(session.loadPercentage)}`} />
                            <span className={`font-medium ${getLoadColor(session.loadPercentage)}`}>
                              {session.loadPercentage}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {session.coachNotes && session.status === 'completed' && (
                        <div className="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-xl">
                          <p className="text-xs font-medium text-sky-900 mb-1">📝 Notas do Coach:</p>
                          <p className="text-xs text-sky-700">{session.coachNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {session.status === 'scheduled' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toast.info('🚀 Função "Iniciar Sessão Live" será implementada em breve!')}
                          className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/30"
                          title="Iniciar Sessão"
                        >
                          <Play className="h-4 w-4 text-white" />
                        </motion.button>
                      )}
                      
                      {session.status === 'completed' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toast.info('👁️ Ver detalhes completos da sessão', {
                            description: `${session.title} - ${formatDate(session.completedAt || '')}`
                          })}
                          className="h-8 w-8 rounded-lg border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 flex items-center justify-center transition-colors"
                          title="Ver Detalhes"
                        >
                          <Eye className="h-4 w-4 text-slate-600" />
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toast.info('⚙️ Menu de opções', {
                          description: 'Editar, Duplicar, Exportar, Eliminar...'
                        })}
                        className="h-8 w-8 rounded-lg border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 flex items-center justify-center transition-colors"
                        title="Mais opções"
                      >
                        <MoreVertical className="h-4 w-4 text-slate-600" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}