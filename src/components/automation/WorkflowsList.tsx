import { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  ChevronDown,
  Play,
  Pause,
  Edit,
  MoreVertical,
  Copy,
  Trash2,
  Eye,
  Clock,
  Zap,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger: { type: string; label: string; icon: any };
  scope: string;
  timing: string;
  stats: {
    executions: number;
    successRate: number;
    lastRun?: string;
  };
  health: 'healthy' | 'warning' | 'error';
  category: string;
}

interface WorkflowsListProps {
  onEdit: (workflowId: string) => void;
  onCreateNew: () => void;
}

export function WorkflowsList({ onEdit, onCreateNew }: WorkflowsListProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockWorkflows: Workflow[] = [
    {
      id: '1',
      name: 'Lembrete de Sessão (24h antes)',
      description: 'Envia email e push 24h antes da sessão agendada',
      status: 'active',
      trigger: { type: 'session_scheduled', label: 'Sessão Agendada', icon: Calendar },
      scope: 'Equipa A · Premium',
      timing: '24h antes',
      stats: { executions: 1247, successRate: 98.5, lastRun: 'Há 2 horas' },
      health: 'healthy',
      category: 'Sessions'
    },
    {
      id: '2',
      name: 'Follow-up Pós-Treino',
      description: 'Pede RPE e wellness 2h após sessão completada',
      status: 'active',
      trigger: { type: 'session_completed', label: 'Sessão Completa', icon: CheckCircle },
      scope: 'Todos os atletas',
      timing: '2h depois',
      stats: { executions: 892, successRate: 94.2, lastRun: 'Há 5 minutos' },
      health: 'healthy',
      category: 'Forms'
    },
    {
      id: '3',
      name: 'Lembrete de Pagamento',
      description: 'Notifica 3 dias antes do vencimento',
      status: 'active',
      trigger: { type: 'payment_due', label: 'Pagamento Pendente', icon: Clock },
      scope: 'Mensalidades',
      timing: '3 dias antes',
      stats: { executions: 156, successRate: 89.1, lastRun: 'Há 1 dia' },
      health: 'warning',
      category: 'Finance'
    },
    {
      id: '4',
      name: 'Re-engagement (Inatividade)',
      description: 'Série de 3 emails quando atleta fica inativo 7 dias',
      status: 'paused',
      trigger: { type: 'athlete_inactive', label: 'Atleta Inativo', icon: AlertCircle },
      scope: 'Todos exceto trial',
      timing: '7 dias',
      stats: { executions: 43, successRate: 76.3 },
      health: 'healthy',
      category: 'Engagement'
    },
    {
      id: '5',
      name: 'Onboarding Novo Atleta',
      description: 'Sequência de boas-vindas com 5 touchpoints',
      status: 'active',
      trigger: { type: 'athlete_created', label: 'Atleta Criado', icon: Zap },
      scope: 'Todos novos',
      timing: 'Imediato',
      stats: { executions: 67, successRate: 100, lastRun: 'Há 3 horas' },
      health: 'healthy',
      category: 'Onboarding'
    },
    {
      id: '6',
      name: 'Alerta Carga Alta',
      description: 'Notifica coach quando carga semanal > threshold',
      status: 'draft',
      trigger: { type: 'metric_threshold', label: 'Métrica Threshold', icon: TrendingUp },
      scope: 'Equipa A',
      timing: 'Real-time',
      stats: { executions: 0, successRate: 0 },
      health: 'healthy',
      category: 'Performance'
    }
  ];

  const filteredWorkflows = mockWorkflows.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    paused: 'bg-amber-100 text-amber-700',
    draft: 'bg-slate-100 text-slate-700'
  };

  const healthIcons = {
    healthy: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-600" />,
    error: <XCircle className="w-4 h-4 text-red-600" />
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Procurar workflows..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS BAR */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200"
        >
          <div className="flex gap-1">
            {['all', 'active', 'paused', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredWorkflows.map((workflow, index) => {
            const TriggerIcon = workflow.trigger.icon;
            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 truncate">{workflow.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[workflow.status]}`}>
                        {workflow.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{workflow.description}</p>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-sky-50 border border-sky-200 rounded-lg">
                    <TriggerIcon className="w-3.5 h-3.5 text-sky-600" />
                    <span className="text-xs font-medium text-sky-700">{workflow.trigger.label}</span>
                  </div>
                  <div className="px-2 py-1 bg-violet-50 border border-violet-200 rounded-lg">
                    <span className="text-xs font-medium text-violet-700">{workflow.scope}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">{workflow.timing}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Execuções</p>
                    <p className="font-semibold text-slate-900">{workflow.stats.executions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Success Rate</p>
                    <p className="font-semibold text-emerald-600">{workflow.stats.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Last Run</p>
                    <p className="text-xs font-medium text-slate-700">{workflow.stats.lastRun || 'N/A'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {healthIcons[workflow.health]}
                    <span className="text-xs font-medium text-slate-600">
                      {workflow.health === 'healthy' ? 'Healthy' : workflow.health === 'warning' ? 'Warnings' : 'Errors'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toast.info('Simulate mode')}
                      className="p-2 hover:bg-sky-50 rounded-lg text-sky-600 transition-colors"
                      title="Simulate"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(workflow.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="View Runs">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Empty State */}
          {filteredWorkflows.length === 0 && (
            <div className="col-span-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Nenhum workflow encontrado</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery ? 'Tenta outra pesquisa' : 'Cria a tua primeira automação'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onCreateNew}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Criar Automação
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Trigger</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Execuções</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Success %</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Health</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkflows.map((workflow) => {
                  const TriggerIcon = workflow.trigger.icon;
                  return (
                    <tr key={workflow.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 text-sm">{workflow.name}</p>
                        <p className="text-xs text-slate-500">{workflow.scope}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TriggerIcon className="w-4 h-4 text-sky-600" />
                          <span className="text-sm text-slate-700">{workflow.trigger.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[workflow.status]}`}>
                          {workflow.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-slate-900">{workflow.stats.executions.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-emerald-600">{workflow.stats.successRate}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {healthIcons[workflow.health]}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 hover:bg-slate-100 rounded" title="Simulate">
                            <Play className="w-4 h-4 text-sky-600" />
                          </button>
                          <button
                            onClick={() => onEdit(workflow.id)}
                            className="p-1.5 hover:bg-slate-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
