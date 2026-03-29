import { motion } from 'motion/react';
import { FolderOpen, Upload } from 'lucide-react';
import { DrawerType } from '@/types/athlete-profile';

interface DocsTabProps {
  athleteId: string;
  onOpenDrawer: (drawer: DrawerType, data?: any) => void;
}

export function DocsTab({ onOpenDrawer }: DocsTabProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Documentos & Uploads</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Upload className="w-4 h-4" />
          Upload
        </motion.button>
      </div>

      <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
        <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">Sem documentos</p>
        <p className="text-xs text-slate-500 mt-1">Exames, consentimentos, vídeos técnicos (em desenvolvimento)</p>
      </div>
    </motion.div>
  );
}
