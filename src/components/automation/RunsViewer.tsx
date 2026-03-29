import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Calendar,
  User,
  Zap,
  ChevronRight,
  Play,
  RotateCcw,
  Download
} from 'lucide-react';

export function RunsViewer() {
  const [selectedRun, setSelectedRun] = useState<string | null>('run_1');

  const mockRuns = [
    {
      id: 'run_1',
      workflow: 'Lembrete Sessão 24h',
      athlete: 'João Silva',
      trigger: 'Session Scheduled',
      status: 'success',
      timestamp: 'Há 2 horas',
      duration: '1.2s',
      steps: 5
    },
    {
      id: 'run_2',
      workflow: 'Follow-up Pós-Treino',
      athlete: 'Maria Santos',
      trigger: 'Session Completed',
      status: 'success',
      timestamp: 'Há 5 minutos',
      duration: '0.8s',
      steps: 3
    },
    {
      id: 'run_3',
      workflow: 'Lembrete Pagamento',
      athlete: 'Pedro Costa',
      trigger: 'Payment Due',
      status: 'failed',
      timestamp: 'Há 1 hora',
      duration: '2.1s',
      steps: 4
    }
  ];

  const runTimeline = [
    { step: 'Trigger', status: 'success', duration: '0.1s', details: 'Session scheduled for 2024-12-20' },
    { step: 'Scope Match', status: 'success', duration: '0.2s', details: 'Athlete matches: Equipa A, Premium' },
    { step: 'Guard Pass', status: 'success', duration: '0.1s', details: 'Not in quiet hours, cooldown OK' },
    { step: 'Send Email', status: 'success', duration: '0.5s', details: 'Email sent to joao@example.com' },
    { step: 'Send Push', status: 'success', duration: '0.3s', details: 'Push notification delivered' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* RUNS LIST */}
      <div className="lg:col-span-1 space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Execuções Recentes</h3>
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <Filter className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="space-y-2">
          {mockRuns.map((run, index) => (
            <motion.button
              key={run.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedRun(run.id)}
              className={`
                w-full p-4 rounded-xl border-2 transition-all text-left
                ${selectedRun === run.id
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 bg-white hover:border-sky-300'
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{run.workflow}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{run.athlete}</p>
                </div>
                {run.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {run.timestamp}
                </span>
                <span>{run.duration}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* RUN DETAIL */}
      {selectedRun && (
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Lembrete Sessão 24h</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Run ID: {selectedRun} • Há 2 horas
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                Success
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Atleta</p>
                <p className="font-medium text-slate-900">João Silva</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Trigger</p>
                <p className="font-medium text-slate-900">Session Scheduled</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Duration</p>
                <p className="font-medium text-slate-900">1.2s</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h4 className="font-bold text-slate-900 mb-4">Timeline</h4>
            <div className="space-y-3">
              {runTimeline.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${step.status === 'success' ? 'bg-emerald-100' : 'bg-red-100'}
                    `}>
                      {step.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    {index < runTimeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-200 my-1" />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-900 text-sm">{step.step}</p>
                      <span className="text-xs text-slate-500">{step.duration}</span>
                    </div>
                    <p className="text-sm text-slate-600">{step.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 font-semibold text-sm hover:bg-sky-100 transition-all">
              <RotateCcw className="w-4 h-4" />
              Replay
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-violet-200 bg-violet-50 text-violet-700 font-semibold text-sm hover:bg-violet-100 transition-all">
              <Play className="w-4 h-4" />
              Dry Run
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
