import { motion } from 'motion/react';
import { X, FileText, Download, Share2 } from 'lucide-react';

interface ReportDrawerProps {
  reportId: string;
  onClose: () => void;
}

export function ReportDrawer({ reportId, onClose }: ReportDrawerProps) {
  return (
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
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-full bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Relatório de Progresso</h2>
            <p className="text-sm text-slate-500 mt-0.5">ID: {reportId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">Viewer de Relatório</p>
            <p className="text-xs text-slate-500 mt-1">Preview e detalhes completos (em desenvolvimento)</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
