import { motion } from 'motion/react';
import {
  Calendar,
  FileText,
  BarChart3,
  MessageCircle,
  MoreVertical,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Athlete, ATHLETE_STATUS_LABELS, RISK_LEVEL_LABELS, AVAILABILITY_LABELS } from '@/types/athlete-profile';

interface IdentityHeaderProps {
  athlete: Athlete;
  onScheduleSession: () => void;
  onApplyTemplate: () => void;
  onCreateReport: () => void;
  onOpenReports: () => void;
  onMessage: () => void;
}

export function IdentityHeader({
  athlete,
  onScheduleSession,
  onApplyTemplate,
  onCreateReport,
  onOpenReports,
  onMessage
}: IdentityHeaderProps) {
  // Status badge config
  const statusConfig = {
    active: { color: 'emerald', icon: CheckCircle },
    rehab: { color: 'amber', icon: Activity },
    paused: { color: 'slate', icon: Clock },
    churned: { color: 'red', icon: AlertCircle }
  };

  const riskConfig = {
    low: { color: 'emerald', label: 'Baixo' },
    medium: { color: 'amber', label: 'Médio' },
    high: { color: 'red', label: 'Alto' },
    critical: { color: 'red', label: 'Crítico' }
  };

  const availabilityConfig = {
    available: { color: 'emerald', icon: CheckCircle },
    limited: { color: 'amber', icon: AlertCircle },
    unavailable: { color: 'red', icon: AlertCircle }
  };

  const StatusIcon = statusConfig[athlete.status].icon;
  const AvailabilityIcon = availabilityConfig[athlete.availability].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Photo + Identity */}
          <div className="flex items-start gap-4">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              {athlete.photo_url ? (
                <img
                  src={athlete.photo_url}
                  alt={athlete.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}

              {/* Online Indicator (if applicable) */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Name & Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {athlete.name}
              </h1>

              {/* Sport Context */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-3">
                {athlete.sport && (
                  <span className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    {athlete.sport}
                  </span>
                )}
                {athlete.position && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{athlete.position}</span>
                  </>
                )}
                {athlete.level && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{athlete.level}</span>
                  </>
                )}
                {athlete.team && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{athlete.team}</span>
                  </>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-${statusConfig[athlete.status].color}-100 text-${statusConfig[athlete.status].color}-700`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {ATHLETE_STATUS_LABELS[athlete.status]}
                </span>

                {/* Risk Badge */}
                {athlete.risk_level !== 'low' && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-${riskConfig[athlete.risk_level].color}-100 text-${riskConfig[athlete.risk_level].color}-700`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    Risco: {riskConfig[athlete.risk_level].label}
                  </span>
                )}

                {/* Availability Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-${availabilityConfig[athlete.availability].color}-100 text-${availabilityConfig[athlete.availability].color}-700`}
                >
                  <AvailabilityIcon className="w-4 h-4" />
                  {AVAILABILITY_LABELS[athlete.availability]}
                </span>

                {/* Segment */}
                {athlete.segment && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-violet-100 text-violet-700">
                    {athlete.segment}
                  </span>
                )}

                {/* Plan Type */}
                {athlete.plan_type && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700">
                    {athlete.plan_type}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Primary Actions */}
          <div className="flex flex-col gap-2 lg:ml-auto lg:items-end">
            {/* Top Row Actions */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onScheduleSession}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Agendar Sessão</span>
                <span className="sm:hidden">Agendar</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onApplyTemplate}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Aplicar Template</span>
                <span className="sm:hidden">Template</span>
              </motion.button>
            </div>

            {/* Bottom Row Actions */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreateReport}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-violet-200 text-violet-700 text-sm font-semibold rounded-xl hover:bg-violet-50 transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Criar Relatório</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenReports}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Relatórios</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onMessage}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Mensagem</span>
              </motion.button>

              {/* More Menu */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center w-10 h-10 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
              >
                <MoreVertical className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Strip (opcional - quick stats) */}
      <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>
              <span className="font-semibold text-slate-900">12</span> sessões este mês
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>
              <span className="font-semibold text-slate-900">87%</span> aderência
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>
              <span className="font-semibold text-emerald-600">3</span> recordes este ano
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}