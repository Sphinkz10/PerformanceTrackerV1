import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle, TrendingDown, Calendar, DollarSign, Activity } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertsModal({ isOpen, onClose }: AlertsModalProps) {
  const alerts = [
    {
      id: "a1",
      type: "injury" as const,
      severity: "high" as const,
      title: "Atleta com lesão reportada",
      message: "João Silva reportou dor no joelho direito há 2 dias",
      icon: AlertCircle,
      color: "red",
      time: "Há 2 dias"
    },
    {
      id: "a2",
      type: "attendance" as const,
      severity: "medium" as const,
      title: "Baixa frequência detectada",
      message: "Carlos Mendes: apenas 3 sessões nas últimas 2 semanas",
      icon: TrendingDown,
      color: "amber",
      time: "Há 1 dia"
    },
    {
      id: "a3",
      type: "payment" as const,
      severity: "high" as const,
      title: "Pagamento atrasado",
      message: "Ana Rodrigues: mensalidade vencida há 5 dias (€89)",
      icon: DollarSign,
      color: "red",
      time: "Há 5 dias"
    },
    {
      id: "a4",
      type: "form" as const,
      severity: "low" as const,
      title: "Formulário não respondido",
      message: "Maria Santos: Questionário de Bem-estar Semanal pendente",
      icon: Calendar,
      color: "sky",
      time: "Há 3 dias"
    },
    {
      id: "a5",
      type: "performance" as const,
      severity: "medium" as const,
      title: "Queda de performance",
      message: "Pedro Costa: redução de 15% na carga de treino vs. mês anterior",
      icon: TrendingDown,
      color: "amber",
      time: "Há 1 semana"
    },
    {
      id: "a6",
      type: "injury" as const,
      severity: "medium" as const,
      title: "Retorno de lesão próximo",
      message: "Sofia Almeida: previsão de retorno em 3 dias",
      icon: Activity,
      color: "emerald",
      time: "Hoje"
    },
    {
      id: "a7",
      type: "payment" as const,
      severity: "high" as const,
      title: "Pagamento atrasado",
      message: "Miguel Ferreira: mensalidade vencida há 12 dias (€89)",
      icon: DollarSign,
      color: "red",
      time: "Há 12 dias"
    }
  ];

  const getSeverityBadge = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Urgente</span>;
      case "medium":
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Atenção</span>;
      case "low":
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sky-100 text-sky-700">Info</span>;
    }
  };

  // Helper function for color classes
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, border: string, icon: string }> = {
      red: {
        bg: "bg-gradient-to-r from-red-50 to-white",
        border: "border-red-200",
        icon: "bg-gradient-to-br from-red-500 to-red-600"
      },
      amber: {
        bg: "bg-gradient-to-r from-amber-50 to-white",
        border: "border-amber-200",
        icon: "bg-gradient-to-br from-amber-500 to-amber-600"
      },
      sky: {
        bg: "bg-gradient-to-r from-sky-50 to-white",
        border: "border-sky-200",
        icon: "bg-gradient-to-br from-sky-500 to-sky-600"
      },
      emerald: {
        bg: "bg-gradient-to-r from-emerald-50 to-white",
        border: "border-emerald-200",
        icon: "bg-gradient-to-br from-emerald-500 to-emerald-600"
      }
    };
    return colorMap[color] || colorMap.sky;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-white">
            <div>
              <h2 className="font-semibold text-slate-900 mb-1">🚨 Alertas</h2>
              <p className="text-sm text-slate-600">{alerts.length} alertas requerem atenção</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl border-2 ${getColorClasses(alert.color).border} ${getColorClasses(alert.color).bg} p-4 hover:shadow-md transition-all cursor-pointer`}
                    onClick={() => toast.info("Ver detalhes do alerta - Em desenvolvimento")}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`h-10 w-10 rounded-lg ${getColorClasses(alert.color).icon} flex items-center justify-center shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{alert.message}</p>
                        <p className="text-xs text-slate-500">{alert.time}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 pl-13">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Alerta resolvido");
                        }}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        Resolver
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Alerta adiado");
                        }}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
                      >
                        Adiar
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => {
                toast.success("Todos os alertas marcados como lidos");
                onClose();
              }}
              className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
            >
              Marcar Todos como Lidos
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}