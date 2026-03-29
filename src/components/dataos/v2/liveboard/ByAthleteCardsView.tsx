/**
 * BY ATHLETE CARDS VIEW - Live Board
 * Vista de cards individuais dos atletas com métricas completas
 */

'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Filter, SortAsc, Grid3x3, List, Search } from 'lucide-react';
import { AthleteCard, type AthleteCardData } from '@/components/liveboard';
import type { AthleteMetric, Alert, AISuggestion, OverallStatus } from '@/lib/athleteUtils';
import type { Metric } from '@/types/metrics';

interface Athlete {
  id: string;
  name: string;
  sport: string;
  age: number;
}

interface ByAthleteCardsViewProps {
  athletes: Athlete[];
  metrics: Metric[];
  values: any[];
  onUpdateValue?: (athleteId: string, metricId: string, value: any) => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

type ViewLayout = 'grid' | 'list';
type SortBy = 'name' | 'status' | 'alerts' | 'sport';
type FilterStatus = 'all' | 'excellent' | 'attention' | 'critical';

export function ByAthleteCardsView({
  athletes,
  metrics,
  values,
  onUpdateValue,
  isMobile = false,
  isTablet = false,
}: ByAthleteCardsViewProps) {
  const [layout, setLayout] = useState<ViewLayout>(isMobile ? 'list' : 'grid');
  const [sortBy, setSortBy] = useState<SortBy>('status');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate mock athlete cards data
  const athleteCards: AthleteCardData[] = useMemo(() => {
    return athletes.map((athlete, index) => {
      // Generate mock metrics for this athlete
      const athleteMetrics: AthleteMetric[] = metrics.slice(0, 5).map((metric, mIndex) => {
        const baseValue = 100 + Math.random() * 50;
        const change = (Math.random() - 0.5) * 20;
        
        // Status logic based on change
        let status: 'green' | 'yellow' | 'red' = 'green';
        if (Math.abs(change) > 15) status = 'red';
        else if (Math.abs(change) > 8) status = 'yellow';

        // Make some metrics critical for demo
        if (index === 0 && mIndex < 2) status = 'red'; // João - critical
        if (index === 1 && mIndex === 2) status = 'yellow'; // Maria - attention

        return {
          id: `${athlete.id}-${metric.id}`,
          name: metric.name,
          value: Math.round(baseValue),
          unit: metric.unit || 'kg',
          status,
          change: Math.round(change),
          changeLabel: change > 0 ? `+${Math.round(change)}` : `${Math.round(change)}`,
          category: (metric.category || 'strength') as any,
          lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
      });

      // Generate mock alerts
      const alerts: Alert[] = [];
      const criticalMetrics = athleteMetrics.filter(m => m.status === 'red');
      
      criticalMetrics.forEach((metric, i) => {
        alerts.push({
          id: `alert-${athlete.id}-${i}`,
          type: 'critical',
          message: `${metric.name} ${metric.change > 0 ? 'aumentou' : 'caiu'} ${Math.abs(metric.change)}${metric.unit}`,
          metricId: metric.id,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          isResolved: false,
        });
      });

      // Add wellness alerts for some athletes
      if (index === 0) {
        alerts.push({
          id: `alert-${athlete.id}-wellness`,
          type: 'critical',
          message: '2 noites seguidas com sono <5/10',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isResolved: false,
        });
      }

      // Generate AI suggestion based on status
      let aiSuggestion: AISuggestion | undefined;
      
      if (criticalMetrics.length >= 2) {
        aiSuggestion = {
          id: `suggestion-${athlete.id}`,
          type: 'health',
          message: 'Priorizar recuperação. Considerar dia leve de treino.',
          confidence: 85 + Math.floor(Math.random() * 10),
          actions: [
            'Reduzir volume de treino em 40%',
            'Focar em trabalho técnico leve',
            'Aumentar tempo de sono para 8h+',
            'Avaliar nutrição e hidratação',
          ],
        };
      } else if (criticalMetrics.length === 0 && athleteMetrics.filter(m => m.status === 'green').length >= 4) {
        aiSuggestion = {
          id: `suggestion-${athlete.id}`,
          type: 'performance',
          message: 'Performance excecional. Considerar aumentar desafios.',
          confidence: 90 + Math.floor(Math.random() * 8),
          actions: [
            'Aumentar carga progressivamente (+5-10%)',
            'Introduzir exercícios de maior complexidade',
            'Manter regime atual de recuperação',
          ],
        };
      } else if (index % 3 === 1) {
        aiSuggestion = {
          id: `suggestion-${athlete.id}`,
          type: 'optimization',
          message: 'Oportunidade de otimização no treino de força.',
          confidence: 78 + Math.floor(Math.random() * 10),
          actions: [
            'Aumentar frequência semanal (+1 sessão)',
            'Focar em exercícios compostos',
            'Monitorar recuperação entre sessões',
          ],
        };
      }

      return {
        id: athlete.id,
        name: athlete.name,
        position: athlete.sport,
        metrics: athleteMetrics,
        alerts,
        aiSuggestion,
        lastUpdate: new Date(Date.now() - Math.random() * 3 * 60 * 60 * 1000).toISOString(),
        isOffline: Math.random() > 0.9, // 10% offline
      };
    });
  }, [athletes, metrics]);

  // Filter and sort
  const filteredAndSortedCards = useMemo(() => {
    let filtered = athleteCards;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(card => {
        const criticalCount = card.metrics.filter(m => m.status === 'red').length;
        const yellowCount = card.metrics.filter(m => m.status === 'yellow').length;

        if (filterStatus === 'excellent') {
          return criticalCount === 0 && yellowCount <= 1;
        } else if (filterStatus === 'attention') {
          return yellowCount >= 2 || criticalCount === 1;
        } else if (filterStatus === 'critical') {
          return criticalCount >= 2;
        }
        return true;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'sport':
          return a.position.localeCompare(b.position);
        case 'alerts':
          return b.alerts.length - a.alerts.length;
        case 'status':
          const getStatusValue = (card: AthleteCardData) => {
            const red = card.metrics.filter(m => m.status === 'red').length;
            const yellow = card.metrics.filter(m => m.status === 'yellow').length;
            return red * 100 + yellow * 10;
          };
          return getStatusValue(b) - getStatusValue(a);
        default:
          return 0;
      }
    });

    return sorted;
  }, [athleteCards, searchQuery, filterStatus, sortBy]);

  // Handlers
  const handleAddData = (athleteId: string, metricId?: string) => {
    const athlete = athletes.find(a => a.id === athleteId);
    const metric = metricId ? metrics.find(m => m.id === metricId) : null;
    
    toast.info(
      `➕ Adicionar dados${metric ? ` - ${metric.name}` : ''}`,
      { description: `Atleta: ${athlete?.name}` }
    );
  };

  const handleViewDetails = (athleteId: string) => {
    const athlete = athletes.find(a => a.id === athleteId);
    toast.info(`📊 Ver detalhes de ${athlete?.name}`);
  };

  const handleCompare = (athleteId: string) => {
    const athlete = athletes.find(a => a.id === athleteId);
    toast.info(`📋 Comparar ${athlete?.name}`);
  };

  const handleRefresh = async (athleteId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('🔄 Dados atualizados!');
  };

  const handleApplySuggestion = (suggestionId: string) => {
    toast.success('✅ Sugestão aplicada!');
  };

  const handleIgnoreSuggestion = (suggestionId: string) => {
    toast.info('❌ Sugestão ignorada');
  };

  const handleResolveAlert = (alertId: string) => {
    toast.success('✅ Alerta resolvido!');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="shrink-0 mb-4 flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Procurar atleta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
        >
          <option value="all">Todos ({athleteCards.length})</option>
          <option value="excellent">🟢 Excelentes</option>
          <option value="attention">🟡 Atenção</option>
          <option value="critical">🔴 Críticos</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
        >
          <option value="status">Ordenar: Status</option>
          <option value="name">Ordenar: Nome</option>
          <option value="sport">Ordenar: Desporto</option>
          <option value="alerts">Ordenar: Alertas</option>
        </select>

        {/* Layout Toggle */}
        {!isMobile && (
          <div className="flex gap-1 p-1 rounded-xl bg-white border border-slate-200">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-all ${
                layout === 'grid'
                  ? 'bg-sky-100 text-sky-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-2 rounded-lg transition-all ${
                layout === 'list'
                  ? 'bg-sky-100 text-sky-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="shrink-0 mb-3 text-sm text-slate-500">
        {filteredAndSortedCards.length === athleteCards.length ? (
          `${athleteCards.length} atletas`
        ) : (
          `${filteredAndSortedCards.length} de ${athleteCards.length} atletas`
        )}
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto">
        <div
          className={`grid gap-4 sm:gap-6 ${
            layout === 'grid'
              ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {filteredAndSortedCards.map((athlete, index) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              index={index}
              viewMode={layout === 'list' ? 'full' : 'compact'}
              onAddData={handleAddData}
              onViewDetails={handleViewDetails}
              onCompare={handleCompare}
              onRefresh={handleRefresh}
              onApplySuggestion={handleApplySuggestion}
              onIgnoreSuggestion={handleIgnoreSuggestion}
              onResolveAlert={handleResolveAlert}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedCards.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-slate-500 mb-2">Nenhum atleta encontrado</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
