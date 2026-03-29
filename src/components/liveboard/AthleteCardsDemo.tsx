/**
 * ATHLETE CARDS DEMO
 * Página de demonstração dos Athlete Cards com dados mock
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AthleteCard, type AthleteCardData } from './AthleteCard';
import { Grid3x3, List } from 'lucide-react';

export function AthleteCardsDemo() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock athletes data
  const athletes: AthleteCardData[] = [
    {
      id: '1',
      name: 'João Silva',
      position: 'Guarda-redes',
      photo: undefined,
      lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      metrics: [
        {
          id: 'm1',
          name: 'Squat 1RM',
          value: 150,
          unit: 'kg',
          status: 'green',
          change: 5,
          changeLabel: '+5kg',
          category: 'strength',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'm2',
          name: 'Bench Press',
          value: 100,
          unit: 'kg',
          status: 'red',
          change: -10,
          changeLabel: '-10kg',
          category: 'strength',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'm3',
          name: 'Qualidade Sono',
          value: 4,
          unit: '/10',
          status: 'red',
          change: -2,
          changeLabel: '-2',
          category: 'wellness',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'm4',
          name: 'Fadiga',
          value: 8,
          unit: '/10',
          status: 'red',
          change: 3,
          changeLabel: '+3',
          category: 'wellness',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'm5',
          name: 'Velocidade',
          value: 32,
          unit: 'km/h',
          status: 'green',
          change: 0,
          changeLabel: '=',
          category: 'performance',
          lastUpdated: new Date().toISOString(),
        },
      ],
      alerts: [
        {
          id: 'a1',
          type: 'critical',
          message: 'Bench press caiu 10kg - avaliar técnica ou fadiga',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isResolved: false,
        },
        {
          id: 'a2',
          type: 'critical',
          message: '2 noites seguidas com sono <5/10',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isResolved: false,
        },
      ],
      aiSuggestion: {
        id: 's1',
        type: 'health',
        message: 'Priorizar recuperação. Considerar dia leve de treino.',
        confidence: 87,
        actions: [
          'Reduzir volume de treino em 40%',
          'Focar em trabalho técnico leve',
          'Aumentar tempo de sono para 8h+',
          'Avaliar nutrição e hidratação',
        ],
      },
    },
    {
      id: '2',
      name: 'Pedro Costa',
      position: 'Médio',
      photo: undefined,
      lastUpdate: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15min ago
      metrics: [
        {
          id: 'm6',
          name: 'Squat 1RM',
          value: 180,
          unit: 'kg',
          status: 'green',
          change: 15,
          changeLabel: '+15kg',
          baseline: 165,
          category: 'strength',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'm7',
          name: 'Velocidade',
          value: 35,
          unit: 'km/h',
          status: 'green',
          change: 2,
          changeLabel: '+2km/h',
          category: 'performance',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'm8',
          name: 'Qualidade Sono',
          value: 8,
          unit: '/10',
          status: 'green',
          change: 0,
          changeLabel: '=',
          category: 'wellness',
          lastUpdated: new Date().toISOString(),
        },
      ],
      alerts: [],
      aiSuggestion: {
        id: 's2',
        type: 'performance',
        message: 'Performance excecional. Considerar aumentar desafios.',
        confidence: 92,
        actions: [
          'Aumentar carga progressivamente (+5-10%)',
          'Introduzir exercícios de maior complexidade',
          'Manter regime atual de recuperação',
        ],
      },
    },
    {
      id: '3',
      name: 'Maria Santos',
      position: 'Defesa',
      photo: undefined,
      lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      metrics: [
        {
          id: 'm9',
          name: 'Dor Joelho',
          value: 2,
          unit: '/10',
          status: 'green',
          change: -3,
          changeLabel: '-3',
          category: 'wellness',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'm10',
          name: 'Amplitude Movimento',
          value: 85,
          unit: '%',
          status: 'yellow',
          change: 5,
          changeLabel: '+5%',
          category: 'readiness',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'm11',
          name: 'Força Lesionada',
          value: 60,
          unit: '%',
          status: 'red',
          change: 10,
          changeLabel: '+10%',
          category: 'strength',
          lastUpdated: new Date().toISOString(),
        },
      ],
      alerts: [
        {
          id: 'a3',
          type: 'attention',
          message: 'Força ainda abaixo de 80% - continuar fisioterapia',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isResolved: false,
        },
      ],
      aiSuggestion: {
        id: 's3',
        type: 'prevention',
        message: 'Recuperação no caminho certo. Manter plano atual.',
        confidence: 78,
        actions: [
          'Continuar fisioterapia 2x/dia',
          'Treino upper body apenas',
          'Reavaliação médica segunda-feira',
        ],
      },
    },
  ];

  // Handlers
  const handleAddData = (athleteId: string, metricId?: string) => {
    toast.info(`➕ Adicionar dados para atleta ${athleteId}${metricId ? ` - métrica ${metricId}` : ''}`);
  };

  const handleViewDetails = (athleteId: string) => {
    toast.info(`📊 Ver detalhes do atleta ${athleteId}`);
  };

  const handleCompare = (athleteId: string) => {
    toast.info(`📋 Comparar atleta ${athleteId}`);
  };

  const handleRefresh = async (athleteId: string) => {
    toast.success(`🔄 Dados do atleta ${athleteId} atualizados!`);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    toast.success(`✅ Sugestão ${suggestionId} aplicada!`);
  };

  const handleIgnoreSuggestion = (suggestionId: string) => {
    toast.info(`❌ Sugestão ${suggestionId} ignorada`);
  };

  const handleResolveAlert = (alertId: string) => {
    toast.success(`✅ Alerta ${alertId} resolvido!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-slate-900 mb-1">🏃 Athlete Cards Demo</h1>
            <p className="text-sm text-slate-500">
              {athletes.length} atletas • Live Board
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 p-1 rounded-xl bg-white border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-sky-100 text-sky-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-sky-100 text-sky-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {athletes.map((athlete, index) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              index={index}
              viewMode={viewMode === 'list' ? 'full' : 'compact'}
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
      </div>
    </div>
  );
}
