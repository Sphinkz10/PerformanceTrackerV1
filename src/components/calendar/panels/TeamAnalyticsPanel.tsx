/**
 * TEAM ANALYTICS PANEL
 * Analytics and insights for team groups
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Clock,
  Activity,
  Target,
  Award
} from 'lucide-react';
import type { TeamAnalytics, TeamGroup } from '@/types/team';

interface TeamAnalyticsPanelProps {
  teamGroup: TeamGroup;
  analytics: TeamAnalytics;
  dateRange: { start: string; end: string; };
}

export function TeamAnalyticsPanel({
  teamGroup,
  analytics,
  dateRange
}: TeamAnalyticsPanelProps) {
  
  // Calculate derived metrics
  const completionRate = analytics.total_events > 0
    ? (analytics.completed_events / analytics.total_events * 100)
    : 0;
  
  const avgEventsPerAthlete = analytics.unique_athletes > 0
    ? (analytics.total_events / analytics.unique_athletes)
    : 0;
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
        <div 
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: teamGroup.color + '20' }}
        >
          <Users className="h-5 w-5" style={{ color: teamGroup.color }} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{teamGroup.name}</h3>
          <p className="text-xs text-slate-600">
            {analytics.unique_athletes} atletas • {analytics.total_events} eventos
          </p>
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Events */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-xl border border-slate-200 bg-gradient-to-br from-sky-50/50 to-white"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-sky-600" />
            <span className="text-xs font-medium text-slate-600">Eventos</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{analytics.total_events}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {analytics.completed_events} completos
          </p>
        </motion.div>
        
        {/* Attendance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-3 rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white"
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-slate-600">Comparência</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {analytics.avg_attendance_rate.toFixed(0)}%
          </p>
          <div className="flex items-center gap-1 mt-1">
            {analytics.trend_participation === 'increasing' ? (
              <>
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">A melhorar</span>
              </>
            ) : analytics.trend_participation === 'decreasing' ? (
              <>
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600 font-medium">A diminuir</span>
              </>
            ) : (
              <span className="text-xs text-slate-600 font-medium">Estável</span>
            )}
          </div>
        </motion.div>
        
        {/* Total Hours */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-xl border border-slate-200 bg-gradient-to-br from-violet-50/50 to-white"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-violet-600" />
            <span className="text-xs font-medium text-slate-600">Horas Totais</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{analytics.total_hours}h</p>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {analytics.avg_hours_per_athlete.toFixed(1)}h por atleta
          </p>
        </motion.div>
        
        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-3 rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white"
        >
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium text-slate-600">Taxa Conclusão</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {completionRate.toFixed(0)}%
          </p>
          <div className="flex items-center gap-1 mt-1">
            {analytics.trend_completion === 'increasing' ? (
              <>
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">A melhorar</span>
              </>
            ) : analytics.trend_completion === 'decreasing' ? (
              <>
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600 font-medium">A diminuir</span>
              </>
            ) : (
              <span className="text-xs text-slate-600 font-medium">Estável</span>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* By Event Type */}
      {Object.keys(analytics.by_event_type).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl border border-slate-200 bg-white"
        >
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-sky-600" />
            Por Tipo de Evento
          </h4>
          
          <div className="space-y-2">
            {Object.entries(analytics.by_event_type)
              .sort(([, a], [, b]) => b.count - a.count)
              .map(([type, data]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-sky-500" />
                    <span className="text-sm text-slate-700 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {data.count} eventos
                    </span>
                    <p className="text-xs text-slate-600">{data.hours}h total</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
      
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200"
      >
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-600 mb-1">Média Eventos/Atleta</p>
            <p className="text-xl font-bold text-slate-900">
              {avgEventsPerAthlete.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Eventos Cancelados</p>
            <p className="text-xl font-bold text-slate-900">
              {analytics.cancelled_events}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
