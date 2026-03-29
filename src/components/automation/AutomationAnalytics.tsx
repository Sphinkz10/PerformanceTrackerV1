import { motion } from 'motion/react';
import { TrendingUp, Activity, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

export function AutomationAnalytics() {
  const stats = [
    { label: 'Total Execuções', value: '12,847', change: '+15.3%', icon: Activity, color: 'sky' },
    { label: 'Success Rate', value: '96.2%', change: '+2.1%', icon: CheckCircle, color: 'emerald' },
    { label: 'Failed Runs', value: '487', change: '-8.5%', icon: XCircle, color: 'red' },
    { label: 'Avg Duration', value: '1.4s', change: '-12.3%', icon: Clock, color: 'violet' }
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                </div>
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change} vs anterior
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-slate-900 mb-4">Execuções nos últimos 30 dias</h3>
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium">Chart coming soon</p>
          </div>
        </div>
      </div>

      {/* Top Workflows */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-slate-900 mb-4">Top Workflows</h3>
        <div className="space-y-3">
          {[
            { name: 'Lembrete Sessão 24h', executions: 4523, rate: 98.5 },
            { name: 'Follow-up Pós-Treino', executions: 3201, rate: 94.2 },
            { name: 'Onboarding Novo Atleta', executions: 892, rate: 100 }
          ].map((workflow, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900 text-sm">{workflow.name}</p>
                <p className="text-xs text-slate-500">{workflow.executions.toLocaleString()} execuções</p>
              </div>
              <span className="text-sm font-bold text-emerald-600">{workflow.rate}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
