import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, X, Target, FileText, BarChart3, Lightbulb, 
  ArrowRight, Sparkles, TrendingUp
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface ActivationResult {
  packId: string;
  packName: string;
  packIcon: string;
  packColor: 'emerald' | 'sky' | 'amber' | 'violet' | 'red';
  metricsCreated: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  formCreated?: {
    id: string;
    name: string;
    fieldsCount: number;
  };
  reportCreated?: {
    id: string;
    name: string;
    sectionsCount: number;
  };
  decisionsCreated?: Array<{
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

interface PackActivationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  result: ActivationResult | null;
  onNavigate?: (target: 'metrics' | 'forms' | 'reports' | 'decisions') => void;
}

// ============================================================
// CONFETTI ANIMATION
// ============================================================

const Confetti: React.FC = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360,
    color: ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            y: -20, 
            x: `${piece.x}%`,
            opacity: 1,
            rotate: 0,
          }}
          animate={{ 
            y: '100vh', 
            x: `${piece.x + (Math.random() - 0.5) * 20}%`,
            opacity: 0,
            rotate: piece.rotation,
          }}
          transition={{ 
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
};

// ============================================================
// COLOR CONFIGS
// ============================================================

const colorConfig = {
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  violet: {
    gradient: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const PackActivationSuccessModal: React.FC<PackActivationSuccessModalProps> = ({
  open,
  onClose,
  result,
  onNavigate,
}) => {
  const [autoCloseIn, setAutoCloseIn] = useState(15);
  const [showConfetti, setShowConfetti] = useState(false);

  // Auto-close countdown
  useEffect(() => {
    if (!open || !result) {
      setAutoCloseIn(15);
      return;
    }

    setShowConfetti(true);

    const interval = setInterval(() => {
      setAutoCloseIn((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      setShowConfetti(false);
    };
  }, [open, result, onClose]);

  if (!open || !result) return null;

  const colors = colorConfig[result.packColor];

  const handleNavigate = (target: 'metrics' | 'forms' | 'reports' | 'decisions') => {
    onNavigate?.(target);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        {/* Confetti */}
        {showConfetti && <Confetti />}

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative"
        >
          {/* Success Header */}
          <div className={`p-6 border-b border-slate-200 ${colors.bg}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg"
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </motion.div>

                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-slate-900 flex items-center gap-2"
                  >
                    Pack Ativado com Sucesso!
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-slate-600 mt-1"
                  >
                    {result.packName} está agora disponível no teu workspace
                  </motion.p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/50 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Auto-close countdown */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 15, ease: 'linear' }}
                  className="h-full bg-emerald-500"
                />
              </div>
              <span className="whitespace-nowrap">Fecha em {autoCloseIn}s</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200"
              >
                <Target className="h-5 w-5 text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900">{result.metricsCreated.length}</p>
                <p className="text-xs text-slate-600">Métricas</p>
              </motion.div>

              {result.formCreated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200"
                >
                  <FileText className="h-5 w-5 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">1</p>
                  <p className="text-xs text-slate-600">Formulário</p>
                </motion.div>
              )}

              {result.reportCreated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200"
                >
                  <BarChart3 className="h-5 w-5 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">1</p>
                  <p className="text-xs text-slate-600">Report</p>
                </motion.div>
              )}

              {result.decisionsCreated && result.decisionsCreated.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200"
                >
                  <Lightbulb className="h-5 w-5 text-amber-600 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{result.decisionsCreated.length}</p>
                  <p className="text-xs text-slate-600">Decisões</p>
                </motion.div>
              )}
            </div>

            {/* Metrics Created */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Métricas Criadas</h3>
                <span className="text-xs text-slate-500">{result.metricsCreated.length} total</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.metricsCreated.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-md transition-all group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{metric.name}</p>
                      <p className="text-xs text-slate-500">{metric.type}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Form Created */}
            {result.formCreated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Formulário Criado</h4>
                    <p className="text-sm text-slate-700 mb-2">{result.formCreated.name}</p>
                    <p className="text-xs text-slate-600">
                      {result.formCreated.fieldsCount} fields · Auto-linked às métricas
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </motion.div>
            )}

            {/* Report Created */}
            {result.reportCreated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Report Template Criado</h4>
                    <p className="text-sm text-slate-700 mb-2">{result.reportCreated.name}</p>
                    <p className="text-xs text-slate-600">
                      {result.reportCreated.sectionsCount} sections · Visualizações pré-configuradas
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
              </motion.div>
            )}

            {/* Decisions Created */}
            {result.decisionsCreated && result.decisionsCreated.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="space-y-2"
              >
                <h3 className="font-bold text-slate-900">Regras de Decisão Configuradas</h3>
                {result.decisionsCreated.map((decision, index) => (
                  <div
                    key={decision.id}
                    className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200"
                  >
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    <p className="text-sm text-slate-900 flex-1">{decision.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      decision.severity === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : decision.severity === 'medium'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {decision.severity === 'high' ? 'Alta' : decision.severity === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-slate-700" />
                <h3 className="font-bold text-slate-900">Próximos Passos</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>As métricas já estão disponíveis no <strong>Metrics Manager</strong></span>
                </li>
                {result.formCreated && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Podes enviar o formulário aos atletas via <strong>Form Center</strong></span>
                  </li>
                )}
                {result.reportCreated && (
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Visualiza dados no <strong>Report Builder</strong></span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  <span>Começa a inserir valores via <strong>Manual Entry</strong></span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-sm rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>

            <div className="flex-1 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigate('metrics')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Ver Métricas</span>
                <span className="sm:hidden">Métricas</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              {result.formCreated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigate('forms')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Ver Form</span>
                  <span className="sm:hidden">Form</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PackActivationSuccessModal;