/**
 * INJURY DETAILS DRAWER - DAY 6 ✅
 * 
 * Drawer completo para visualizar detalhes de uma lesão,
 * incluindo timeline de recuperação e progresso.
 * 
 * Features:
 * - Current injury card
 * - Recovery progress bar
 * - Timeline visual
 * - Treatment plan display
 * - Training restrictions
 * - Medical clearance status
 * - Recovery updates history
 * - Edit and resolve actions
 * 
 * @author PerformTrack Team
 * @since Day 6 - Injury Tracking Enhancement
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  X, AlertCircle, Calendar, Clock, Activity, 
  CheckCircle, TrendingUp, Edit, Trash2,
  Shield, Stethoscope, FileText, Info,
  Percent, Timer, Target
} from 'lucide-react';
import { Injury } from './CreateInjuryModal';
import { useState } from 'react';

interface InjuryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  injury: Injury;
  onEdit?: (injury: Injury) => void;
  onDelete?: (injuryId: string) => void;
  onUpdateStatus?: (injuryId: string, status: string) => void;
}

export function InjuryDetailsDrawer({
  isOpen,
  onClose,
  injury,
  onEdit,
  onDelete,
  onUpdateStatus
}: InjuryDetailsDrawerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate recovery progress
  const calculateRecoveryProgress = () => {
    if (!injury.expectedRecoveryDays) return 0;
    
    const startDate = new Date(injury.injuryDate);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const progress = Math.min((daysPassed / injury.expectedRecoveryDays) * 100, 100);
    
    return Math.round(progress);
  };

  const recoveryProgress = calculateRecoveryProgress();

  // Calculate days info
  const getDaysInfo = () => {
    const startDate = new Date(injury.injuryDate);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max((injury.expectedRecoveryDays || 0) - daysPassed, 0);
    
    return { daysPassed, daysRemaining };
  };

  const { daysPassed, daysRemaining } = getDaysInfo();

  // Severity config
  const getSeverityConfig = (severity: string) => {
    const configs: Record<string, any> = {
      low: { 
        label: 'Leve', 
        color: 'emerald', 
        bg: 'bg-emerald-500',
        text: 'text-emerald-600',
        bgLight: 'bg-emerald-50',
        border: 'border-emerald-300'
      },
      medium: { 
        label: 'Média', 
        color: 'amber',
        bg: 'bg-amber-500',
        text: 'text-amber-600',
        bgLight: 'bg-amber-50',
        border: 'border-amber-300'
      },
      high: { 
        label: 'Alta', 
        color: 'red',
        bg: 'bg-red-500',
        text: 'text-red-600',
        bgLight: 'bg-red-50',
        border: 'border-red-300'
      },
      critical: { 
        label: 'Crítica', 
        color: 'purple',
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        bgLight: 'bg-purple-50',
        border: 'border-purple-300'
      }
    };
    return configs[severity] || configs.low;
  };

  // Status config
  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      active: { 
        label: 'Ativa', 
        icon: AlertCircle, 
        color: 'red',
        bg: 'bg-red-500',
        text: 'text-red-600',
        bgLight: 'bg-red-50'
      },
      recovering: { 
        label: 'Recuperando', 
        icon: Timer, 
        color: 'amber',
        bg: 'bg-amber-500',
        text: 'text-amber-600',
        bgLight: 'bg-amber-50'
      },
      recovered: { 
        label: 'Recuperada', 
        icon: CheckCircle, 
        color: 'emerald',
        bg: 'bg-emerald-500',
        text: 'text-emerald-600',
        bgLight: 'bg-emerald-50'
      },
      chronic: { 
        label: 'Crónica', 
        icon: Activity, 
        color: 'purple',
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        bgLight: 'bg-purple-50'
      }
    };
    return configs[status] || configs.active;
  };

  const severityConfig = getSeverityConfig(injury.severity);
  const statusConfig = getStatusConfig(injury.recoveryStatus);
  const StatusIcon = statusConfig.icon;

  // Mock timeline events (in production, fetch from API)
  const timelineEvents = [
    {
      date: injury.injuryDate,
      type: 'injury',
      title: 'Lesão Registada',
      description: injury.description,
      icon: AlertCircle,
      color: 'red'
    },
    ...(injury.medicalClearance ? [{
      date: injury.medicalClearanceDate || injury.injuryDate,
      type: 'clearance',
      title: 'Clearance Médico',
      description: 'Atleta autorizado para retorno gradual',
      icon: Shield,
      color: 'emerald'
    }] : []),
    ...(injury.recoveryStatus === 'recovered' ? [{
      date: new Date().toISOString().split('T')[0],
      type: 'recovered',
      title: 'Recuperação Completa',
      description: `Recuperado em ${injury.actualRecoveryDays || daysPassed} dias`,
      icon: CheckCircle,
      color: 'emerald'
    }] : [])
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{injury.bodyPart}</h2>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusConfig.bg} text-white`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-sm text-slate-500 capitalize">{injury.injuryType}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Current Injury Card */}
            <div className={`p-6 rounded-xl border-2 ${severityConfig.border} ${severityConfig.bgLight}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${severityConfig.bg}`}>
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600">Severidade</p>
                    <p className={`text-xl font-bold ${severityConfig.text}`}>{severityConfig.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">Registado em</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(injury.injuryDate).toLocaleDateString('pt-PT', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <p className="text-sm text-slate-700">{injury.description}</p>
              </div>
            </div>

            {/* Recovery Progress */}
            {injury.recoveryStatus !== 'recovered' && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Progresso de Recuperação
                </h3>
                
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Progresso</span>
                      <span className="text-2xl font-bold text-slate-900">{recoveryProgress}%</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${recoveryProgress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${
                          recoveryProgress >= 80 ? 'bg-emerald-500' :
                          recoveryProgress >= 50 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Days Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-slate-50">
                      <p className="text-xs text-slate-600 mb-1">Dias Passados</p>
                      <p className="text-2xl font-bold text-slate-900">{daysPassed}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-emerald-50">
                      <p className="text-xs text-emerald-700 mb-1">Previsão Total</p>
                      <p className="text-2xl font-bold text-emerald-600">{injury.expectedRecoveryDays}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-50">
                      <p className="text-xs text-amber-700 mb-1">Restantes</p>
                      <p className="text-2xl font-bold text-amber-600">{daysRemaining}</p>
                    </div>
                  </div>

                  {/* Expected Recovery Date */}
                  <div className="mt-4 p-3 rounded-lg bg-sky-50 border border-sky-200">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-sky-600" />
                      <div>
                        <p className="text-xs font-medium text-sky-700">Data Prevista de Recuperação</p>
                        <p className="text-sm font-bold text-sky-900">
                          {new Date(new Date(injury.injuryDate).getTime() + (injury.expectedRecoveryDays || 0) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Training Impact */}
            {injury.affectsTraining && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-slate-600" />
                  Impacto no Treino
                </h3>
                
                <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-amber-500">
                      <Percent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-amber-700">Carga Máxima Permitida</p>
                      <p className="text-3xl font-bold text-amber-600">
                        {injury.loadModificationPercentage}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white border border-amber-200">
                    <p className="text-xs text-amber-900 font-medium mb-1">⚠️ Restrições Ativas</p>
                    <p className="text-sm text-amber-800">
                      O atleta deve treinar com {injury.loadModificationPercentage}% da carga habitual. 
                      Exercícios envolvendo {injury.bodyPart} devem ser modificados ou evitados.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Treatment Plan */}
            {injury.treatmentPlan && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-slate-600" />
                  Plano de Tratamento
                </h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{injury.treatmentPlan}</p>
                </div>
              </div>
            )}

            {/* Medical Clearance */}
            {injury.medicalClearance && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Clearance Médico
                </h3>
                <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Clearance médico obtido
                      </p>
                      <p className="text-xs text-emerald-700">
                        {injury.medicalClearanceDate && 
                          `Emitido em ${new Date(injury.medicalClearanceDate).toLocaleDateString('pt-PT')}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {injury.notes && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  Notas Adicionais
                </h3>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{injury.notes}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                Timeline de Recuperação
              </h3>
              
              <div className="space-y-4">
                {timelineEvents.map((event, index) => {
                  const EventIcon = event.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-lg bg-${event.color}-500`}>
                          <EventIcon className="w-4 h-4 text-white" />
                        </div>
                        {index < timelineEvents.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{event.title}</p>
                          <span className="text-xs text-slate-500">
                            {new Date(event.date).toLocaleDateString('pt-PT', { 
                              day: '2-digit', 
                              month: 'short' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{event.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Status Change Actions */}
            {injury.recoveryStatus !== 'recovered' && onUpdateStatus && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Atualizar Estado</h3>
                <div className="grid grid-cols-2 gap-3">
                  {injury.recoveryStatus === 'active' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdateStatus(injury.id, 'recovering')}
                      className="p-3 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
                    >
                      <Timer className="w-5 h-5 mx-auto mb-1" />
                      Marcar como Recuperando
                    </motion.button>
                  )}
                  {(injury.recoveryStatus === 'active' || injury.recoveryStatus === 'recovering') && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdateStatus(injury.id, 'recovered')}
                      className="p-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                      Marcar como Recuperada
                    </motion.button>
                  )}
                </div>
              </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-sm font-semibold text-red-900 mb-3">
                  Tem a certeza que deseja eliminar este registo de lesão?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(injury.id);
                      onClose();
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Sim, eliminar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {(onEdit || onDelete) && !showDeleteConfirm && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Eliminar
                </motion.button>
              )}

              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onEdit(injury);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Edit className="w-5 h-5" />
                  Editar Lesão
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
