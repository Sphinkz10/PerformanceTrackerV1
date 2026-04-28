/**
 * ATHLETE HEADER
 * Cabeçalho com foto, dados básicos, status e ações rápidas
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Calendar, Play, FileText, MoreVertical,
  CheckCircle, AlertCircle, Clock, Edit, Share2, Trash2
} from 'lucide-react';
import type { Athlete } from '@/lib/mockData';
import { ScheduleSessionModal } from '@/components/modals/ScheduleSessionModal';
import { toast } from 'sonner@2.0.3';

interface AthleteHeaderProps {
  athlete: Athlete;
  onBack?: () => void;
}

export function AthleteHeader({ athlete, onBack }: AthleteHeaderProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!athlete) {
    return (
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6">
          <div className="h-20 w-64 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return Number.isFinite(age) ? age : null;
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-PT');
  };

  const formatNumber = (value: unknown, suffix: string) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return '—';
    return `${n}${suffix}`;
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'normal':
        return {
          label: 'NORMAL',
          color: 'bg-emerald-500',
          icon: CheckCircle,
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50'
        };
      case 'management':
        return {
          label: 'GESTÃO',
          color: 'bg-amber-500',
          icon: Clock,
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50'
        };
      case 'risk':
        return {
          label: 'RISCO',
          color: 'bg-red-500',
          icon: AlertCircle,
          textColor: 'text-red-700',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          label: 'NORMAL',
          color: 'bg-gray-500',
          icon: CheckCircle,
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const firstName = athlete.firstName?.trim() || 'Atleta';
  const lastName = athlete.lastName?.trim() || '';
  const fullName = `${firstName} ${lastName}`.trim();

  const age = calculateAge(athlete.birthDate);
  const lastUpdate = formatDate(athlete.updatedAt);
  const heightLabel = formatNumber((athlete as any).heightCm, ' cm');
  const weightLabel = formatNumber((athlete as any).weightKg, ' kg');
  const sportLabel = athlete.sport || '—';

  const statusConfig = getStatusConfig(athlete.status);
  const StatusIcon = statusConfig.icon;

  const handleStartSession = () => {
    toast.success('Iniciando sessão ao vivo...', {
      description: `Preparando ambiente para ${firstName}`,
      duration: 2000
    });
  };

  const handleSendForm = () => {
    toast.success('Formulário enviado!', {
      description: `Notificação enviada para ${firstName}`,
      duration: 2000
    });
  };

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {onBack && (
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-700" />
              </motion.button>
            )}

            <div className="relative">
              {athlete.photoUrl ? (
                <img
                  src={athlete.photoUrl}
                  alt={fullName}
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center border-2 border-slate-200 shadow-lg shadow-sky-500/20">
                  <span className="text-2xl font-bold text-white">
                    {(firstName?.[0] ?? '?').toUpperCase()}
                    {(lastName?.[0] ?? '').toUpperCase()}
                  </span>
                </div>
              )}

              <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full ${statusConfig.color} border-2 border-white flex items-center justify-center`}>
                <StatusIcon className="h-3 w-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>

                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </span>

                {(athlete?.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 flex-wrap">
                <span className="font-medium">{age !== null ? `${age} anos` : '—'}</span>
                <span>•</span>
                <span>{heightLabel}</span>
                <span>•</span>
                <span>{weightLabel}</span>
                <span>•</span>
                <span className="font-medium text-sky-600">{sportLabel}</span>
                {athlete.position && (
                  <>
                    <span>•</span>
                    <span>{athlete.position}</span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Última atualização: {lastUpdate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <motion.button
              onClick={() => setShowScheduleModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all text-sm font-semibold flex-1 sm:flex-none"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Agendar</span>
            </motion.button>

            <motion.button
              onClick={handleStartSession}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md text-sm font-semibold flex-1 sm:flex-none"
            >
              <Play className="h-4 w-4" />
              <span>Iniciar Sessão</span>
            </motion.button>

            <motion.button
              onClick={handleSendForm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all text-sm font-semibold"
            >
              <FileText className="h-4 w-4" />
              <span>Formulário</span>
            </motion.button>

            <motion.button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center h-10 w-10 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
            >
              <MoreVertical className="h-5 w-5" />
            </motion.button>

            {showMoreMenu && (
              <div className="absolute right-0 top-12 z-10 bg-white border border-slate-200 shadow-md rounded-md w-48">
                <div className="py-1">
                  <button className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left">
                    <Edit className="h-4 w-4 mr-2 inline" />
                    Editar
                  </button>
                  <button className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left">
                    <Share2 className="h-4 w-4 mr-2 inline" />
                    Compartilhar
                  </button>
                  <button className="block px-4 py-2 text-sm text-red-500 hover:bg-red-100 w-full text-left">
                    <Trash2 className="h-4 w-4 mr-2 inline" />
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScheduleSessionModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onComplete={() => toast.success('Scheduled')}
      />
    </div>
  );
}