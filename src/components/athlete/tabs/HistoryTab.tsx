/**
 * HISTORY TAB - FASE 1 INTEGRATED ✅
 * Timeline completa de eventos e atividades do atleta
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  History, Zap, Trophy, Heart, FileText, AlertCircle,
  TrendingUp, Calendar, Filter, Search, CheckCircle, Activity
} from 'lucide-react';
import { formatDate, formatTime } from '@/lib/mockData';
import { useAuditLogs } from '@/hooks/use-api';

interface HistoryTabProps {
  athleteId: string;
}

export function HistoryTab({ athleteId }: HistoryTabProps) {
  const [filter, setFilter] = useState<'all' | 'session' | 'metric_update' | 'goal_achieved' | 'form_submission'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ INTEGRATED: Using real API hook
  const { logs, isLoading } = useAuditLogs('workspace-demo', { athleteId });

  // Convert API logs to history format
  const history = (logs || []).map(log => ({
    id: log.id,
    athleteId: log.entityId,
    eventType: log.action as any,
    title: log.description || `${log.action} - ${log.entityType}`,
    description: log.metadata?.description || '',
    occurredAt: log.timestamp,
    performedBy: log.userId,
    performedByName: log.userName || 'Sistema'
  }));

  // Sort by date (most recent first)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  // Filter history
  const filteredHistory = sortedHistory.filter(event => {
    const matchesFilter = filter === 'all' || event.eventType === filter;
    const matchesSearch = 
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getEventConfig = (type: string) => {
    switch (type) {
      case 'session':
        return {
          icon: Zap,
          color: 'bg-sky-500',
          label: 'Sessão',
          bgColor: 'bg-sky-50',
          textColor: 'text-sky-700'
        };
      case 'metric_update':
        return {
          icon: Activity,
          color: 'bg-violet-500',
          label: 'Métrica',
          bgColor: 'bg-violet-50',
          textColor: 'text-violet-700'
        };
      case 'form_submission':
        return {
          icon: FileText,
          color: 'bg-emerald-500',
          label: 'Formulário',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700'
        };
      case 'report_generated':
        return {
          icon: FileText,
          color: 'bg-amber-500',
          label: 'Relatório',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700'
        };
      case 'injury':
        return {
          icon: Heart,
          color: 'bg-red-500',
          label: 'Lesão',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700'
        };
      case 'goal_achieved':
        return {
          icon: Trophy,
          color: 'bg-amber-500',
          label: 'Meta',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700'
        };
      case 'note_added':
        return {
          icon: FileText,
          color: 'bg-slate-500',
          label: 'Nota',
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-700'
        };
      case 'status_change':
        return {
          icon: AlertCircle,
          color: 'bg-purple-500',
          label: 'Status',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700'
        };
      default:
        return {
          icon: Activity,
          color: 'bg-slate-500',
          label: 'Evento',
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-700'
        };
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return formatDate(dateString);
  };

  // Group by date
  const groupedHistory = filteredHistory.reduce((acc, event) => {
    const date = new Date(event.occurredAt).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof filteredHistory>);

  // Stats
  const stats = {
    total: history.length,
    sessions: history.filter(h => h.eventType === 'session').length,
    goals: history.filter(h => h.eventType === 'goal_achieved').length,
    forms: history.filter(h => h.eventType === 'form_submission').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <History className="h-5 w-5 text-sky-500" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total Eventos
            </p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-emerald-500" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Sessões
            </p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.sessions}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Metas
            </p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.goals}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-violet-500" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Formulários
            </p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.forms}</p>
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
              placeholder="Procurar no histórico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'session', 'goal_achieved', 'form_submission', 'metric_update'] as const).map((eventFilter) => {
              const isActive = filter === eventFilter;
              const labels = {
                all: 'Tudo',
                session: 'Sessões',
                goal_achieved: 'Metas',
                form_submission: 'Forms',
                metric_update: 'Métricas'
              };

              return (
                <motion.button
                  key={eventFilter}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilter(eventFilter)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/30'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {labels[eventFilter]}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      {filteredHistory.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center"
        >
          <History className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-2">Nenhum evento encontrado</h3>
          <p className="text-sm text-slate-600">
            {searchQuery 
              ? 'Tente ajustar os filtros de pesquisa' 
              : 'Ainda não há eventos no histórico'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([date, events], dateIndex) => (
            <div key={date}>
              {/* Date Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + dateIndex * 0.05 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">{date}</h3>
                <div className="flex-1 h-px bg-slate-200" />
              </motion.div>

              {/* Events for this date */}
              <div className="space-y-3 pl-5 border-l-2 border-slate-200 ml-4">
                {events.map((event, eventIndex) => {
                  const config = getEventConfig(event.eventType);
                  const EventIcon = config.icon;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + dateIndex * 0.05 + eventIndex * 0.02 }}
                      className="relative pl-6"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[27px] top-3 h-5 w-5 rounded-full ${config.color} border-2 border-white shadow-md flex items-center justify-center`}>
                        <div className="h-2 w-2 bg-white rounded-full" />
                      </div>

                      {/* Event Card */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`h-10 w-10 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <EventIcon className={`h-5 w-5 ${config.textColor}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-semibold text-slate-900">
                                {event.title}
                              </h4>
                              <span className={`px-2 py-0.5 rounded-md ${config.bgColor} ${config.textColor} text-xs font-medium`}>
                                {config.label}
                              </span>
                            </div>

                            {event.description && (
                              <p className="text-sm text-slate-600 mb-2">
                                {event.description}
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>{formatRelativeTime(event.occurredAt)}</span>
                              {event.performedByName && (
                                <>
                                  <span>•</span>
                                  <span>por {event.performedByName}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}