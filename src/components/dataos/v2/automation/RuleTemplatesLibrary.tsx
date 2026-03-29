/**
 * RULE TEMPLATES LIBRARY
 * Templates prontos + Community sharing
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  Star,
  Download,
  TrendingUp,
  Heart,
  Clock,
  Zap,
  AlertTriangle,
  Users,
  Trophy,
  Activity,
  Target,
  Search,
  Filter,
} from 'lucide-react';
import type { AutomationRule } from './AutomationMain';

interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'recovery' | 'performance' | 'injury' | 'load' | 'wellness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  downloads: number;
  rating: number;
  reviews: number;
  author: string;
  isPremium: boolean;
  rule: Partial<AutomationRule>;
}

interface RuleTemplatesLibraryProps {
  onUseTemplate: (template: AutomationRule) => void;
}

const CATEGORIES = [
  { value: 'all', label: 'All Templates', icon: Package, color: 'slate' },
  { value: 'recovery', label: 'Recovery', icon: Heart, color: 'emerald' },
  { value: 'performance', label: 'Performance', icon: TrendingUp, color: 'sky' },
  { value: 'injury', label: 'Injury Prevention', icon: AlertTriangle, color: 'red' },
  { value: 'load', label: 'Load Management', icon: Activity, color: 'amber' },
  { value: 'wellness', label: 'Wellness', icon: Target, color: 'violet' },
];

const MOCK_TEMPLATES: RuleTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Overtraining Alert',
    description: 'Detecta sinais de overtraining baseado em HRV e fadiga',
    category: 'recovery',
    difficulty: 'beginner',
    icon: '⚠️',
    downloads: 1243,
    rating: 4.8,
    reviews: 89,
    author: 'Performance Lab',
    isPremium: false,
    rule: {
      name: 'Overtraining Alert',
      description: 'Alerta quando HRV < 60ms por 3 dias consecutivos',
      triggerType: 'data',
      triggerConfig: {
        metricId: 'hrv',
        condition: 'below',
        value: 60,
        consecutiveDays: 3,
      },
      actions: [
        {
          id: 'action-1',
          type: 'notification',
          config: {
            channel: 'email',
            message: 'Atleta {athlete_name} com HRV baixo por 3 dias - possível overtraining',
          },
        },
        {
          id: 'action-2',
          type: 'athlete_action',
          config: {
            athleteAction: 'flag',
          },
        },
      ],
    },
  },
  {
    id: 'tmpl-2',
    name: 'Peak Performance Window',
    description: 'Identifica janelas de performance ótima para competições',
    category: 'performance',
    difficulty: 'intermediate',
    icon: '🏆',
    downloads: 876,
    rating: 4.9,
    reviews: 56,
    author: 'Elite Sports Science',
    isPremium: true,
    rule: {
      name: 'Peak Performance Window',
      description: 'Alerta quando múltiplos indicadores estão na zona verde',
      triggerType: 'data',
      actions: [
        {
          id: 'action-1',
          type: 'notification',
          config: {
            channel: 'push',
            message: '{athlete_name} está em janela de performance ótima!',
          },
        },
        {
          id: 'action-2',
          type: 'smart_action',
          config: {
            smartAction: 'suggest_recovery',
          },
        },
      ],
    },
  },
  {
    id: 'tmpl-3',
    name: 'Injury Risk Predictor',
    description: 'Prevê risco de lesão baseado em carga e fadiga acumulada',
    category: 'injury',
    difficulty: 'advanced',
    icon: '🚑',
    downloads: 2341,
    rating: 4.7,
    reviews: 178,
    author: 'Sports Medicine Institute',
    isPremium: true,
    rule: {
      name: 'Injury Risk Predictor',
      description: 'AI-powered injury prediction',
      triggerType: 'data',
      actions: [
        {
          id: 'action-1',
          type: 'smart_action',
          config: {
            smartAction: 'predict_injury',
          },
        },
        {
          id: 'action-2',
          type: 'athlete_action',
          config: {
            athleteAction: 'reduce_load',
          },
        },
        {
          id: 'action-3',
          type: 'notification',
          config: {
            channel: 'email',
            message: 'ALERTA: Risco elevado de lesão para {athlete_name}',
          },
        },
      ],
    },
  },
  {
    id: 'tmpl-4',
    name: 'Weekly Load Summary',
    description: 'Envia resumo semanal de carga automaticamente',
    category: 'load',
    difficulty: 'beginner',
    icon: '📊',
    downloads: 1567,
    rating: 4.6,
    reviews: 112,
    author: 'Load Monitor Pro',
    isPremium: false,
    rule: {
      name: 'Weekly Load Summary',
      description: 'Relatório automático todas as segundas',
      triggerType: 'time',
      triggerConfig: {
        schedule: '0 9 * * 1',
      },
      actions: [
        {
          id: 'action-1',
          type: 'data_action',
          config: {
            dataAction: 'export',
          },
        },
        {
          id: 'action-2',
          type: 'notification',
          config: {
            channel: 'slack',
            message: 'Relatório semanal de carga disponível',
          },
        },
      ],
    },
  },
  {
    id: 'tmpl-5',
    name: 'Sleep Quality Monitor',
    description: 'Monitora qualidade do sono e sugere ajustes',
    category: 'wellness',
    difficulty: 'beginner',
    icon: '😴',
    downloads: 998,
    rating: 4.5,
    reviews: 67,
    author: 'Recovery Hub',
    isPremium: false,
    rule: {
      name: 'Sleep Quality Monitor',
      description: 'Alerta quando sono < 7h por 2 noites consecutivas',
      triggerType: 'data',
      triggerConfig: {
        metricId: 'sleep_hours',
        condition: 'below',
        value: 7,
        consecutiveDays: 2,
      },
      actions: [
        {
          id: 'action-1',
          type: 'notification',
          config: {
            channel: 'push',
            message: '{athlete_name} com sono insuficiente',
          },
        },
        {
          id: 'action-2',
          type: 'smart_action',
          config: {
            smartAction: 'suggest_recovery',
          },
        },
      ],
    },
  },
  {
    id: 'tmpl-6',
    name: 'Smart Load Adjuster',
    description: 'Ajusta carga automaticamente baseado em fadiga',
    category: 'load',
    difficulty: 'advanced',
    icon: '⚙️',
    downloads: 1876,
    rating: 4.9,
    reviews: 145,
    author: 'AI Training Systems',
    isPremium: true,
    rule: {
      name: 'Smart Load Adjuster',
      description: 'Ajusta carga automaticamente quando fadiga > 7',
      triggerType: 'data',
      triggerConfig: {
        metricId: 'fatigue',
        condition: 'above',
        value: 7,
      },
      actions: [
        {
          id: 'action-1',
          type: 'smart_action',
          config: {
            smartAction: 'auto_adjust_load',
          },
        },
        {
          id: 'action-2',
          type: 'notification',
          config: {
            channel: 'push',
            message: 'Carga ajustada para {athlete_name}',
          },
        },
      ],
    },
  },
];

export function RuleTemplatesLibrary({ onUseTemplate }: RuleTemplatesLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent'>('popular');

  const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.downloads - a.downloads;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // recent would use createdAt
  });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-slate-900 mb-1">
            Rule Templates Library
          </h2>
          <p className="text-sm text-slate-500">
            {MOCK_TEMPLATES.length} templates prontos para usar
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Procurar templates..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all appearance-none cursor-pointer"
            >
              <option value="popular">Mais Popular</option>
              <option value="rating">Melhor Rating</option>
              <option value="recent">Mais Recente</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.value;

            return (
              <motion.button
                key={category.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? `bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 text-white shadow-lg`
                    : `bg-${category.color}-50 border-2 border-${category.color}-200 text-${category.color}-700 hover:border-${category.color}-400`
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </motion.button>
            );
          })}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
                onUse={() => {
                  const fullRule: AutomationRule = {
                    id: `rule-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isActive: true,
                    stats: {
                      triggerCount: 0,
                      successRate: 100,
                      falsePositives: 0,
                    },
                    ...template.rule,
                  } as AutomationRule;

                  onUseTemplate(fullRule);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 mb-2">Nenhum template encontrado</h3>
            <p className="text-sm text-slate-500">
              Tenta ajustar os filtros ou a pesquisa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TEMPLATE CARD Component
// ============================================================

function TemplateCard({
  template,
  index,
  onUse,
}: {
  template: RuleTemplate;
  index: number;
  onUse: () => void;
}) {
  const categoryColor =
    CATEGORIES.find((c) => c.value === template.category)?.color || 'slate';

  const difficultyColors = {
    beginner: 'emerald',
    intermediate: 'amber',
    advanced: 'red',
  };

  const difficultyColor = difficultyColors[template.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative p-5 rounded-2xl border-2 border-${categoryColor}-200 bg-gradient-to-br from-${categoryColor}-50 to-white hover:border-${categoryColor}-400 hover:shadow-xl transition-all`}
    >
      {/* Premium Badge */}
      {template.isPremium && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold shadow-lg">
            ✨ Premium
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="text-4xl mb-3">{template.icon}</div>

      {/* Name & Description */}
      <h4 className="font-semibold text-slate-900 mb-2 line-clamp-1">
        {template.name}
      </h4>
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {template.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1 text-amber-600">
          <Star className="h-3 w-3 fill-current" />
          <span className="font-medium">{template.rating}</span>
          <span className="text-slate-400">({template.reviews})</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <Download className="h-3 w-3" />
          <span>{template.downloads}</span>
        </div>

        <span className={`px-2 py-0.5 rounded-full bg-${difficultyColor}-100 text-${difficultyColor}-700 font-medium`}>
          {template.difficulty}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
        <Users className="h-3 w-3 text-slate-400" />
        <span className="text-xs text-slate-500">by {template.author}</span>
      </div>

      {/* Actions Preview */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-700 mb-2">
          {template.rule.actions?.length || 0} Actions
        </p>
        <div className="flex flex-wrap gap-1">
          {template.rule.actions?.slice(0, 3).map((action, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs"
            >
              {action.type.replace('_', ' ')}
            </span>
          ))}
          {(template.rule.actions?.length || 0) > 3 && (
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs">
              +{(template.rule.actions?.length || 0) - 3}
            </span>
          )}
        </div>
      </div>

      {/* Use Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onUse}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-${categoryColor}-500 to-${categoryColor}-600 text-white shadow-lg hover:from-${categoryColor}-400 hover:to-${categoryColor}-500 transition-all`}
      >
        <Download className="h-4 w-4" />
        Use Template
      </motion.button>
    </motion.div>
  );
}
