import { motion } from 'motion/react';
import { X, Send, Users, Mail } from 'lucide-react';

interface DistributionPanelProps {
  item: any;
  itemType: 'exercise' | 'workout' | 'plan' | 'class';
  onClose: () => void;
}

export function DistributionPanel({ item, itemType, onClose }: DistributionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Send className="h-6 w-6 text-sky-500" />
                Distribuir {itemType}
              </h2>
              <p className="text-sm text-slate-600">
                Envie "{item?.name}" para atletas ou equipes
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Distribuição em desenvolvimento
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Em breve você poderá enviar conteúdo diretamente para atletas e equipes
              </p>
              
              <div className="flex gap-3 justify-center">
                <button className="px-4 py-2 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 transition-all">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Enviar por Email
                </button>
                <button className="px-4 py-2 rounded-xl border-2 border-purple-200 bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 transition-all">
                  <Users className="h-4 w-4 inline mr-2" />
                  Atribuir a Atletas
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-all"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
