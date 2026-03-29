// ============================================
// API: GET /api/packs
// ============================================
// Returns the list of available Metric Packs
// MOCK VERSION - Hardcoded 5 initial packs
// Pages Router version (compatible with hybrid setup)

import type { NextApiRequest, NextApiResponse } from 'next';
import type { MetricPack } from '@/types/packs';

// ============================================
// HARDCODED PACKS DATA
// ============================================

const PACKS: MetricPack[] = [
  // 1. RECOVERY PACK
  {
    id: 'pack-recovery',
    name: 'Recovery Pack',
    category: 'recovery',
    icon: 'Moon',
    color: 'emerald',
    description: 'Monitoriza recuperação física e qualidade de sono para otimizar performance e prevenir overtraining.',
    shortDescription: 'Recuperação física e fisiológica',
    targetUsers: 'Todos os coaches (essencial)',
    difficulty: 'beginner',
    metricsCount: 5,
    metricsIncluded: [
      'HRV',
      'RHR',
      'Sleep Quality',
      'Sleep Duration',
      'Muscle Soreness'
    ],
    updateFrequency: 'Daily (idealmente)',
    estimatedSetupTime: '2 min',
    hasSuggestedForm: true,
    hasSuggestedReport: true,
    hasAutomations: true,
    usageCount: 1247,
    rating: 4.8,
  },

  // 2. LOAD & FATIGUE PACK
  {
    id: 'pack-load',
    name: 'Load & Fatigue Pack',
    category: 'load',
    icon: 'Activity',
    color: 'sky',
    description: 'Monitoriza carga de treino e fadiga acumulada para prevenir overtraining e otimizar periodização.',
    shortDescription: 'Carga de treino e fadiga',
    targetUsers: 'Coaches intermédios/avançados',
    difficulty: 'intermediate',
    metricsCount: 7,
    metricsIncluded: [
      'RPE (Session)',
      'Session Duration',
      'Training Load',
      'ACWR',
      'Training Strain',
      'Monotony',
      'Weekly Volume'
    ],
    updateFrequency: 'Per session + weekly aggregation',
    estimatedSetupTime: '3 min',
    hasSuggestedForm: true,
    hasSuggestedReport: true,
    hasAutomations: true,
    usageCount: 892,
    rating: 4.6,
  },

  // 3. READINESS PACK
  {
    id: 'pack-readiness',
    name: 'Readiness Pack',
    category: 'readiness',
    icon: 'Zap',
    color: 'amber',
    description: 'Avalia prontidão mental e física para treinar/competir através de métricas subjetivas.',
    shortDescription: 'Prontidão mental e física',
    targetUsers: 'Todos os coaches',
    difficulty: 'beginner',
    metricsCount: 6,
    metricsIncluded: [
      'Mental Readiness',
      'Physical Readiness',
      'Energy Level',
      'Stress Level',
      'Motivation Level',
      'Focus Quality'
    ],
    updateFrequency: 'Daily (idealmente antes de treino)',
    estimatedSetupTime: '2 min',
    hasSuggestedForm: true,
    hasSuggestedReport: true,
    hasAutomations: true,
    usageCount: 1056,
    rating: 4.7,
  },

  // 4. PSYCHOLOGICAL PACK
  {
    id: 'pack-psychological',
    name: 'Psychological Pack',
    category: 'psychological',
    icon: 'Brain',
    color: 'violet',
    description: 'Monitoriza bem-estar psicológico e saúde mental para suportar atleta holisticamente.',
    shortDescription: 'Bem-estar psicológico',
    targetUsers: 'Coaches avançados, equipas com psicólogo',
    difficulty: 'advanced',
    metricsCount: 7,
    metricsIncluded: [
      'Overall Mood',
      'Anxiety Level',
      'Confidence Level',
      'Team Cohesion',
      'Life Stress',
      'Sleep Quality (Mental)',
      'Burnout Risk'
    ],
    updateFrequency: 'Daily ou weekly (dependendo da métrica)',
    estimatedSetupTime: '4 min',
    hasSuggestedForm: true,
    hasSuggestedReport: true,
    hasAutomations: false,
    usageCount: 534,
    rating: 4.9,
  },

  // 5. INJURY RISK PACK
  {
    id: 'pack-injury',
    name: 'Injury Risk Pack',
    category: 'injury',
    icon: 'AlertTriangle',
    color: 'red',
    description: 'Monitoriza fatores de risco de lesão para prevenção proativa.',
    shortDescription: 'Prevenção de lesões',
    targetUsers: 'Fisioterapeutas, coaches avançados',
    difficulty: 'advanced',
    metricsCount: 6,
    metricsIncluded: [
      'Pain Level',
      'Movement Quality',
      'Asymmetry Index',
      'Range of Motion',
      'Previous Injury Status',
      'Injury Risk Score'
    ],
    updateFrequency: 'Daily + session',
    estimatedSetupTime: '3 min',
    hasSuggestedForm: true,
    hasSuggestedReport: true,
    hasAutomations: true,
    usageCount: 678,
    rating: 4.5,
  },
];

// ============================================
// API HANDLER
// ============================================

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, difficulty, search } = req.query;

    // Filter packs
    let filteredPacks = [...PACKS];

    if (category && typeof category === 'string') {
      filteredPacks = filteredPacks.filter(p => p.category === category);
    }

    if (difficulty && typeof difficulty === 'string') {
      filteredPacks = filteredPacks.filter(p => p.difficulty === difficulty);
    }

    if (search && typeof search === 'string') {
      const query = search.toLowerCase();
      filteredPacks = filteredPacks.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query)
      );
    }

    // Sort by usage count (most popular first)
    filteredPacks.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));

    return res.status(200).json({
      success: true,
      packs: filteredPacks,
      total: filteredPacks.length
    });

  } catch (error) {
    console.error('Error fetching packs:', error);
    return res.status(500).json({ error: 'Failed to fetch packs' });
  }
}
